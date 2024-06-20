import { ChartApiInstance } from "@/common/solana";
import { Button } from "@/components/button";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useBalance } from "@/hooks/useBalance";
import { useMainTokenName } from "@/hooks/useMainTokenName";
import { GetSwapOutputAmountParams, GetSwapTransactionParams } from "@/types/hooks";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { formatNumber } from "@/utils/formatNumber";
import {
  GetBuyMemeTransactionOutput,
  GetSellMemeTransactionOutput,
  MEMECHAN_MEME_TOKEN_DECIMALS,
  MEMECHAN_QUOTE_MINT,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PresaleCoinSwapProps } from "../../coin.types";
import { presaleSwapParamsAreValid } from "../../coin.utils";
import { SwapButton } from "./button";
import { UnavailableTicketsToSellDialog } from "./dialog-unavailable-tickets-to-sell";
import { InputAmountTitle } from "./input-amount-title";
import { getFreeMemeTicketIndex, handleSlippageInputChange, handleSwapInputChange, validateSlippage } from "./utils";

export const PresaleCoinSwap = ({
  tokenSymbol,
  pool,
  boundPool,
  ticketsData: {
    freeIndexes,
    availableTicketsAmount,
    unavailableTicketsAmount,
    unavailableTickets,
    refresh: refreshAvailableTickets,
  },
}: PresaleCoinSwapProps) => {
  const [mainTokenToMeme, setMainTokenToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection, memechanClient } = useConnection();
  const { balance: mainTokenBalance, refetch: refetchMainTokenBalance } = useBalance(
    MEMECHAN_QUOTE_MINT.toString(),
    MEMECHAN_MEME_TOKEN_DECIMALS,
  );
  const mainTokenName = useMainTokenName();
  const boundPoolClient = useBoundPoolClient(pool.address);

  const getSwapOutputAmount = useCallback(
    async ({ inputAmount, mainTokenToMeme, slippagePercentage }: GetSwapOutputAmountParams) => {
      if (!boundPoolClient) return;

      return mainTokenToMeme
        ? await boundPoolClient.getOutputAmountForBuyMeme({ inputAmount, slippagePercentage })
        : await boundPoolClient.getOutputAmountForSellMeme({ inputAmount, slippagePercentage });
    },
    [boundPoolClient],
  );

  const getSwapTransaction = useCallback(
    async ({ inputAmount, minOutputAmount, mainTokenToMeme, slippagePercentage }: GetSwapTransactionParams) => {
      if (!publicKey) {
        toast.error("Please, connect your wallet to make swaps");
        return;
      }
      if (!boundPoolClient || !freeIndexes) return;

      return (
        mainTokenToMeme
          ? {
              side: "buy",
              result: await boundPoolClient.getBuyMemeTransaction({
                user: publicKey,
                inputAmount,
                minOutputAmount,
                slippagePercentage,
                memeTicketNumber: getFreeMemeTicketIndex(freeIndexes),
              }),
            }
          : {
              side: "sell",
              result: await boundPoolClient.getSellMemeTransaction({
                user: publicKey,
                inputAmount,
                minOutputAmount,
                slippagePercentage,
              }),
            }
      ) as
        | { side: "buy"; result: GetBuyMemeTransactionOutput }
        | { side: "sell"; result: GetSellMemeTransactionOutput };
    },
    [boundPoolClient, publicKey, freeIndexes],
  );

  const updateOutputAmount = useCallback(async () => {
    if (inputAmount === "0" || inputAmount === "") {
      setOutputAmount(null);
      return;
    }

    try {
      setIsLoadingOutputAmount(true);

      if (!validateSlippage(slippage)) return;

      const outputAmount = await getSwapOutputAmount({ inputAmount, mainTokenToMeme, slippagePercentage: +slippage });

      if (!outputAmount) {
        setOutputAmount(null);
        return;
      }

      setOutputAmount(outputAmount);
    } catch (e) {
      console.error("[Swap.updateOutputAmount] Failed to get the swap output amount:", e);
      toast.error("Cannot calculate output amount for the swap");
      setOutputAmount(null);
    } finally {
      setIsLoadingOutputAmount(false);
    }
  }, [getSwapOutputAmount, inputAmount, mainTokenToMeme, slippage]);

  useEffect(() => {
    setInputAmount("");
    setOutputAmount(null);
  }, [mainTokenToMeme]);

  useEffect(() => {
    const timeoutId = setTimeout(() => updateOutputAmount(), 1000);
    return () => clearTimeout(timeoutId);
  }, [updateOutputAmount]);

  const onSwap = useCallback(async () => {
    if (!publicKey || !outputAmount || !mainTokenBalance) return;

    if (
      !presaleSwapParamsAreValid({
        availableTicketsAmount,
        inputAmount,
        mainTokenBalance,
        mainTokenToMeme,
        slippagePercentage: +slippage,
      })
    )
      return;

    try {
      setIsSwapping(true);
      const transactionResult = await getSwapTransaction({
        inputAmount: inputAmount,
        minOutputAmount: outputAmount,
        slippagePercentage: +slippage,
        mainTokenToMeme: mainTokenToMeme,
      });

      if (!transactionResult) {
        toast.error("Failed to create the swap transaction. Please, try again");
        return;
      }

      const { side, result } = transactionResult;

      if (side === "buy") {
        const { tx } = result;

        const signature = await sendTransaction(tx, connection, {
          maxRetries: 3,
          skipPreflight: true,
        });

        toast(() => <TransactionSentNotification signature={signature} />);

        // Check the swap succeeded
        const swapSucceeded = await confirmTransaction({ connection, signature });
        if (!swapSucceeded) return;

        await ChartApiInstance.updatePrice({ address: pool.address, type: "seedPool" }).catch((e) => {
          console.debug(`[OHLCV] Failed updating price for OHLCV`);
          console.error(`Failed updating price for OHLCV, error:`, e);
        });
        toast.success("Swap succeeded");
        return;
      }

      if (side === "sell") {
        const { txs } = result;

        for (const tx of txs) {
          const signature = await sendTransaction(tx, connection, {
            maxRetries: 3,
            skipPreflight: true,
          });

          toast(() => <TransactionSentNotification signature={signature} />);

          const swapSucceeded = await confirmTransaction({ connection, signature });
          if (!swapSucceeded) return;
        }

        await ChartApiInstance.updatePrice({ address: pool.address, type: "seedPool" }).catch((e) => {
          console.debug(`[OHLCV] Failed updating price for OHLCV`);
          console.error(`Failed updating price for OHLCV, error:`, e);
        });

        toast.success("Swap succeeded");
        return;
      }
    } catch (e) {
      console.error("[Swap.onSwap] Swap error:", e);
      toast.error("Swap failed. Please, try again");
    } finally {
      refreshAvailableTickets();
      refetchMainTokenBalance();
      updateOutputAmount();
      setIsSwapping(false);
    }
  }, [
    availableTicketsAmount,
    mainTokenBalance,
    getSwapTransaction,
    inputAmount,
    outputAmount,
    publicKey,
    sendTransaction,
    mainTokenToMeme,
    slippage,
    refetchMainTokenBalance,
    refreshAvailableTickets,
    pool.address,
    connection,
    updateOutputAmount,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || outputAmount === null;
  const poolIsMigratingToLive = boundPool?.locked || boundPool === null;

  return (
    <>
      {poolIsMigratingToLive && (
        <div className="absolute rounded-xl top-0 left-0 w-full h-full bg-regular bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-center text-balance font-bold text-lg tracking-wide">
            Pool is currently migrating to the Live Phase. Please wait.
          </div>
        </div>
      )}
      <div className="flex w-full flex-row gap-2">
        <SwapButton mainTokenToMeme={mainTokenToMeme} onClick={() => setMainTokenToMeme(true)} label="Buy" />
        <SwapButton mainTokenToMeme={!mainTokenToMeme} onClick={() => setMainTokenToMeme(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <InputAmountTitle
          memeBalance={availableTicketsAmount}
          setInputAmount={setInputAmount}
          setOutputData={setOutputAmount}
          mainTokenBalance={mainTokenBalance}
          mainTokenToMeme={mainTokenToMeme}
          tokenSymbol={tokenSymbol}
        />
        <input
          disabled={poolIsMigratingToLive}
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
        {!mainTokenToMeme && availableTicketsAmount !== "0" && (
          <div className="text-xs font-bold text-regular">
            Available {tokenSymbol} tickets to sell:{" "}
            {formatNumber(+availableTicketsAmount, MEMECHAN_MEME_TOKEN_DECIMALS)}
          </div>
        )}
        {!mainTokenToMeme && unavailableTicketsAmount !== "0" && (
          <div className="text-xs !normal-case font-bold text-regular">
            Unavailable {tokenSymbol} tickets to sell (locked):{" "}
            {formatNumber(Number(unavailableTicketsAmount), MEMECHAN_MEME_TOKEN_DECIMALS)}
          </div>
        )}
        {isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {mainTokenToMeme ? (
              <span>{tokenSymbol} tickets to receive: loading...</span>
            ) : (
              <span>{mainTokenName} to receive: loading...</span>
            )}
          </div>
        )}
        {outputAmount !== null && !isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {mainTokenToMeme
              ? `${tokenSymbol} tickets to receive: ${formatNumber(Number(outputAmount), MEMECHAN_MEME_TOKEN_DECIMALS)}`
              : `${mainTokenName} to receive: ${formatNumber(Number(outputAmount), MEMECHAN_MEME_TOKEN_DECIMALS)}`}
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
      {unavailableTickets.length > 0 && (
        <UnavailableTicketsToSellDialog unavailableTickets={unavailableTickets} symbol={tokenSymbol} />
      )}
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
