import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useConnection } from "@/context/ConnectionContext";
import { useBalance } from "@/hooks/useBalance";
import { useTargetConfig } from "@/hooks/useTargetConfig";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  TOKEN_INFOS,
  sleep,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateForm>();
  const { publicKey, connected, signMessage, sendTransaction } = useWallet();
  const [state, setState] = useState<CreateCoinState>("idle");
  const router = useRouter();
  const [inputAmount, setInputAmount] = useState<string>("0");
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const { solanaThresholdAmount } = useTargetConfig();

  const { balance: solanaAmount } = useBalance(TOKEN_INFOS["WSOL"].mint.toString(), TOKEN_INFOS["WSOL"].decimals);

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
    <div className="w-full flex items-center border border-monochrome-400 justify-center p-4">
      <div className="w-full  ">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-regular">Memecoin Details</h4>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-regular text-xs">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                  maxLength={MAX_NAME_LENGTH}
                />
                {errors.name && <p className="text-xs text-red-500">Name is required</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-regular text-xs">Symbol</label>
                <input
                  {...register("symbol", { required: true })}
                  className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                  maxLength={MAX_SYMBOL_LENGTH}
                />
                {errors.symbol && <p className="text-xs text-red-500">Symbol is required</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-regular text-xs">Image</label>
                <input
                  type="file"
                  {...register("image", { required: true })}
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  multiple={false}
                  className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                />
                <span className="text-xs text-regular">Attach file</span>
                {errors.image && <p className="text-xs text-red-500">Image is required</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-regular text-xs">Description</label>
                <textarea
                  {...register("description", { required: true })}
                  className="border h-[128px] w-full border-monochrome-400 rounded-sm"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                {errors.description && <p className="text-xs text-red-500">Description is required</p>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="text-sm text-regular underline"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
            >
              {"I'm"} not in a hurry
            </button>
            {showOptionalFields && (
              <>
                <h4 className="text-sm font-bold text-regular">More Options</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-regular text-xs">Twitter (optional)</label>
                    <input
                      {...register("twitter")}
                      className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-regular text-xs">Telegram (optional)</label>
                    <input
                      {...register("telegram")}
                      className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-regular text-xs">Discord (optional)</label>
                    <input
                      {...register("discord")}
                      className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-regular text-xs">Website (optional)</label>
                    <input
                      {...register("website")}
                      className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-regular">Buy your meme first</h4>
            <div className="flex flex-col gap-1">
              <label className="text-regular text-xs">SOL amount</label>
              <input
                className="border h-13 bg-inherit shadow-inner w-full border-monochrome-400 rounded-sm"
                onChange={(e) => setInputAmount(e.target.value)}
                value={inputAmount}
                type="number"
                min="0"
                placeholder="0"
                step={10 ** -9}
              />
              <span className="text-regular">
                SOL available: {publicKey ? (solanaAmount && (+solanaAmount).toFixed(4)) ?? <Skeleton width={40} /> : 0}
              </span>
            </div>
          </div>
          <div className="text-regular">
            <i>Creation cost: ~0.02 SOL</i>
          </div>
          <button
            type="submit"
            className="bg-regular text-white font-bold p-2 rounded-lg disabled:opacity-50 lowercase"
            disabled={state !== "idle"}
          >
            {
              {
                idle: "Create memecoin",
                sign: "Signing Message...",
                ipfs: "Uploading Image...",
                create_bonding_and_meme: "Creating Bonding Curve Pool and memecoin...",
              }[state]
            }
          </button>
        </form>
      </div>
    </div>
  );
}

// import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
// import { ThreadBoard } from "@/components/thread";
// import { useConnection } from "@/context/ConnectionContext";
// import { useBalance } from "@/hooks/useBalance";
// import { useTargetConfig } from "@/hooks/useTargetConfig";
// import {
//   MAX_DESCRIPTION_LENGTH,
//   MAX_NAME_LENGTH,
//   MAX_SYMBOL_LENGTH,
//   TOKEN_INFOS,
//   sleep,
// } from "@avernikoz/memechan-sol-sdk";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { track } from "@vercel/analytics";
// import BigNumber from "bignumber.js";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import Skeleton from "react-loading-skeleton";
// import { CreateCoinState, ICreateForm } from "./create-coin.types";
// import {
//   createCoinOnBE,
//   createMemeCoinAndPool,
//   handleAuthentication,
//   handleErrors,
//   uploadImageToIPFS,
//   validateCoinParamsWithImage,
//   validateCoinParamsWithoutImage,
// } from "./create-coin.utils";

// export function CreateCoin() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ICreateForm>();
//   const { publicKey, connected, signMessage, sendTransaction } = useWallet();
//   const [state, setState] = useState<CreateCoinState>("idle");
//   const router = useRouter();
//   const [inputAmount, setInputAmount] = useState<string>("0");
//   const { solanaThresholdAmount } = useTargetConfig();

//   const { balance: solanaAmount } = useBalance(TOKEN_INFOS["WSOL"].mint.toString(), TOKEN_INFOS["WSOL"].decimals);

//   const { connection, memechanClientV2 } = useConnection();

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       if (!connected || !publicKey || !signMessage) {
//         return toast.error("Please connect your wallet");
//       }

//       // Checking all the entered coin params except of an image to let a user know, that some of them
//       // are wrong without signing.
//       validateCoinParamsWithoutImage(data);

//       // Input amount validation
//       let inputAmountIsSpecified = false;
//       if (inputAmount !== "" && parseFloat(inputAmount) !== 0) {
//         inputAmountIsSpecified = true;
//       }

//       if (inputAmountIsSpecified) {
//         if (!solanaAmount) return toast.error("You need to have SOL for initial buy");

//         const amountBigNumber = new BigNumber(inputAmount);
//         const thresholdWithFees = solanaThresholdAmount
//           ? new BigNumber(solanaThresholdAmount).multipliedBy(1.01)
//           : null;

//         if (amountBigNumber.isNaN()) return toast.error("Input amount must be a valid number");

//         if (amountBigNumber.lt(0)) return toast.error("Input amount must be greater than zero");

//         if (amountBigNumber.gt(solanaAmount)) return toast.error("Insufficient balance");

//         if (thresholdWithFees && amountBigNumber.gt(thresholdWithFees))
//           return toast.error(
//             `The maximum SOL amount to invest in bonding pool is ${thresholdWithFees.toPrecision()} SOL`,
//           );
//       }

//       console.log("inputAmountIsSpecified:", inputAmountIsSpecified);
//       console.log("inputAmount:", inputAmount);

//       const { image, ...dataWOImage } = data;
//       const trackData = {
//         inputAmount,
//         ...dataWOImage,
//       };

//       track("CreateMemecoin_Start", trackData);

//       setState("sign");
//       const walletAddress = publicKey.toBase58();
//       // If all the params except of the image are fine, then ask the user to sign a message to upload the image to IPFS.
//       await handleAuthentication(walletAddress, signMessage);

//       setState("ipfs");
//       let ipfsUrl = await uploadImageToIPFS(data.image[0]);
//       validateCoinParamsWithImage(data, ipfsUrl);

//       const { createPoolTransaction, memeMint } = await createMemeCoinAndPool({
//         data,
//         ipfsUrl,
//         publicKey,
//         inputAmount: inputAmountIsSpecified ? inputAmount : undefined,
//         client: memechanClientV2,
//       });

//       setState("create_bonding_and_meme");
//       // Pool and meme creation
//       const signature = await sendTransaction(createPoolTransaction, connection, {
//         maxRetries: 3,
//         skipPreflight: true,
//       });
//       console.log("signature:", signature);

//       toast(() => <TransactionSentNotification signature={signature} />);
//       await sleep(3000);

//       toast("A few steps left...");

//       // Retry policy to check that pool creation succeeded
//       let creationCheckAttempt = 0;
//       let maxCreationCheckAttempsCount = 5;
//       let confirmationSucceeded = false;
//       do {
//         try {
//           const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
//           const txResult = await connection.confirmTransaction(
//             {
//               signature,
//               blockhash: blockhash,
//               lastValidBlockHeight: lastValidBlockHeight,
//             },
//             "confirmed",
//           );
//           console.log("txResult:", txResult);

//           if (txResult.value.err) {
//             console.error("[Create Coin Submit] Pool and meme creation failed:", JSON.stringify(txResult, null, 2));
//             toast.error("Failed to create pool and memecoin. Please, try again");
//             setState("idle");
//             confirmationSucceeded = true;
//             return;
//           }

//           confirmationSucceeded = true;
//         } catch (e) {
//           console.error("[Create Coin Submit] Error while trying to check the creation status:", e);
//           creationCheckAttempt++;
//           await sleep(4000);
//         }
//       } while (!confirmationSucceeded && creationCheckAttempt < maxCreationCheckAttempsCount);

//       if (!confirmationSucceeded) {
//         console.error("[Create Coin Submit] Pool and meme creation failed after all the retries.");
//         toast.error("Failed to create pool and memecoin. Please, try again");
//         setState("idle");
//         return;
//       }

//       await sleep(5000);

//       // Retry policy for coin creation on the BE
//       let attempt = 0;
//       let maxAttempsCount = 5;
//       let backendCreationSucceeded = false;
//       do {
//         try {
//           await createCoinOnBE(data, [signature]);
//           backendCreationSucceeded = true;
//           console.log("created on BE");
//         } catch (e) {
//           console.error("[Create Coin Submit] Error while trying to create on the BE:", e);
//           attempt++;
//           toast("Almost there...");
//           await sleep(4000);
//         }
//       } while (!backendCreationSucceeded && attempt < maxAttempsCount);

//       if (!backendCreationSucceeded) {
//         toast.error("Failed to create the memecoin. Please, try again");
//         setState("idle");
//         return;
//       }

//       await sleep(3000);

//       track("CreateMemecoin_Success", trackData);

//       router.push(`/coin/${memeMint}`);
//     } catch (e) {
//       console.error("[Create Coin Submit] Error occured:", e);
//       setState("idle");
//       handleErrors(e);
//     }
//   });

//   return (
//     <div className="w-full flex items-center justify-center">
//       <div className="w-full lg:max-w-3xl">
//         <ThreadBoard title="create memecoin" showNavigateBtn>
//           <form onSubmit={onSubmit} className="flex flex-col gap-4 lowercase">
//             <div className="flex flex-col gap-2">
//               <h4 className="text-sm font-bold text-regular lowercase">Memecoin Details</h4>
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Name</label>
//                   <div>
//                     <input
//                       {...register("name", { required: true })}
//                       className="border w-[200px] border-regular rounded-lg p-1"
//                       maxLength={MAX_NAME_LENGTH}
//                     />
//                   </div>
//                   {errors.name && <p className="text-xs text-red-500">Name is required</p>}
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Symbol</label>
//                   <div>
//                     <input
//                       {...register("symbol", { required: true })}
//                       className="border w-[200px] border-regular rounded-lg p-1"
//                       maxLength={MAX_SYMBOL_LENGTH}
//                     />
//                   </div>
//                   {errors.symbol && <p className="text-xs text-red-500">Synbol is required</p>}
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Image</label>
//                   <div>
//                     <input
//                       type="file"
//                       {...register("image", { required: true })}
//                       // file limits
//                       accept="image/png, image/jpeg, image/jpg, image/gif"
//                       // only select one fie
//                       multiple={false}
//                       className="border w-[200px] border-regular rounded-lg p-1"
//                     />
//                   </div>
//                   {errors.image && <p className="text-xs text-red-500">Image is required</p>}
//                 </div>
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="text-regular text-xs">Description</label>
//                 <div>
//                   <textarea
//                     {...register("description", { required: true })}
//                     className="border w-[200px] border-regular rounded-lg p-1"
//                     maxLength={MAX_DESCRIPTION_LENGTH}
//                   />
//                 </div>
//                 {errors.description && <p className="text-xs text-red-500">Description is required</p>}
//               </div>
//             </div>
//             <div className="flex flex-col gap-2">
//               <h4 className="text-sm font-bold text-regular">More Options</h4>
//               <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Twitter (optional)</label>
//                   <div>
//                     <input {...register("twitter")} className="border w-[200px] border-regular rounded-lg p-1" />
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Telegram (optional)</label>
//                   <div>
//                     <input {...register("telegram")} className="border w-[200px] border-regular rounded-lg p-1" />
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Discord (optional)</label>
//                   <div>
//                     <input {...register("discord")} className="border w-[200px] border-regular rounded-lg p-1" />
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">Website (optional)</label>
//                   <div>
//                     <input {...register("website")} className="border w-[200px] border-regular rounded-lg p-1" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-2">
//               <h4 className="text-sm font-bold text-regular">Buy your meme first</h4>
//               <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-regular text-xs">SOL amount</label>
//                   <div>
//                     <input
//                       className="border w-[200px] border-regular rounded-lg p-1"
//                       onChange={(e) => setInputAmount(e.target.value)}
//                       value={inputAmount}
//                       type="number"
//                       min="0"
//                       placeholder="0"
//                       step={10 ** -9}
//                     />
//                   </div>
//                   <span className="text-regular">
//                     SOL available:{" "}
//                     {publicKey ? (solanaAmount && (+solanaAmount).toFixed(4)) ?? <Skeleton width={40} /> : 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="text-regular">
//               <i>Creation cost: ~0.02 SOL</i>
//             </div>
//             <div className="flex flex-col gap-1">
//               <div>
//                 <button
//                   type="submit"
//                   className="bg-regular text-white font-bold p-2 rounded-lg disabled:opacity-50 lowercase"
//                   disabled={state !== "idle"}
//                 >
//                   {
//                     {
//                       idle: "Create memecoin",
//                       sign: "Signing Message...",
//                       ipfs: "Uploading Image...",
//                       create_bonding_and_meme: "Creating Bonding Curve Pool and memecoin...",
//                     }[state]
//                   }
//                 </button>
//               </div>
//             </div>
//           </form>
//         </ThreadBoard>
//       </div>
//     </div>
//   );
// }
