import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useConnection } from "@/context/ConnectionContext";
import { useLivePoolClient } from "@/hooks/live/useLivePoolClient";
import { useBalance } from "@/hooks/useBalance";
import { useTokenAccounts } from "@/hooks/useTokenAccounts";
import { getTokenInfo } from "@/hooks/utils";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
// import SwapInput from "@/memechan-ui/Atoms/Input/SwapInput";
import { WithConnectedWallet } from "@/components/WithConnectedWallet";
import { QUOTE_TOKEN_DECIMALS } from "@/constants/constants";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { GetLiveSwapTransactionParams, GetSwapOutputAmountParams } from "@/types/hooks";
import { parseChainValue } from "@/utils/parseChainValue";
import { MEMECHAN_MEME_TOKEN_DECIMALS, SwapMemeOutput, buildTxs } from "@avernikoz/memechan-sol-sdk";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { faUpDown } from "@fortawesome/free-solid-svg-icons/faUpDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { track } from "@vercel/analytics";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LiveCoinSwapProps } from "../../coin.types";
import { liveSwapParamsAreValid } from "../../coin.utils";
import { handleSwapInputChange, validateSlippage } from "./utils";

export const LiveCoinSwap = ({
  tokenSymbol,
  pool: { id: address, baseMint: tokenAddress, quoteMint },
  memeImage,
}: LiveCoinSwapProps) => {
  const [coinToMeme, setCoinToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputData, setOutputData] = useState<SwapMemeOutput | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const tokenData = getTokenInfo({ variant: "string", tokenAddress: quoteMint });

  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: livePoolClient } = useLivePoolClient(address);

  const { balance: coinBalance, isLoading: isBalanceLoading } = useBalance(
    tokenData.mint.toString(),
    tokenData.decimals,
  );
  const { balance: memeBalance, isLoading: isMemeBalanceLoading } = useBalance(
    tokenAddress,
    MEMECHAN_MEME_TOKEN_DECIMALS,
  );
  const { data: tokenAccounts, refetch: refetchTokenAccounts } = useTokenAccounts();

  const getSwapOutputAmount = useCallback(
    async ({
      inputAmount,
      coinToMeme,
      slippagePercentage,
    }: GetSwapOutputAmountParams): Promise<SwapMemeOutput | undefined> => {
      if (!livePoolClient) {
        return undefined;
      }

      return coinToMeme
        ? ((await livePoolClient.livePool.getBuyMemeOutput({
            poolAddress: address,
            amountIn: inputAmount,
            slippagePercentage,
            connection,
            memeCoinMint: tokenAddress,
          })) as SwapMemeOutput)
        : ((await livePoolClient.livePool.getSellMemeOutput({
            poolAddress: address,
            amountIn: inputAmount,
            slippagePercentage,
            connection,
            memeCoinMint: tokenAddress,
          })) as SwapMemeOutput);
    },
    [address, tokenAddress, connection, livePoolClient],
  );

  // TODO:TYPESCRIPT.
  const getSwapTransactions = useCallback(
    async ({ outputData, coinToMeme }: GetLiveSwapTransactionParams): Promise<any> => {
      if (!publicKey || !tokenAccounts || !livePoolClient) return;

      if (coinToMeme) {
        if (livePoolClient.version === "V1") {
          return await livePoolClient.livePool.getBuyMemeTransactionsByOutput({
            ...outputData,
            connection,
            payer: publicKey,
            walletTokenAccounts: tokenAccounts,
          });
        } else {
          return await livePoolClient.livePool.getBuyMemeTransactionsByOutput({
            ...outputData,
            inTokenMint: new PublicKey("So11111111111111111111111111111111111111112"),
            payer: publicKey,
            minAmountOut: outputData.minAmountOut as any,
            wrappedAmountIn: outputData.wrappedAmountIn as any,
          } as any);
        }
      } else {
        if (livePoolClient.version === "V1") {
          return await livePoolClient.livePool.getSellMemeTransactionsByOutput({
            ...outputData,
            connection,
            payer: publicKey,
            walletTokenAccounts: tokenAccounts,
          });
        } else {
          return await livePoolClient.livePool.getSellMemeTransactionsByOutput({
            ...outputData,
            inTokenMint: new PublicKey(tokenAddress),
            payer: publicKey,
            minAmountOut: outputData.minAmountOut as any,
            wrappedAmountIn: outputData.wrappedAmountIn as any,
          });
        }
      }
    },
    [publicKey, tokenAccounts, livePoolClient, connection, tokenAddress],
  );

  useEffect(() => {
    setInputAmount("");
    setOutputData(null);
  }, [coinToMeme]);

  useEffect(() => {
    if (inputAmount === "0" || inputAmount === "") {
      setOutputData(null);
      return;
    }

    const updateOutputAmount = async () => {
      try {
        setIsLoadingOutputAmount(true);

        if (!validateSlippage(slippage)) return;

        const outputData = await getSwapOutputAmount({ inputAmount, coinToMeme, slippagePercentage: +slippage });
        if (!outputData) {
          setOutputData(null);
          return;
        }

        setOutputData(outputData);
      } catch (e) {
        console.error("[LiveCoinSwap.updateOutputAmount] Failed to get the swap output amount:", e);
        toast.error("Please, try again: cannot calculate output amount for the swap");
        setOutputData(null);
      } finally {
        setIsLoadingOutputAmount(false);
      }
    };

    const timeoutId = setTimeout(() => updateOutputAmount(), 1000);
    return () => clearTimeout(timeoutId);
  }, [getSwapOutputAmount, inputAmount, coinToMeme, slippage]);

  const onSwap = useCallback(async () => {
    console.log(publicKey, outputData, signTransaction, coinBalance);
    if (!publicKey || !outputData || !signTransaction || !coinBalance) return;

    const swapTrackObj = {
      tokenAddress,
      tokenSymbol,
      inputAmount,
      memeBalance: +(memeBalance?.toString() ?? 0),
      outputAmount: +outputData.minAmountOut.toString(),
      slippage,
      coinBalance,
      coinToMeme,
      type: "live",
    };

    track("Swap", swapTrackObj);

    if (!liveSwapParamsAreValid({ inputAmount, memeBalance, coinBalance, coinToMeme, slippagePercentage: +slippage }))
      return;

    try {
      setIsSwapping(true);
      const simpleSwapTransactions = await getSwapTransactions({ coinToMeme, outputData });
      if (!simpleSwapTransactions) {
        toast.error("Failed to create the swap transaction. Please, try again");
        return;
      }

      if (livePoolClient?.version === "V2") {
        const signature = await sendTransaction(simpleSwapTransactions, connection, {
          maxRetries: 3,
          skipPreflight: true,
        });

        const signatures: string[] = [signature];

        for (const signature of signatures) {
          const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
            await connection.getLatestBlockhash("confirmed");

          const swapTxResult = await connection.confirmTransaction(
            {
              signature: signature,
              blockhash: blockhash,
              lastValidBlockHeight: lastValidBlockHeight,
            },
            "confirmed",
          );

          if (swapTxResult.value.err) {
            console.error("[LiveCoinSwap.onSwap] Sell failed:", JSON.stringify(swapTxResult, null, 2));
            toast("Swap failed. Please, try again");
            return;
          }
        }
      } else {
        const swapTransactions = await buildTxs(connection, publicKey, simpleSwapTransactions);
        const signatures: string[] = [];
        for (const tx of swapTransactions) {
          const signature = await sendTransaction(tx, connection, {
            skipPreflight: true,
            maxRetries: 3,
          });

          signatures.push(signature);

          toast(() => <TransactionSentNotification signature={signature} />);
        }

        for (const signature of signatures) {
          const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
            await connection.getLatestBlockhash("confirmed");

          const swapTxResult = await connection.confirmTransaction(
            {
              signature: signature,
              blockhash: blockhash,
              lastValidBlockHeight: lastValidBlockHeight,
            },
            "confirmed",
          );

          if (swapTxResult.value.err) {
            console.error("[LiveCoinSwap.onSwap] Sell failed:", JSON.stringify(swapTxResult, null, 2));
            toast("Swap failed. Please, try again");
            return;
          }
        }
      }

      track("Swap_Success", swapTrackObj);

      setIsSwapping(false);

      toast.success("Swap succeeded");
      refetchTokenAccounts();
      return;
    } catch (e) {
      console.error("[LiveCoinSwap.onSwap] Swap error:", e);
      toast.error("Failed to swap. Please, try again");
      return;
    } finally {
      setIsSwapping(false);
    }
  }, [
    publicKey,
    outputData,
    signTransaction,
    coinBalance,
    tokenAddress,
    tokenSymbol,
    inputAmount,
    memeBalance,
    slippage,
    coinToMeme,
    getSwapTransactions,
    livePoolClient?.version,
    refetchTokenAccounts,
    sendTransaction,
    connection,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || outputData === null;

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSwapInputChange({
      decimalPlaces: coinToMeme ? tokenData.decimals : MEMECHAN_MEME_TOKEN_DECIMALS,
      e,
      setValue: setInputAmount,
    });
  };

  const onSwapClick = () => {
    setCoinToMeme((prev) => !prev);
  };

  const [variant, setVariant] = useState<"swap" | "claim">("swap");
  const isVariantSwap = variant === "swap";
  const refresh = () => {};
  const onReverseClick = () => {};
  const onSlippageClick = () => {
    console.log(slippage);
  };
  const onCloseClick = () => {};
  // tokenSymbol
  // tokenData.displayName

  let toReceive = "0";

  // TODO:TEST
  if (tokenData.symbol === "SOL" && outputData) {
    if (coinToMeme) {
      toReceive = parseChainValue(Number(outputData.minAmountOut.toString()), MEMECHAN_MEME_TOKEN_DECIMALS, 6);
    } else {
      parseChainValue(Number(outputData.minAmountOut.toString()), QUOTE_TOKEN_DECIMALS, 12);
    }
  } else if (tokenData.symbol !== "SOL" && outputData) {
    if (coinToMeme) {
      toReceive = parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 2);
    } else {
      toReceive = parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 12);
    }
  }
  // const { data: solanaBalance } = useSolanaBalance();
  // const { data: memePrice } = useLiveMemePrice(address);
  // useLiveMemePrice

  // console.log(toReceive);
  // console.log(memePrice?.priceInUsd);
  // TODO:HARUN fix money later
  // const formattedValue = formatMoney(toReceive);
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between w-full">
          <div className="flex gap-1">
            <Typography
              variant="h4"
              onClick={() => setVariant("swap")}
              className={isVariantSwap ? "order-1" : "order-2"}
            >
              Swap
            </Typography>
            <Typography
              variant="text-button"
              underline
              onClick={() => setVariant("claim")}
              className={isVariantSwap ? "order-2" : "order-1"}
            >
              Claim
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Typography underline onClick={onSlippageClick}>
              Slippage {slippage}%
            </Typography>
            <Typography onClick={refresh}>🔄</Typography>
            <Divider vertical className="bg-mono-600" />
            <Typography onClick={onCloseClick}>
              <FontAwesomeIcon icon={faClose} fontSize={16} />
            </Typography>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col">
          <SwapInput
            currencyName={"SOL"}
            inputValue={inputAmount}
            setInputValue={onInputChange}
            placeholder="0.00"
            currencyLogoUrl="/tokens/solana.png"
            // usdPrice={13.99}
            label="Pay"
            // labelRight={`👛 0 ${tokenSymbol}`}
          />
          <div className="relative h-12">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-mono-400"></div>
            <div
              onClick={() => {
                if (!swapButtonIsDiabled) {
                  onReverseClick();
                }
              }}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-mono-200 hover:bg-mono-300 cursor-pointer border-2 border-mono-400 rounded-sm flex justify-center items-center ${swapButtonIsDiabled && "cursor-not-allowed hover:bg-mono-200"}`}
            >
              <FontAwesomeIcon icon={faUpDown} className="text-white" fontWeight={100} />
            </div>
          </div>
          <SwapInput
            currencyName={tokenSymbol}
            type="text"
            inputValue={toReceive}
            currencyLogoUrl={memeImage}
            label="Receive"
            isReadOnly
            // usdPrice={memePrice?.priceInUsd ? +toReceive * +memePrice.priceInUsd : 0}
            // labelRight={`👛 0 SLORK`}
          />
        </div>
        <WithConnectedWallet
          variant="primary"
          className="mt-4 p-1"
          disabled={swapButtonIsDiabled || isLoadingOutputAmount}
          onClick={onSwap}
          isLoading={isSwapping || isLoadingOutputAmount}
        >
          <Typography variant="h4">
            {isLoadingOutputAmount ? "Calculating..." : isSwapping ? "Swapping..." : "Swap"}
          </Typography>
        </WithConnectedWallet>
      </Card.Body>
    </Card>
  );

  // return (
  //   <Swap
  //     slippage={+slippage}
  //     memeImage={memeImage}
  //     onSwapClick={() => setCoinToMeme((prev) => !prev)}
  //     onInputChange={onInputChange}
  //     coinToMeme={coinToMeme}
  //   />
  // );

  // <>
  //   <div className="flex w-full flex-row gap-2">
  //     <SwapButton coinToMeme={coinToMeme} onClick={() => setCoinToMeme(true)} label="Buy" />
  //     <SwapButton coinToMeme={!coinToMeme} onClick={() => setCoinToMeme(false)} label="Sell" />
  //   </div>
  //   <div className="flex w-full flex-col gap-1">
  //     <InputAmountTitle
  //       memeBalance={memeBalance}
  //       setInputAmount={setInputAmount}
  //       setOutputData={setOutputData}
  //       coinBalance={coinBalance}
  //       coinToMeme={coinToMeme}
  //       tokenSymbol={tokenSymbol}
  //       quoteMint={quoteMint}
  //     />
  //     <input
  //       className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
  //       value={inputAmount}
  //       onChange={(e) =>
  //         handleSwapInputChange({
  //           decimalPlaces: coinToMeme ? tokenData.decimals : MEMECHAN_MEME_TOKEN_DECIMALS,
  //           e,
  //           setValue: setInputAmount,
  //         })
  //       }
  //       placeholder="0"
  //       type="text"
  //     />
  //     {coinToMeme && (
  //       <div className="text-xs font-bold text-regular">
  //         available {tokenData.displayName}:{" "}
  //         {publicKey && coinBalance
  //           ? Number(coinBalance).toLocaleString(undefined, {
  //               maximumFractionDigits: tokenData.decimals,
  //             }) ?? "loading..."
  //           : "0"}
  //       </div>
  //     )}
  //     {!coinToMeme && memeBalance && (
  //       <div className="text-xs !normal-case font-bold text-regular">
  //         available {tokenSymbol} to sell: {formatNumber(Number(memeBalance), MEMECHAN_MEME_TOKEN_DECIMALS)}
  //       </div>
  //     )}
  //     {isLoadingOutputAmount && (
  //       <div className="text-xs font-bold text-regular">
  //         {coinToMeme ? (
  //           <span>{tokenSymbol} to receive: loading...</span>
  //         ) : (
  //           <span>{tokenData.displayName} to receive: loading...</span>
  //         )}
  //       </div>
  //     )}
  //     {outputData !== null && !isLoadingOutputAmount && (
  //       <div className="text-xs font-bold text-regular">
  //         {coinToMeme
  //           ? `${tokenSymbol} to receive: ${tokenData.symbol === "SOL" ? parseChainValue(Number(outputData.minAmountOut.toString()), MEMECHAN_MEME_TOKEN_DECIMALS, 6) : parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 2)}`
  //           : `${tokenData.displayName} to receive: ${tokenData.symbol === "SOL" ? parseChainValue(Number(outputData.minAmountOut.toString()), QUOTE_TOKEN_DECIMALS, 12) : parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 12)}`}
  //       </div>
  //     )}
  //   </div>
  //   <div className="flex w-full flex-col gap-1">
  //     <div className="text-xs font-bold text-regular">Slippage (0-50%)</div>
  //     <input
  //       className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
  //       value={slippage}
  //       onChange={(e) =>
  //         handleSlippageInputChange({
  //           decimalPlaces: 2,
  //           e,
  //           setValue: setSlippage,
  //           max: MAX_SLIPPAGE,
  //           min: MIN_SLIPPAGE,
  //         })
  //       }
  //       type="text"
  //     />
  //   </div>
  //   <Button
  //     disabled={swapButtonIsDiabled}
  //     onClick={onSwap}
  //     className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50 disabled:opacity-50"
  //   >
  //     <div className="text-xs font-bold text-white">{isLoadingOutputAmount || isSwapping ? "Loading..." : "Swap"}</div>
  //   </Button>
  // </>;
};

// interface SwapProps {
//   slippage: number;
//   onCloseClick?: () => void;
//   memeImage: string;
// }

// const Swap = (props: SwapProps) => {
//   const { slippage, onCloseClick } = props;
//   const [variant, setVariant] = useState<"swap" | "claim">("swap");
//   const isVariantSwap = variant === "swap";
//   const [inputValue, setInputValue] = useState("");

//   const refresh = () => {};
//   const onReverseClick = () => {};
//   const onSlippageClick = () => {
//     console.log(slippage);
//   };

//   return (
//     <Card>
//       <Card.Header>
//         <div className="flex justify-between w-full">
//           <div className="flex gap-1">
//             <Typography
//               variant="h4"
//               onClick={() => setVariant("swap")}
//               className={isVariantSwap ? "order-1" : "order-2"}
//             >
//               Swap
//             </Typography>
//             <Typography
//               variant="text-button"
//               underline
//               onClick={() => setVariant("claim")}
//               className={isVariantSwap ? "order-2" : "order-1"}
//             >
//               Claim
//             </Typography>
//           </div>
//           <div className="flex items-center gap-2">
//             <Typography underline onClick={onSlippageClick}>
//               Slippage {slippage}%
//             </Typography>
//             <Typography onClick={refresh}>🔄</Typography>
//             <Divider vertical className="bg-mono-600" />
//             <Typography onClick={onCloseClick}>
//               <FontAwesomeIcon icon={faClose} fontSize={16} />
//             </Typography>
//           </div>
//         </div>
//       </Card.Header>
//       <Card.Body>
//         <div className="flex flex-col">
//           <SwapInput
//             currencyName="SOL"
//             inputValue={inputValue}
//             setInputValue={setInputValue}
//             placeholder="0.00"
//             currencyLogoUrl="/tokens/solana.png"
//             usdPrice={13.99}
//             label="Pay"
//             labelRight="👛 0 SOL"
//           />
//           <div className="relative h-12">
//             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-mono-400"></div>
//             <div
//               onClick={onReverseClick}
//               className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-mono-200 hover:bg-mono-300 cursor-pointer border-2 border-mono-400 rounded-sm flex justify-center items-center"
//             >
//               <FontAwesomeIcon icon={faUpDown} className="text-white" fontWeight={100} />
//             </div>
//           </div>
//           <SwapInput
//             currencyName="SLORK"
//             inputValue={inputValue}
//             placeholder="0.00"
//             currencyLogoUrl={props.memeImage}
//             usdPrice={13.99}
//             label="Receive"
//             isReadOnly
//             labelRight="👛 0 SLORK"
//           />
//         </div>
//         <Button variant="primary" className="mt-4 p-1">
//           <Typography variant="h4">Swap</Typography>
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };

// return (
//   <>
//     <div className="flex w-full flex-row gap-2">
//       <SwapButton coinToMeme={coinToMeme} onClick={() => setCoinToMeme(true)} label="Buy" />
//       <SwapButton coinToMeme={!coinToMeme} onClick={() => setCoinToMeme(false)} label="Sell" />
//     </div>
//     <div className="flex w-full flex-col gap-1">
//       <InputAmountTitle
//         memeBalance={memeBalance}
//         setInputAmount={setInputAmount}
//         setOutputData={setOutputData}
//         coinBalance={coinBalance}
//         coinToMeme={coinToMeme}
//         tokenSymbol={tokenSymbol}
//         quoteMint={quoteMint}
//       />
//       <input
//         className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
//         value={inputAmount}
//         onChange={(e) =>
//           handleSwapInputChange({
//             decimalPlaces: coinToMeme ? tokenData.decimals : MEMECHAN_MEME_TOKEN_DECIMALS,
//             e,
//             setValue: setInputAmount,
//           })
//         }
//         placeholder="0"
//         type="text"
//       />
//       {coinToMeme && (
//         <div className="text-xs font-bold text-regular">
//           available {tokenData.displayName}:{" "}
//           {publicKey && coinBalance
//             ? Number(coinBalance).toLocaleString(undefined, {
//                 maximumFractionDigits: tokenData.decimals,
//               }) ?? "loading..."
//             : "0"}
//         </div>
//       )}
//       {!coinToMeme && memeBalance && (
//         <div className="text-xs !normal-case font-bold text-regular">
//           available {tokenSymbol} to sell: {formatNumber(Number(memeBalance), MEMECHAN_MEME_TOKEN_DECIMALS)}
//         </div>
//       )}
//       {isLoadingOutputAmount && (
//         <div className="text-xs font-bold text-regular">
//           {coinToMeme ? (
//             <span>{tokenSymbol} to receive: loading...</span>
//           ) : (
//             <span>{tokenData.displayName} to receive: loading...</span>
//           )}
//         </div>
//       )}
//       {outputData !== null && !isLoadingOutputAmount && (
//         <div className="text-xs font-bold text-regular">
//           {coinToMeme
//             ? `${tokenSymbol} to receive: ${tokenData.symbol === "SOL" ? parseChainValue(Number(outputData.minAmountOut.toString()), MEMECHAN_MEME_TOKEN_DECIMALS, 6) : parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 2)}`
//             : `${tokenData.displayName} to receive: ${tokenData.symbol === "SOL" ? parseChainValue(Number(outputData.minAmountOut.toString()), QUOTE_TOKEN_DECIMALS, 12) : parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 12)}`}
//         </div>
//       )}
//     </div>
//     <div className="flex w-full flex-col gap-1">
//       <div className="text-xs font-bold text-regular">Slippage (0-50%)</div>
//       <input
//         className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
//         value={slippage}
//         onChange={(e) =>
//           handleSlippageInputChange({
//             decimalPlaces: 2,
//             e,
//             setValue: setSlippage,
//             max: MAX_SLIPPAGE,
//             min: MIN_SLIPPAGE,
//           })
//         }
//         type="text"
//       />
//     </div>
//     <Button
//       disabled={swapButtonIsDiabled}
//       onClick={onSwap}
//       className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50 disabled:opacity-50"
//     >
//       <div className="text-xs font-bold text-white">
//         {isLoadingOutputAmount || isSwapping ? "Loading..." : "Swap"}
//       </div>
//     </Button>
//   </>
// );
// };
