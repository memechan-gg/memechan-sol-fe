import { Button } from "@/components/button";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useLivePoolClient } from "@/hooks/live/useLivePoolClient";
import { useBalance } from "@/hooks/useBalance";
import { useTokenAccounts } from "@/hooks/useTokenAccounts";
import { getTokenInfo } from "@/hooks/utils";
import { GetLiveSwapTransactionParams, GetSwapOutputAmountParams } from "@/types/hooks";
import { formatNumber } from "@/utils/formatNumber";
import { MEMECHAN_MEME_TOKEN_DECIMALS, SwapMemeOutput, buildTxs } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LiveCoinSwapProps } from "../../coin.types";
import { liveSwapParamsAreValid } from "../../coin.utils";
import { SwapButton } from "./button";
import { InputAmountTitle } from "./input-amount-title";
import { handleSlippageInputChange, handleSwapInputChange, validateSlippage } from "./utils";

export const LiveCoinSwap = ({
  tokenSymbol,
  pool: { id: address, baseMint: tokenAddress, quoteMint },
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
  const livePoolClient = useLivePoolClient(address);

  const { balance: coinBalance } = useBalance(tokenData.mint.toString(), tokenData.decimals);
  const { balance: memeBalance } = useBalance(tokenAddress, MEMECHAN_MEME_TOKEN_DECIMALS);
  const { tokenAccounts, refetch: refetchTokenAccounts } = useTokenAccounts();

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

  // TODO:TYPESCRIPT
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
    if (!publicKey || !outputData || !signTransaction || !coinBalance) return;

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
    inputAmount,
    memeBalance,
    coinToMeme,
    slippage,
    getSwapTransactions,
    livePoolClient?.version,
    refetchTokenAccounts,
    sendTransaction,
    connection,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || outputData === null;

  return (
    <>
      <div className="flex w-full flex-row gap-2">
        <SwapButton coinToMeme={coinToMeme} onClick={() => setCoinToMeme(true)} label="Buy" />
        <SwapButton coinToMeme={!coinToMeme} onClick={() => setCoinToMeme(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <InputAmountTitle
          memeBalance={memeBalance}
          setInputAmount={setInputAmount}
          setOutputData={setOutputData}
          coinBalance={coinBalance}
          coinToMeme={coinToMeme}
          tokenSymbol={tokenSymbol}
          quoteMint={quoteMint}
        />
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={inputAmount}
          onChange={(e) =>
            handleSwapInputChange({
              decimalPlaces: coinToMeme ? tokenData.decimals : MEMECHAN_MEME_TOKEN_DECIMALS,
              e,
              setValue: setInputAmount,
            })
          }
          placeholder="0"
          type="text"
        />
        {coinToMeme && (
          <div className="text-xs font-bold text-regular">
            available {tokenData.displayName}:{" "}
            {publicKey && coinBalance
              ? Number(coinBalance).toLocaleString(undefined, {
                  maximumFractionDigits: tokenData.decimals,
                }) ?? "loading..."
              : "0"}
          </div>
        )}
        {!coinToMeme && memeBalance && (
          <div className="text-xs !normal-case font-bold text-regular">
            available {tokenSymbol} to sell: {formatNumber(Number(memeBalance), MEMECHAN_MEME_TOKEN_DECIMALS)}
          </div>
        )}
        {isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {coinToMeme ? (
              <span>{tokenSymbol} to receive: loading...</span>
            ) : (
              <span>{tokenData.displayName} to receive: loading...</span>
            )}
          </div>
        )}
        {outputData !== null && !isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {coinToMeme
              ? `${tokenSymbol} to receive: ${Number(tokenSymbol === "SOL" ? (+outputData.minAmountOut.toString() / 1_000_000_000).toString() : outputData.minAmountOut.toString()).toLocaleString(undefined, { maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS })}`
              : `${tokenData.displayName} to receive: ${Number(tokenData.displayName === "SOL" ? (+outputData.minAmountOut.toString() / 1_000_000_000).toString() : outputData.minAmountOut.toString()).toLocaleString(undefined, { maximumFractionDigits: tokenData.decimals })}`}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="text-xs font-bold text-regular">Slippage (0-50%)</div>
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={slippage}
          onChange={(e) =>
            handleSlippageInputChange({
              decimalPlaces: 2,
              e,
              setValue: setSlippage,
              max: MAX_SLIPPAGE,
              min: MIN_SLIPPAGE,
            })
          }
          type="text"
        />
      </div>
      <Button
        disabled={swapButtonIsDiabled}
        onClick={onSwap}
        className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50 disabled:opacity-50"
      >
        <div className="text-xs font-bold text-white">
          {isLoadingOutputAmount || isSwapping ? "Loading..." : "Swap"}
        </div>
      </Button>
    </>
  );
};
