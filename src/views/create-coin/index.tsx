import { MemechanClientInstance } from "@/common/solana";
import { ThreadBoard } from "@/components/thread";
import { BoundPoolClient, MEMECHAN_QUOTE_TOKEN, sleep } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CreateCoinState, ICreateForm } from "./create-coin.types";
import {
  createCoinOnBE,
  createMemeCoin,
  handleAuthentication,
  handleErrors,
  uploadImageToIPFS,
  validateCoinParams,
} from "./create-coin.utils";

export function CreateCoin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateForm>();
  const { publicKey, connected, signMessage, sendTransaction } = useWallet();
  const [state, setState] = useState<CreateCoinState>("idle");
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!connected || !publicKey || !signMessage) {
        return toast.error("Please connect your wallet");
      }

      setState("sign");
      const walletAddress = publicKey.toBase58();
      await handleAuthentication(walletAddress, signMessage);

      setState("ipfs");
      let ipfsUrl = await uploadImageToIPFS(data.image[0]);
      validateCoinParams(data, walletAddress, ipfsUrl);

      setState("create_meme_and_pool");
      const { transaction, launchVaultId, memeMintKeypair, poolQuoteVaultId } = await createMemeCoin(
        data,
        publicKey,
        ipfsUrl,
      );

      const signature = await sendTransaction(transaction, MemechanClientInstance.connection, {
        signers: [launchVaultId, memeMintKeypair, poolQuoteVaultId],
        maxRetries: 3,
      });
      await sleep(3000);

      // Check pool and token creation succeeded
      const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
        await MemechanClientInstance.connection.getLatestBlockhash("confirmed");
      const createPoolAndTokenTxResult = await MemechanClientInstance.connection.confirmTransaction(
        {
          signature: signature,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        "confirmed",
      );
      console.log("createPoolAndTokenTxResult:", createPoolAndTokenTxResult);

      if (createPoolAndTokenTxResult.value.err) {
        console.error(
          "[Create Coin Submit] Pool and token creation failed:",
          JSON.stringify(createPoolAndTokenTxResult, null, 2),
        );
        toast("Failed to create pool and token. Please, try again");
        return;
      }

      const createdPoolId = BoundPoolClient.findBoundPoolPda(
        memeMintKeypair.publicKey,
        MEMECHAN_QUOTE_TOKEN.mint,
        MemechanClientInstance.memechanProgram.programId,
      );
      console.log("createdPoolId: ", createdPoolId.toString());
      const boundPool = await BoundPoolClient.fromPoolCreationTransaction({
        client: MemechanClientInstance,
        poolCreationSignature: signature,
      });
      console.log("boundPool:", boundPool);
      console.log("memeMint:", boundPool.memeTokenMint.toString());

      await createCoinOnBE(data, signature);
      console.log("created on BE");
      await sleep(3000);
      router.push(`/coin/${boundPool.memeTokenMint.toString()}`);
    } catch (e) {
      console.error("[Create Coin Submit] Error occured:", e);
      setState("idle");
      handleErrors(e);
    }
  });

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full lg:max-w-3xl">
        <ThreadBoard title="Create Meme Coin">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-regular">Meme Coin Details</h4>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Name</label>
                  <div>
                    <input
                      {...register("name", { required: true })}
                      className="border w-[200px] border-regular rounded-lg p-1"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">Name is required</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Symbol</label>
                  <div>
                    <input
                      {...register("symbol", { required: true })}
                      className="border w-[200px] border-regular rounded-lg p-1"
                    />
                  </div>
                  {errors.symbol && <p className="text-xs text-red-500">Synbol is required</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Image</label>
                  <div>
                    <input
                      type="file"
                      {...register("image", { required: true })}
                      // file limits
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                      // only select one fie
                      multiple={false}
                      className="border w-[200px] border-regular rounded-lg p-1"
                    />
                  </div>
                  {errors.image && <p className="text-xs text-red-500">Image is required</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-regular text-xs">Description</label>
                <div>
                  <textarea
                    {...register("description", { required: true })}
                    className="border w-[200px] border-regular rounded-lg p-1"
                  />
                </div>
                {errors.description && <p className="text-xs text-red-500">Description is required</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-regular">More Options</h4>
              <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Twitter (optional)</label>
                  <div>
                    <input {...register("twitter")} className="border w-[200px] border-regular rounded-lg p-1" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Telegram (optional)</label>
                  <div>
                    <input {...register("telegram")} className="border w-[200px] border-regular rounded-lg p-1" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Discord (optional)</label>
                  <div>
                    <input {...register("discord")} className="border w-[200px] border-regular rounded-lg p-1" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-regular text-xs">Website (optional)</label>
                  <div>
                    <input {...register("website")} className="border w-[200px] border-regular rounded-lg p-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div>
                <button
                  type="submit"
                  className="bg-regular text-white font-bold p-2 rounded-lg disabled:opacity-50"
                  disabled={state !== "idle"}
                >
                  {
                    {
                      idle: "Create Meme Coin",
                      sign: "Signing Message...",
                      ipfs: "Uploading Image...",
                      create_meme_and_pool: "Creating Meme Coin and Bonding Pool...",
                    }[state]
                  }
                </button>
              </div>
            </div>
          </form>
        </ThreadBoard>
      </div>
    </div>
  );
}
