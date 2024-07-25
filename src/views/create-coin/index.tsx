import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useConnection } from "@/context/ConnectionContext";
import { useBalance } from "@/hooks/useBalance";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { useTargetConfig } from "@/hooks/useTargetConfig";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import UncontrolledTextInput from "@/memechan-ui/Atoms/Input/UncontrolledTextInput";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import DangerIcon from "@/memechan-ui/icons/DangerIcon";
import DownArrowIcon from "@/memechan-ui/icons/DownArrowIcon";
import UpArrowIcon from "@/memechan-ui/icons/UpArrowIcon";
import { MAX_DESCRIPTION_LENGTH, TOKEN_INFOS, sleep } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CreateCoinState, ICreateForm } from "./create-coin.types";
import {
  createCoinOnBE,
  createMemeCoinAndPool,
  handleAuthentication,
  handleErrors,
  uploadImageToIPFS,
  validateCoinParamsWithImage,
  validateCoinParamsWithoutImage,
} from "./create-coin.utils";

export function CreateCoin() {
  const {
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateForm>();
  const { publicKey, connected, signMessage, sendTransaction } = useWallet();
  const [state, setState] = useState<CreateCoinState>("idle");
  const router = useRouter();
  const [inputAmount, setInputAmount] = useState<string>("0");
  const { solanaThresholdAmount } = useTargetConfig();
  const [hasMoreOptions, setHasMoreOptions] = useState(true);
  const { balance: solanaAmount } = useBalance(TOKEN_INFOS["WSOL"].mint.toString(), TOKEN_INFOS["WSOL"].decimals);
  const { data: solanaBalance } = useSolanaBalance();

  const baseCurrency = {
    currencyName: "SOL",
    currencyLogoUrl: "/tokens/solana.png",
    coinBalance: solanaBalance ?? 0,
  };
  const { connection, memechanClientV2 } = useConnection();
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!connected || !publicKey || !signMessage) {
        return toast.error("Please connect your wallet");
      }

      // Checking all the entered coin params except of an image to let a user know, that some of them
      // are wrong without signing.
      validateCoinParamsWithoutImage(data);

      // Input amount validation
      let inputAmountIsSpecified = false;
      if (inputAmount !== "" && parseFloat(inputAmount) !== 0) {
        inputAmountIsSpecified = true;
      }

      if (inputAmountIsSpecified) {
        if (!solanaAmount) return toast.error("You need to have SOL for initial buy");

        const amountBigNumber = new BigNumber(inputAmount);
        const thresholdWithFees = solanaThresholdAmount
          ? new BigNumber(solanaThresholdAmount).multipliedBy(1.01)
          : null;

        if (amountBigNumber.isNaN()) return toast.error("Input amount must be a valid number");

        if (amountBigNumber.lt(0)) return toast.error("Input amount must be greater than zero");

        if (amountBigNumber.gt(solanaAmount)) return toast.error("Insufficient balance");

        if (thresholdWithFees && amountBigNumber.gt(thresholdWithFees))
          return toast.error(
            `The maximum SOL amount to invest in bonding pool is ${thresholdWithFees.toPrecision()} SOL`,
          );
      }

      console.log("inputAmountIsSpecified:", inputAmountIsSpecified);
      console.log("inputAmount:", inputAmount);

      const { image, ...dataWOImage } = data;
      const trackData = {
        inputAmount,
        ...dataWOImage,
      };

      track("CreateMemecoin_Start", trackData);

      setState("sign");
      const walletAddress = publicKey.toBase58();
      // If all the params except of the image are fine, then ask the user to sign a message to upload the image to IPFS.
      await handleAuthentication(walletAddress, signMessage);

      setState("ipfs");
      let ipfsUrl = await uploadImageToIPFS(data.image[0]);
      validateCoinParamsWithImage(data, ipfsUrl);

      const { createPoolTransaction, memeMint } = await createMemeCoinAndPool({
        data,
        ipfsUrl,
        publicKey,
        inputAmount: inputAmountIsSpecified ? inputAmount : undefined,
        client: memechanClientV2,
      });

      setState("create_bonding_and_meme");
      // Pool and meme creation
      const signature = await sendTransaction(createPoolTransaction, connection, {
        maxRetries: 3,
        skipPreflight: true,
      });
      console.log("signature:", signature);

      toast(() => <TransactionSentNotification signature={signature} />);
      await sleep(3000);

      toast("A few steps left...");

      // Retry policy to check that pool creation succeeded
      let creationCheckAttempt = 0;
      let maxCreationCheckAttempsCount = 5;
      let confirmationSucceeded = false;
      do {
        try {
          const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
          const txResult = await connection.confirmTransaction(
            {
              signature,
              blockhash: blockhash,
              lastValidBlockHeight: lastValidBlockHeight,
            },
            "confirmed",
          );
          console.log("txResult:", txResult);

          if (txResult.value.err) {
            console.error("[Create Coin Submit] Pool and meme creation failed:", JSON.stringify(txResult, null, 2));
            toast.error("Failed to create pool and memecoin. Please, try again");
            setState("idle");
            confirmationSucceeded = true;
            return;
          }

          confirmationSucceeded = true;
        } catch (e) {
          console.error("[Create Coin Submit] Error while trying to check the creation status:", e);
          creationCheckAttempt++;
          await sleep(4000);
        }
      } while (!confirmationSucceeded && creationCheckAttempt < maxCreationCheckAttempsCount);

      if (!confirmationSucceeded) {
        console.error("[Create Coin Submit] Pool and meme creation failed after all the retries.");
        toast.error("Failed to create pool and memecoin. Please, try again");
        setState("idle");
        return;
      }

      await sleep(5000);

      // Retry policy for coin creation on the BE
      let attempt = 0;
      let maxAttempsCount = 5;
      let backendCreationSucceeded = false;
      do {
        try {
          await createCoinOnBE(data, [signature]);
          backendCreationSucceeded = true;
          console.log("created on BE");
        } catch (e) {
          console.error("[Create Coin Submit] Error while trying to create on the BE:", e);
          attempt++;
          toast("Almost there...");
          await sleep(4000);
        }
      } while (!backendCreationSucceeded && attempt < maxAttempsCount);

      if (!backendCreationSucceeded) {
        toast.error("Failed to create the memecoin. Please, try again");
        setState("idle");
        return;
      }

      await sleep(3000);

      track("CreateMemecoin_Success", trackData);

      router.push(`/coin/${memeMint}`);
    } catch (e) {
      console.error("[Create Coin Submit] Error occured:", e);
      setState("idle");
      handleErrors(e);
    }
  });

  return (
    <div className="w-full flex flex-col items-center">
      <TopBar rightIcon="/diamond.png" title={"Create Memecoin"}></TopBar>
      <div className="min-w-[345px] sm:max-w-[406px] form-shadow flex items-center justify-center border border-mono-400 rounded-sm m-4">
        <div className="w-full lg:max-w-3xl m-4 ">
          <form onSubmit={onSubmit} className="flex flex-col ">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col  gap-4">
                <div className="flex flex-col gap-1">
                  <label>
                    <Typography variant="body" color="mono-500">
                      Token Name
                    </Typography>
                    <div className="inline-block ml-1">
                      <Typography variant="body" color="red-100">
                        *
                      </Typography>
                    </div>
                  </label>
                  <div>
                    <UncontrolledTextInput {...register("name", { required: true })} />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">Name is required</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>
                    <Typography variant="body" color="mono-500">
                      Symbol
                    </Typography>
                    <div className="inline-block ml-1">
                      <Typography variant="body" color="red-100">
                        *
                      </Typography>
                    </div>
                  </label>
                  <div>
                    <UncontrolledTextInput {...register("symbol", { required: true })} />
                  </div>
                  {errors.symbol && <p className="text-xs text-red-500">Synbol is required</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>
                    <Typography variant="body" color="mono-500">
                      Picture
                    </Typography>
                    <div className="inline-block ml-1">
                      <Typography variant="body" color="red-100">
                        *
                      </Typography>
                    </div>
                  </label>
                  <div>
                    <UncontrolledTextInput
                      fieldName="image"
                      resetField={() => resetField}
                      type="file"
                      {...register("image", { required: true })}
                    />
                  </div>
                  {errors.image && <p className="text-xs text-red-500">Image is required</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>
                  <Typography variant="body" color="mono-500">
                    Description
                  </Typography>
                </label>
                <div>
                  <textarea
                    {...register("description", { required: true })}
                    className=" h-32 border border-mono-400 p-4 flex-1 outline-none bg-transparent placeholder-mono-500 w-full"
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  />
                </div>
                {errors.description && <p className="text-xs text-red-500">Description is required</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {hasMoreOptions && (
                <div className="w-fit cursor-pointer" onClick={() => setHasMoreOptions(false)}>
                  <Typography variant="text-button" color="green-100" underline>
                    {"I'm not in hurry"}
                    <span className="inline-block ml-1">
                      <DownArrowIcon size={12} fill="var(--color-green-100)" />
                    </span>
                  </Typography>
                </div>
              )}

              {!hasMoreOptions ? (
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <label>
                      <Typography variant="body" color="mono-500">
                        Website
                      </Typography>
                    </label>
                    <div>
                      <UncontrolledTextInput placeholder="Website URL" {...register("website")} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>
                      <Typography variant="body" color="mono-500">
                        Twitter
                      </Typography>
                    </label>
                    <div>
                      <UncontrolledTextInput placeholder="Twitter URL" {...register("twitter")} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>
                      <Typography variant="body" color="mono-500">
                        Telegram
                      </Typography>
                    </label>
                    <div>
                      <UncontrolledTextInput placeholder="Telegram URL" {...register("telegram")} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>
                      <Typography variant="body" color="mono-500">
                        Discord
                      </Typography>
                    </label>
                    <div>
                      <UncontrolledTextInput placeholder="Discord URL" {...register("discord")} />
                    </div>
                  </div>

                  <div className=" w-fit cursor-pointer" onClick={() => setHasMoreOptions(true)}>
                    <Typography variant="text-button" color="red-100" underline>
                      {"Fuck it, I'm in hurry"}
                      <span className="inline-block ml-1">
                        <UpArrowIcon size={12} fill="var(--color-red-100)" />
                      </span>
                    </Typography>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className=" my-4">
              <Divider />
            </div>
            <SwapInput
              currencyName={baseCurrency.currencyName}
              inputValue={inputAmount}
              setInputValue={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              currencyLogoUrl={baseCurrency.currencyLogoUrl}
              // TODO:HARUN
              // usdPrice={13.99}
              label="Pay"
              labelRight={publicKey ? `👛 ${baseCurrency.coinBalance ?? 0} ${baseCurrency.currencyName}` : undefined}
            />
            <div className="flex flex-col gap-1 mt-4">
              <div>
                <Button variant="primary">
                  {
                    {
                      idle: "Create Now",
                      sign: "Signing Message...",
                      ipfs: "Uploading Image...",
                      create_bonding_and_meme: "Creating Bonding Curve Pool and memecoin...",
                    }[state]
                  }
                </Button>
              </div>
            </div>
            <div className="border border-mono-400 mt-4 h-13 py-2 px-4 flex items-center">
              <div className="flex  items-baseline">
                <div className="  mr-4 flex align-baseline">
                  <DangerIcon size={13} fill="var(--color-yellow-100)" />
                </div>
                <div className="flex items-center">
                  <Typography variant="body" color="yellow-100">
                    You’ll be able to add/edit description and links later after your coin is created.
                  </Typography>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
