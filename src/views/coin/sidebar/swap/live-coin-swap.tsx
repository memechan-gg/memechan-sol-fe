import { Button } from "@/components/button";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useBalance } from "@/hooks/useBalance";
import { useMainTokenName } from "@/hooks/useMainTokenName";
import { useTokenAccounts } from "@/hooks/useTokenAccounts";
import { GetLiveSwapTransactionParams, GetSwapOutputAmountParams } from "@/types/hooks";
import { formatNumber } from "@/utils/formatNumber";
import {
  LivePoolClient,
  MEMECHAN_MEME_TOKEN_DECIMALS,
  MEMECHAN_QUOTE_MINT,
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
import { handleSlippageInputChange, handleSwapInputChange, validateSlippage } from "./utils";

export const LiveCoinSwap = ({ tokenSymbol, pool: { id: address, baseMint: tokenAddress } }: LiveCoinSwapProps) => {
  const [mainTokenToMeme, setMainTokenToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputData, setOutputData] = useState<SwapMemeOutput | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { balance: mainTokenBalance } = useBalance(MEMECHAN_QUOTE_MINT.toString(), MEMECHAN_MEME_TOKEN_DECIMALS);
  const { balance: memeBalance } = useBalance(tokenAddress, MEMECHAN_MEME_TOKEN_DECIMALS);
  const { tokenAccounts, refetch: refetchTokenAccounts } = useTokenAccounts();
  const mainTokenName = useMainTokenName();

  const getSwapOutputAmount = useCallback(
    async ({ inputAmount, mainTokenToMeme, slippagePercentage }: GetSwapOutputAmountParams) => {
      return mainTokenToMeme
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
    async ({ outputData, mainTokenToMeme }: GetLiveSwapTransactionParams) => {
      if (!publicKey || !tokenAccounts) return;

      return mainTokenToMeme
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

  useEffect(() => {
    setInputAmount("");
    setOutputData(null);
  }, [mainTokenToMeme]);

  useEffect(() => {
    if (inputAmount === "0" || inputAmount === "") {
      setOutputData(null);
      return;
    }

    const updateOutputAmount = async () => {
      try {
        setIsLoadingOutputAmount(true);

        if (!validateSlippage(slippage)) return;

        const outputData = await getSwapOutputAmount({ inputAmount, mainTokenToMeme, slippagePercentage: +slippage });

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
  }, [getSwapOutputAmount, inputAmount, mainTokenToMeme, slippage]);

  const onSwap = useCallback(async () => {
    if (!publicKey || !outputData || !signTransaction || !mainTokenBalance) return;

    if (
      !liveSwapParamsAreValid({
        inputAmount,
        memeBalance,
        mainTokenBalance,
        mainTokenToMeme,
        slippagePercentage: +slippage,
      })
    )
      return;

    try {
      setIsSwapping(true);
      const simpleSwapTransactions = await getSwapTransactions({ mainTokenToMeme, outputData });

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
      setIsSwapping(false);
    }
  }, [
    mainTokenBalance,
    getSwapTransactions,
    inputAmount,
    outputData,
    publicKey,
    sendTransaction,
    mainTokenToMeme,
    slippage,
    memeBalance,
    refetchTokenAccounts,
    signTransaction,
    connection,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || outputData === null;

  return (
    <>
      <div className="flex w-full flex-row gap-2">
        <SwapButton mainTokenToMeme={mainTokenToMeme} onClick={() => setMainTokenToMeme(true)} label="Buy" />
        <SwapButton mainTokenToMeme={!mainTokenToMeme} onClick={() => setMainTokenToMeme(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <InputAmountTitle
          memeBalance={memeBalance}
          setInputAmount={setInputAmount}
          setOutputData={setOutputData}
          mainTokenBalance={mainTokenBalance}
          mainTokenToMeme={mainTokenToMeme}
          tokenSymbol={tokenSymbol}
        />
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={inputAmount}
          onChange={(e) =>
            handleSwapInputChange({
              decimalPlaces: mainTokenToMeme ? MEMECHAN_MEME_TOKEN_DECIMALS : MEMECHAN_MEME_TOKEN_DECIMALS,
              e,
              setValue: setInputAmount,
            })
          }
          placeholder="0"
          type="text"
        />
        {mainTokenToMeme && (
          <div className="text-xs font-bold text-regular">
            available {mainTokenName}:{" "}
            {publicKey && mainTokenBalance
              ? Number(mainTokenBalance).toLocaleString(undefined, {
                  maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS,
                }) ?? "loading..."
              : "0"}
          </div>
        )}
        {!mainTokenToMeme && memeBalance && (
          <div className="text-xs !normal-case font-bold text-regular">
            available {tokenSymbol} to sell: {formatNumber(Number(memeBalance), MEMECHAN_MEME_TOKEN_DECIMALS)}
          </div>
        )}
        {isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {mainTokenToMeme ? (
              <span>{tokenSymbol} to receive: loading...</span>
            ) : (
              <span>{mainTokenName} to receive: loading...</span>
            )}
          </div>
        )}
        {outputData !== null && !isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {mainTokenToMeme
              ? `${tokenSymbol} to receive: ${Number(outputData.minAmountOut.toExact()).toLocaleString(undefined, { maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS })}`
              : `${mainTokenName} to receive: ${Number(outputData.minAmountOut.toExact()).toLocaleString(undefined, { maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS })}`}
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
