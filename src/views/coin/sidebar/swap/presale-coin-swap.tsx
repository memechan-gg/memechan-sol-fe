import { ChartApiInstance } from "@/common/solana";
import { Button } from "@/components/button";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useBalance } from "@/hooks/useBalance";
import { GetSwapOutputAmountParams, GetSwapTransactionParams } from "@/types/hooks";
import { formatNumber } from "@/utils/formatNumber";
import {
  GetBuyMemeTransactionOutput,
  GetSellMemeTransactionOutput,
  MEMECHAN_MEME_TOKEN_DECIMALS,
  MEMECHAN_QUOTE_MINT,
  MEMECHAN_QUOTE_TOKEN_DECIMALS,
  MemeTicketClient,
  sleep,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PresaleCoinSwapProps } from "../../coin.types";
import { presaleSwapParamsAreValid } from "../../coin.utils";
import { SwapButton } from "./button";
import { UnavailableTicketsToSellDialog } from "./dialog-unavailable-tickets-to-sell";
import { InputAmountTitle } from "./input-amount-title";
import { handleSlippageInputChange, handleSwapInputChange, validateSlippage } from "./utils";

export const PresaleCoinSwap = ({
  tokenSymbol,
  pool,
  boundPool,
  ticketsData: {
    tickets,
    availableTicketsAmount,
    unavailableTicketsAmount,
    unavailableTickets,
    refresh: refreshAvailableTickets,
  },
}: PresaleCoinSwapProps) => {
  const [slerfToMeme, setSlerfToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { balance: slerfBalance, refetch: refetchSlerfBalance } = useBalance(
    MEMECHAN_QUOTE_MINT.toString(),
    MEMECHAN_QUOTE_TOKEN_DECIMALS,
  );
  const boundPoolClient = useBoundPoolClient(pool.address);

  const getSwapOutputAmount = useCallback(
    async ({ inputAmount, slerfToMeme, slippagePercentage }: GetSwapOutputAmountParams) => {
      if (!boundPoolClient) return;

      return slerfToMeme
        ? await boundPoolClient.getOutputAmountForBuyMeme({ inputAmount, slippagePercentage })
        : await boundPoolClient.getOutputAmountForSellMeme({ inputAmount, slippagePercentage });
    },
    [boundPoolClient],
  );

  const getSwapTransaction = useCallback(
    async ({ inputAmount, minOutputAmount, slerfToMeme, slippagePercentage }: GetSwapTransactionParams) => {
      if (!boundPoolClient || !publicKey) return;

      return (
        slerfToMeme
          ? {
              side: "buy",
              result: await boundPoolClient.getBuyMemeTransaction({
                user: publicKey,
                inputAmount,
                minOutputAmount,
                slippagePercentage,
                memeTicketNumber: tickets.length + MemeTicketClient.TICKET_NUMBER_START,
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
    [boundPoolClient, publicKey, tickets],
  );

  useEffect(() => {
    setInputAmount("");
    setOutputAmount(null);
  }, [slerfToMeme]);

  useEffect(() => {
    if (inputAmount === "0" || inputAmount === "") {
      setOutputAmount(null);
      return;
    }

    const updateOutputAmount = async () => {
      try {
        setIsLoadingOutputAmount(true);

        if (!validateSlippage(slippage)) return;

        const outputAmount = await getSwapOutputAmount({ inputAmount, slerfToMeme, slippagePercentage: +slippage });

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
    };

    const timeoutId = setTimeout(() => updateOutputAmount(), 1000);
    return () => clearTimeout(timeoutId);
  }, [getSwapOutputAmount, inputAmount, slerfToMeme, slippage]);

  const onSwap = useCallback(async () => {
    if (!publicKey || !outputAmount || !slerfBalance) return;

    if (
      !presaleSwapParamsAreValid({
        availableTicketsAmount,
        inputAmount,
        slerfBalance,
        slerfToMeme,
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
        slerfToMeme: slerfToMeme,
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
        setIsSwapping(false);

        // Check the swap succeeded
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
          console.error("[Swap.onSwap] Buy failed:", JSON.stringify(swapTxResult, null, 2));
          toast("Swap failed. Please, try again");
          return;
        }

        await sleep(2000);

        refetchSlerfBalance();
        refreshAvailableTickets();
        await ChartApiInstance.updatePrice({ address: pool.address, type: "seedPool" }).catch((e) => {
          console.debug(`[OHLCV] Failed updating price for OHLCV`);
          console.error(`Failed updating price for OHLCV, error:`, e);
        });
        toast.success("Swap succeeded");
        return;
      }

      if (side === "sell") {
        const { txs } = result;

        const signatures: string[] = [];

        for (const tx of txs) {
          const signature = await sendTransaction(tx, connection, {
            maxRetries: 3,
            skipPreflight: true,
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
            console.error("[Swap.onSwap] Sell failed:", JSON.stringify(swapTxResult, null, 2));
            toast("Swap failed. Please, try again");
            return;
          }
        }

        await sleep(2000);

        refetchSlerfBalance();
        refreshAvailableTickets();
        await ChartApiInstance.updatePrice({ address: pool.address, type: "seedPool" }).catch((e) => {
          console.debug(`[OHLCV] Failed updating price for OHLCV`);
          console.error(`Failed updating price for OHLCV, error:`, e);
        });
        toast.success("Swap succeeded");
        return;
      }
    } catch (e) {
      console.error("[Swap.onSwap] Swap error:", e);
      toast.error("Failed to swap. Please, try again");
    } finally {
      setIsSwapping(false);
    }
  }, [
    availableTicketsAmount,
    slerfBalance,
    getSwapTransaction,
    inputAmount,
    outputAmount,
    publicKey,
    sendTransaction,
    slerfToMeme,
    slippage,
    refetchSlerfBalance,
    refreshAvailableTickets,
    pool.address,
    connection,
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
        <SwapButton slerfToMeme={slerfToMeme} onClick={() => setSlerfToMeme(true)} label="Buy" />
        <SwapButton slerfToMeme={!slerfToMeme} onClick={() => setSlerfToMeme(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <InputAmountTitle
          memeBalance={availableTicketsAmount}
          setInputAmount={setInputAmount}
          setOutputData={setOutputAmount}
          slerfBalance={slerfBalance}
          slerfToMeme={slerfToMeme}
          tokenSymbol={tokenSymbol}
        />
        <input
          disabled={poolIsMigratingToLive}
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
        {!slerfToMeme && availableTicketsAmount !== "0" && (
          <div className="text-xs font-bold text-regular">
            Available tickets to sell: {formatNumber(+availableTicketsAmount, MEMECHAN_MEME_TOKEN_DECIMALS)}
          </div>
        )}
        {!slerfToMeme && unavailableTicketsAmount !== "0" && (
          <div className="text-xs !normal-case font-bold text-regular">
            unavailable {tokenSymbol} to sell (locked):{" "}
            {formatNumber(Number(unavailableTicketsAmount), MEMECHAN_MEME_TOKEN_DECIMALS)}
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
        {outputAmount !== null && !isLoadingOutputAmount && (
          <div className="text-xs font-bold text-regular">
            {slerfToMeme
              ? `${tokenSymbol} to receive: ${formatNumber(Number(outputAmount), MEMECHAN_MEME_TOKEN_DECIMALS)}`
              : `SLERF to receive: ${formatNumber(Number(outputAmount), MEMECHAN_QUOTE_TOKEN_DECIMALS)}`}
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
