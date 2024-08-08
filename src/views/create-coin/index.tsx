import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import SuccessModal from "@/components/successModal";
import { useConnection } from "@/context/ConnectionContext";
import { usePopup } from "@/context/PopupContext";
import { useBalance } from "@/hooks/useBalance";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { useSolanaPrice } from "@/hooks/useSolanaPrice";
import { useTargetConfig } from "@/hooks/useTargetConfig";
import { Button } from "@/memechan-ui/Atoms";
import Checkbox from "@/memechan-ui/Atoms/CheckBox/CheckBox";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import UncontrolledTextInput from "@/memechan-ui/Atoms/Input/UncontrolledTextInput";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import DownArrowIcon from "@/memechan-ui/icons/DownArrowIcon";
import UpArrowIcon from "@/memechan-ui/icons/UpArrowIcon";
import { TOKEN_INFOS, sleep } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TwitterIcon from "../../memechan-ui/icons/TwitterIcon";
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
    watch,
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateForm>();
  const { publicKey, connected, signMessage, sendTransaction } = useWallet();
  const [isChecked, setIsChecked] = useState(false);

  const { isPopupOpen, setIsPopupOpen } = usePopup();
  const [state, setState] = useState<CreateCoinState>("idle");
  const router = useRouter();
  const [inputAmount, setInputAmount] = useState<string>("0");
  const { solanaThresholdAmount } = useTargetConfig();
  const handleChange = () => {
    setIsChecked((prevState) => !prevState);
    setInputAmount("0");
  };
  const [hasMoreOptions, setHasMoreOptions] = useState(true);
  const { balance: solanaAmount } = useBalance(TOKEN_INFOS["WSOL"].mint.toString(), TOKEN_INFOS["WSOL"].decimals);
  const { data: solanaBalance } = useSolanaBalance();
  const { data: solanaPriceInUSD } = useSolanaPrice();
  const [successModalOpened, setSuccessModalOpened] = useState<boolean>(false);
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
        checked: isChecked,
      });

      setState("create_bonding_and_meme");

      toast(() => <span>Coin is created</span>);

      if (!createPoolTransaction) return;
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

  const nameInput = watch("name");
  const symbolInput = watch("symbol");
  const imageInput = watch("image");
  const filledRequired = nameInput && symbolInput && imageInput?.length && inputAmount;

  return (
    <div className="w-full flex flex-col items-center">
      {successModalOpened && (
        <SuccessModal
          setSuccessModalOpened={setSuccessModalOpened}
          headerText="Pepe successfully created"
          bodyText="Congrats, you’ve successfully created your memecoin. Now let’s get it’s bonding curve completed. Let’s start with posting these news in your twitter."
        >
          <Divider />
          {/* TODO ALDIN ADD TRANSACTION AND CA */}
          <div className="flex flex-col">
            <div className="flex justify-between">
              <Typography variant="body" color="mono-500">
                Transaction
              </Typography>
              <div>
                <Typography variant="text-button" underline>
                  fU1K...YsIF
                </Typography>
                <Typography variant="text-button" className="ml-3" underline color="primary-100">
                  Coppy
                </Typography>
              </div>
            </div>
            <div className="flex justify-between">
              <Typography variant="body" color="mono-500">
                CA
              </Typography>
              <div>
                <Typography variant="text-button" underline>
                  fU1K...YsIF
                </Typography>
                <Typography variant="text-button" className="ml-3" underline color="primary-100">
                  Coppy
                </Typography>
              </div>
            </div>
          </div>
          <div className="mt-[15px] h-14">
            <Button variant="primary" className="flex items-center justify-center">
              <TwitterIcon size={16} />
              <span className="ml-2 flex items-center">
                <Typography variant="h4">Share in Twitter</Typography>
              </span>
            </Button>
          </div>
        </SuccessModal>
      )}
      <TopBar rightIcon="/diamond.png" title={"Create Memecoin"}></TopBar>
      <div className="min-w-[345px] w-[-webkit-fill-available] sm:w-full sm:max-w-[406px] custom-outer-shadow flex items-center justify-center border border-mono-400 rounded-sm m-3 sm:mb-[-12px]">
        <div className="w-full lg:max-w-3xl m-4 ">
          <form onSubmit={onSubmit} className="flex flex-col ">
            <div className="flex flex-col gap-4">
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
                    <UncontrolledTextInput placeholder="Name" {...register("name", { required: true })} />
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
                    <UncontrolledTextInput placeholder="SYMBOL" {...register("symbol", { required: true })} />
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
                      resetField={resetField}
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
                <div className="h-32 max-h-32 ">
                  <textarea
                    {...register("description", { required: false })}
                    placeholder="Description"
                    className="text-[13px] h-32 max-h-32 border border-mono-400 p-4 flex-1 outline-none bg-transparent placeholder:text-[13px] placeholder:font-normal placeholder:leading-5 placeholder-mono-500 w-full"
                  />
                </div>
              </div>
            </div>
            <div className="">
              {hasMoreOptions && (
                <div className="w-fit mt-4 cursor-pointer" onClick={() => setHasMoreOptions(false)}>
                  <Typography variant="text-button" color="green-100" underline>
                    {"I'm not in hurry"}
                    <span className="inline-block ml-1">
                      <DownArrowIcon size={12} fill="var(--color-green-100)" />
                    </span>
                  </Typography>
                </div>
              )}
              {!hasMoreOptions ? (
                <div className="flex mt-4 flex-col gap-4 flex-wrap">
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
              ) : null}
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
              usdPrice={solanaPriceInUSD?.price ? Number(inputAmount ?? 0) * solanaPriceInUSD.price : 0}
              label={
                !isChecked
                  ? "Be the very first person to buy your token"
                  : "You can't buy tokens if free creation is selected"
              }
              showQuickInput={true}
              quickInputNumber
              disabled={isChecked}
              baseCurrencyAmount={baseCurrency.coinBalance}
              tokenDecimals={9}
              // labelRight={publicKey ? `👛 ${baseCurrency.coinBalance ?? 0} ${baseCurrency.currencyName}` : undefined}
            />
            <div className="flex flex-col gap-1 mt-4">
              {!connected || !publicKey || !signMessage ? (
                <div className="h-14">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPopupOpen(!isPopupOpen);
                    }}
                    variant="primary"
                  >
                    Connect Wallet
                  </Button>
                </div>
              ) : filledRequired ? (
                <div className="h-14">
                  {+inputAmount > baseCurrency.coinBalance ? (
                    <Button variant="disabled" className="grid py-2">
                      <Typography variant="h4"> Insufficient balance</Typography>
                    </Button>
                  ) : (
                    <Button variant="primary" className="grid py-2">
                      {
                        {
                          idle: "Create Now",
                          sign: "Signing Message...",
                          ipfs: "Uploading Image...",
                          create_bonding_and_meme: "Creating Bonding Curve Pool and memecoin...",
                        }[state]
                      }
                      <Typography variant="caption">0.02 SOL to deploy</Typography>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="h-14 bg-mono-400">
                  <Button variant="disabled" disabled>
                    <Typography variant="h4">Fill required fields to create memecoin</Typography>
                  </Button>
                </div>
              )}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleChange}
                  className="w-6 h-6 text-blue-600 form-checkbox"
                />
                <Typography variant="body" className="ml-2">
                  Create for free as chan user
                </Typography>
                <div className="flex items-center mt-2 border-mono-400 border p-4">
                  <Checkbox checked={isChecked} onChange={handleChange}>
                    <Typography variant="body" className="ml-2" color={isChecked ? "primary-100" : "mono-600"}>
                      Create for free without wallet
                    </Typography>
                  </Checkbox>
                </div>
              </div>
            </div>
            {/* IN CASE THEY WANT IT BACK 
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
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
