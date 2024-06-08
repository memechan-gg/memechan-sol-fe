import { Button } from "@/components/button";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useBalance } from "@/hooks/useBalance";
import { useTokenAccounts } from "@/hooks/useTokenAccounts";
import { GetLiveSwapTransactionParams, GetSwapOutputAmountParams } from "@/types/hooks";
import { formatNumber } from "@/utils/formatNumber";
import {
  LivePoolClient,
  MEMECHAN_MEME_TOKEN_DECIMALS,
  MEMECHAN_QUOTE_MINT,
  MEMECHAN_QUOTE_TOKEN_DECIMALS,
  SwapMemeOutput,
  buildTxs,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LiveCoinSwapProps } from "../../coin.types";
import { liveSwapParamsAreValid } from "../../coin.utils";
import { SwapButton } from "./button";
import { InputAmountTitle } from "./input-amount-title";
import { OutputAmountRefresher } from "./output-amount-refresher/output-amount-refresher";
import { handleSlippageInputChange, handleSwapInputChange, validateSlippage } from "./utils";

export const LiveCoinSwap = ({ tokenSymbol, pool: { id: address, baseMint: tokenAddress } }: LiveCoinSwapProps) => {
  const [slerfToMeme, setSlerfToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputData, setOutputData] = useState<SwapMemeOutput | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { balance: slerfBalance } = useBalance(MEMECHAN_QUOTE_MINT.toString(), MEMECHAN_QUOTE_TOKEN_DECIMALS);
  const { balance: memeBalance } = useBalance(tokenAddress, MEMECHAN_MEME_TOKEN_DECIMALS);
  const { tokenAccounts, refetch: refetchTokenAccounts } = useTokenAccounts();

  const getSwapOutputAmount = useCallback(
    async ({ inputAmount, slerfToMeme, slippagePercentage }: GetSwapOutputAmountParams) => {
      return slerfToMeme
        ? await LivePoolClient.getBuyMemeOutput({
            poolAddress: address,
            amountIn: inputAmount,
            slippagePercentage,
            connection,
            memeCoinMint: tokenAddress,
          })
        : await LivePoolClient.getSellMemeOutput({
            poolAddress: address,
            amountIn: inputAmount,
            slippagePercentage,
            connection,
            memeCoinMint: tokenAddress,
          });
    },
    [address, tokenAddress, connection],
  );

  const getSwapTransactions = useCallback(
    async ({ outputData, slerfToMeme }: GetLiveSwapTransactionParams) => {
      if (!publicKey || !tokenAccounts) return;

      return slerfToMeme
        ? await LivePoolClient.getBuyMemeTransactionsByOutput({
            ...outputData,
            connection,
            payer: publicKey,
            walletTokenAccounts: tokenAccounts,
          })
        : await LivePoolClient.getSellMemeTransactionsByOutput({
            ...outputData,
            connection,
            payer: publicKey,
            walletTokenAccounts: tokenAccounts,
          });
    },
    [publicKey, tokenAccounts, connection],
  );

  const updateOutputAmount = useCallback(async () => {
    if (inputAmount === "0" || inputAmount === "") {
      setOutputData(null);
      return;
    }

    try {
      setIsLoadingOutputAmount(true);

      if (!validateSlippage(slippage)) return;

      const outputData = await getSwapOutputAmount({ inputAmount, slerfToMeme, slippagePercentage: +slippage });

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
  }, [getSwapOutputAmount, inputAmount, slerfToMeme, slippage]);

  useEffect(() => {
    setInputAmount("");
    setOutputData(null);
  }, [slerfToMeme]);

  useEffect(() => {
    const timeoutId = setTimeout(updateOutputAmount, 1_000);
    return () => clearTimeout(timeoutId);
  }, [updateOutputAmount]);

  const onSwap = useCallback(async () => {
    if (!publicKey || !outputData || !signTransaction || !slerfBalance) return;

    if (!liveSwapParamsAreValid({ inputAmount, memeBalance, slerfBalance, slerfToMeme, slippagePercentage: +slippage }))
      return;

    try {
      setIsSwapping(true);
      const simpleSwapTransactions = await getSwapTransactions({ slerfToMeme, outputData });

      if (!simpleSwapTransactions) {
        toast.error("Failed to create the swap transaction. Please, try again");
        return;
      }

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

      setIsSwapping(false);

      // Check each part of the swap succeeded
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

      toast.success("Swap succeeded");
      refetchTokenAccounts();
      return;
    } catch (e) {
      console.error("[LiveCoinSwap.onSwap] Swap error:", e);
      toast.error("Failed to swap. Please, try again");
      return;
    } finally {
      updateOutputAmount();
      setIsSwapping(false);
    }
  }, [
    slerfBalance,
    getSwapTransactions,
    inputAmount,
    outputData,
    publicKey,
    sendTransaction,
    slerfToMeme,
    slippage,
    memeBalance,
    refetchTokenAccounts,
    signTransaction,
    connection,
    updateOutputAmount,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || outputData === null;

  return (
    <>
      <div className="flex w-full flex-row gap-2">
        <SwapButton slerfToMeme={slerfToMeme} onClick={() => setSlerfToMeme(true)} label="Buy" />
        <SwapButton slerfToMeme={!slerfToMeme} onClick={() => setSlerfToMeme(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <InputAmountTitle
          memeBalance={memeBalance}
          setInputAmount={setInputAmount}
          setOutputData={setOutputData}
          slerfBalance={slerfBalance}
          slerfToMeme={slerfToMeme}
          tokenSymbol={tokenSymbol}
        />
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={inputAmount}
          onChange={(e) =>
            handleSwapInputChange({
              decimalPlaces: slerfToMeme ? MEMECHAN_QUOTE_TOKEN_DECIMALS : MEMECHAN_MEME_TOKEN_DECIMALS,
              e,
              setValue: setInputAmount,
            })
          }
          placeholder="0"
          type="text"
        />
        {slerfToMeme && (
          <div className="text-xs font-bold text-regular">
            available SLERF:{" "}
            {publicKey && slerfBalance
              ? Number(slerfBalance).toLocaleString(undefined, {
                  maximumFractionDigits: MEMECHAN_QUOTE_TOKEN_DECIMALS,
                }) ?? "loading..."
              : "0"}
          </div>
        )}
        {!slerfToMeme && memeBalance && (
          <div className="text-xs !normal-case font-bold text-regular">
            available {tokenSymbol} to sell: {formatNumber(Number(memeBalance), MEMECHAN_MEME_TOKEN_DECIMALS)}
          </div>
        )}
        {isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {slerfToMeme ? (
              <span>{tokenSymbol} to receive: loading...</span>
            ) : (
              <span>SLERF to receive: loading...</span>
            )}
          </div>
        )}
        {outputData !== null && !isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular flex gap-2 items-center">
            {slerfToMeme
              ? `${tokenSymbol} to receive: ${Number(outputData.minAmountOut.toExact()).toLocaleString(undefined, { maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS })}`
              : `SLERF to receive: ${Number(outputData.minAmountOut.toExact()).toLocaleString(undefined, { maximumFractionDigits: MEMECHAN_QUOTE_TOKEN_DECIMALS })}`}
            <OutputAmountRefresher refreshOutputAmount={updateOutputAmount} />
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
