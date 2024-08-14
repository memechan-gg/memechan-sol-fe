import { ChartApiInstance } from "@/common/solana";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { Swap } from "@/components/Swap";
import { useConnection } from "@/context/ConnectionContext";
import { useReferrerContext } from "@/context/ReferrerContext";
import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useBalance } from "@/hooks/useBalance";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { useSlerfPrice } from "@/hooks/useSlerfPrice";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { useSolanaPrice } from "@/hooks/useSolanaPrice";
import { getTokenInfo } from "@/hooks/utils";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { GetSwapOutputAmountParams, GetSwapTransactionParams } from "@/types/hooks";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { parseChainValue } from "@/utils/parseChainValue";
import {
  GetBuyMemeTransactionOutput,
  GetSellMemeTransactionOutput,
  MEMECHAN_MEME_TOKEN_DECIMALS,
  resolveReferrer,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { track } from "@vercel/analytics";
import { useTheme } from "next-themes";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PresaleCoinSwapProps } from "../../coin.types";
import { presaleSwapParamsAreValid } from "../../coin.utils";
import { UnavailableTicketsToSellDialog } from "./dialog-unavailable-tickets-to-sell";
import { getFreeMemeTicketIndex, handleSwapInputChange, validateSlippage } from "./utils";

export const PresaleCoinSwap = ({
  tokenSymbol,
  pool,
  memeImage,
  boundPool,
  onClose,
  ticketsData,
  ticketsData: {
    freeIndexes,
    availableTicketsAmount,
    unavailableTicketsAmount,
    unavailableTickets,
    refresh: refreshAvailableTickets,
  },
}: PresaleCoinSwapProps) => {
  const { connected } = useWallet();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { referrer } = useReferrerContext();
  const [coinToMeme, setCoinToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: boundPoolClient } = useBoundPoolClient(pool.address);

  const quoteTokenInfo = boundPoolClient?.boundPoolInstance.quoteTokenMint
    ? getTokenInfo({ tokenAddress: boundPoolClient.boundPoolInstance.quoteTokenMint, variant: "publicKey" })
    : null;

  const { data: memePrice } = useMemePriceFromBE({
    memeMint: boundPool?.memeReserve.mint.toBase58() || "",
    poolType: "seedPool",
  });

  const { data: solanaPrice } = useSolanaPrice();
  const { data: slerfPrice } = useSlerfPrice();

  const memeChanQuoteMint = quoteTokenInfo?.mint || "";
  const memeChanQuoteTokenDecimals = quoteTokenInfo?.decimals || 6;

  const { balance: coinBalance, refetch: refetchCoinBalance } = useBalance(
    memeChanQuoteMint.toString(),
    memeChanQuoteTokenDecimals,
  );

  const getSwapOutputAmount = useCallback(
    async ({ inputAmount, coinToMeme, slippagePercentage }: GetSwapOutputAmountParams) => {
      if (!boundPoolClient?.boundPoolInstance) return;

      return coinToMeme
        ? await boundPoolClient.boundPoolInstance.getOutputAmountForBuyMeme({ inputAmount, slippagePercentage })
        : await boundPoolClient.boundPoolInstance.getOutputAmountForSellMeme({ inputAmount, slippagePercentage });
    },
    [boundPoolClient],
  );

  const getSwapTransaction = useCallback(
    async ({ inputAmount, minOutputAmount, coinToMeme, slippagePercentage }: GetSwapTransactionParams) => {
      if (!publicKey) {
        toast.error("Please, connect your wallet to make swaps");
        return;
      }
      console.log("Starting swap");

      if (!boundPoolClient?.boundPoolInstance || !freeIndexes) return;
      console.log("Continuing swap");

      console.log("Resolving referer if present");
      let undecodedReferrer = undefined;
      if (referrer) {
        undecodedReferrer = await resolveReferrer(connection, referrer);
      }

      if (coinToMeme) {
        let result = undefined;

        try {
          result = await boundPoolClient.boundPoolInstance.getBuyMemeTransaction({
            user: publicKey,
            inputAmount,
            minOutputAmount,
            slippagePercentage,
            memeTicketNumber: getFreeMemeTicketIndex(freeIndexes, boundPoolClient.version as "V1" | "V2"),
            referrer: undecodedReferrer,
          });
        } catch (e) {
          console.log(e);
        }
        return {
          side: "buy",
          result: result,
        } as { side: "buy"; result: GetBuyMemeTransactionOutput };
      }

      return {
        side: "sell",
        result: await boundPoolClient.boundPoolInstance.getSellMemeTransaction({
          user: publicKey,
          inputAmount,
          minOutputAmount,
          slippagePercentage,
        }),
      } as { side: "sell"; result: GetSellMemeTransactionOutput };
    },
    [publicKey, boundPoolClient, freeIndexes, referrer, connection],
  );

  const updateOutputAmount = useCallback(async () => {
    if (inputAmount === "0" || inputAmount === "") {
      setOutputAmount(null);
      return;
    }

    try {
      setIsLoadingOutputAmount(true);

      if (!validateSlippage(slippage)) return;

      const outputAmount = await getSwapOutputAmount({ inputAmount, coinToMeme, slippagePercentage: +slippage });

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
  }, [getSwapOutputAmount, inputAmount, coinToMeme, slippage]);

  useEffect(() => {
    setInputAmount("");
    setOutputAmount(null);
  }, [coinToMeme]);

  useEffect(() => {
    const timeoutId = setTimeout(() => updateOutputAmount(), 1000);
    return () => clearTimeout(timeoutId);
  }, [updateOutputAmount]);

  const refresh = useCallback(async () => {
    await refetchCoinBalance();
    await refreshAvailableTickets();
    await queryClient.invalidateQueries({ queryKey: ["bound-pool-client", pool.address] });
    // await memeBalanceRefech();
  }, [pool.address, queryClient, refetchCoinBalance, refreshAvailableTickets]);

  const onSwap = useCallback(async () => {
    if (!publicKey || !outputAmount || !coinBalance) return;

    const swapTrackObj = { inputAmount, outputAmount, slippage, coinBalance, coinToMeme, type: "presale" };

    track("Swap", swapTrackObj);

    if (
      !presaleSwapParamsAreValid({
        availableTicketsAmount,
        inputAmount,
        coinBalance: coinBalance,
        coinToMeme,
        slippagePercentage: +slippage,
      })
    )
      return;

    console.log("swapping");
    try {
      setIsSwapping(true);
      const transactionResult = await getSwapTransaction({
        inputAmount: inputAmount,
        minOutputAmount: outputAmount,
        slippagePercentage: +slippage,
        coinToMeme,
      });
      console.log("transactionResult", transactionResult);

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

        console.log("success");
        track("Swap_Success", swapTrackObj);

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

        track("Swap_Success", swapTrackObj);

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
      refetchCoinBalance();
      updateOutputAmount();
      refresh();
      setIsSwapping(false);
    }
  }, [
    publicKey,
    outputAmount,
    coinBalance,
    inputAmount,
    slippage,
    coinToMeme,
    availableTicketsAmount,
    getSwapTransaction,
    sendTransaction,
    connection,
    pool.address,
    refreshAvailableTickets,
    refetchCoinBalance,
    updateOutputAmount,
    refresh,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || (outputAmount === null && connected);
  const poolIsMigratingToLive = boundPool?.locked || boundPool === null;

  const { data: solanaBalance } = useSolanaBalance();
  const { balance: slerfBalance } = useBalance(quoteTokenInfo?.mint.toBase58() || "", quoteTokenInfo?.decimals || 0);
  const [baseCurrency, setBaseCurrency] = useState({
    currencyName: quoteTokenInfo?.symbol || "SOL",
    currencyLogoUrl:
      (quoteTokenInfo?.symbol === "SOL" ? "/tokens/solana.png" : "/tokens/slerf.png") || "/tokens/solana.png",
    coinBalance: (quoteTokenInfo?.symbol === "SOL" ? solanaBalance : +(slerfBalance || "0")) || 0,
  });

  const [secondCurrency, setSecondCurrency] = useState({
    currencyName: tokenSymbol,
    currencyLogoUrl: memeImage,
    coinBalance: +(availableTicketsAmount ?? 0),
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSwapInputChange({
      decimalPlaces: coinToMeme ? memeChanQuoteTokenDecimals : MEMECHAN_MEME_TOKEN_DECIMALS,
      e,
      setValue: setInputAmount,
    });
  };

  const toReceive = (
    outputAmount !== null && !isLoadingOutputAmount
      ? coinToMeme
        ? `${parseChainValue(Number(outputAmount), 0, 6)}`
        : `${parseChainValue(Number(outputAmount), 0, 12)}`
      : 0
  ).toString();

  const onReverseClick = () => {
    setCoinToMeme((prev) => !prev);
    const copyBaseCurrency = { ...baseCurrency };
    const copySecondCurrency = { ...secondCurrency };
    setBaseCurrency(copySecondCurrency);
    setSecondCurrency(copyBaseCurrency);
    setInputAmount("0");
  };

  useEffect(() => {
    if (baseCurrency.currencyName === "SOL") {
      setBaseCurrency((prevState) => ({ ...prevState, coinBalance: solanaBalance ?? 0 }));
      // setMountedSolana(true);
    }
    if (baseCurrency.currencyName === "SLERF") {
      setBaseCurrency((prevState) => ({ ...prevState, coinBalance: +(slerfBalance || "0") }));
    }
    if (secondCurrency.currencyName !== "SOL" && secondCurrency.currencyName !== "SLERF") {
      setSecondCurrency((prevState) => ({
        ...prevState,
        coinBalance: +(availableTicketsAmount ?? 0),
      }));
    }
  }, [baseCurrency.currencyName, availableTicketsAmount, secondCurrency.currencyName, solanaBalance, slerfBalance]);

  useEffect(() => {
    if (baseCurrency.currencyName !== "SOL" && baseCurrency.currencyName !== "SLERF") {
      // setMountedSolana(true);
      setBaseCurrency((prevState) => ({
        ...prevState,
        coinBalance: +(availableTicketsAmount ?? 0),
      }));
    }
    if (secondCurrency.currencyName === "SOL") {
      setSecondCurrency((prevState) => ({ ...prevState, coinBalance: solanaBalance ?? 0 }));
    }
    if (secondCurrency.currencyName === "SLERF") {
      setSecondCurrency((prevState) => ({ ...prevState, coinBalance: +(slerfBalance ?? "0") }));
    }
  }, [availableTicketsAmount, baseCurrency.currencyName, secondCurrency.currencyName, slerfBalance, solanaBalance]);

  return (
    <>
      {unavailableTicketsAmount !== "0" && (
        <div className="text-xs !normal-case font-bold text-regular">
          <Typography variant="h4" color={theme === "light" ? "primary-100" : "mono-600"}>
            Unavailable {tokenSymbol} tickets to sell (locked): {parseChainValue(+unavailableTicketsAmount, 0, 6)}
          </Typography>
        </div>
      )}

      {unavailableTickets.length > 0 && (
        <UnavailableTicketsToSellDialog unavailableTickets={unavailableTickets} symbol={tokenSymbol} />
      )}
      <Swap
        variant="PRESALE"
        slippage={slippage}
        setSlippage={setSlippage}
        refresh={refresh}
        isRefreshing={ticketsData.isRefetching}
        baseCurrency={baseCurrency}
        secondCurrency={secondCurrency}
        onInputChange={onInputChange}
        inputAmount={inputAmount}
        publicKey={publicKey}
        isSwapping={isSwapping}
        isLoadingOutputAmount={isLoadingOutputAmount}
        onSwap={onSwap}
        onReverseClick={onReverseClick}
        toReceive={toReceive}
        swapButtonIsDisabled={swapButtonIsDiabled}
        tokenSymbol={tokenSymbol}
        // stakingPoolFromApi={stakingPoolFromApi}
        // livePoolId={address}
        seedPoolAddress={pool.address}
        onClose={onClose}
        tokenDecimals={coinToMeme ? memeChanQuoteTokenDecimals : MEMECHAN_MEME_TOKEN_DECIMALS}
        memePrice={memePrice}
        quotePrice={quoteTokenInfo?.symbol === "SOL" ? solanaPrice : slerfPrice}
        quoteTokenInfo={quoteTokenInfo}
      />
    </>
  );
};

// return (
//   <>
//     {poolIsMigratingToLive && (
//       <div className="absolute rounded-xl top-0 left-0 w-full h-full bg-regular bg-opacity-70 flex items-center justify-center">
//         <div className="text-white text-center text-balance font-bold text-lg tracking-wide">
//           Pool is currently migrating to the Live Phase. Please wait.
//         </div>
//       </div>
//     )}
//     <div className="flex w-full flex-row gap-2">
//       <SwapButton coinToMeme={coinToMeme} onClick={() => setCoinToMeme(true)} label="Buy" />
//       <SwapButton coinToMeme={!coinToMeme} onClick={() => setCoinToMeme(false)} label="Sell" />
//     </div>
//     <div className="flex w-full flex-col gap-1">
//       {quoteTokenInfo?.mint && (
//         <InputAmountTitle
//           memeBalance={availableTicketsAmount}
//           setInputAmount={setInputAmount}
//           setOutputData={setOutputAmount}
//           coinBalance={coinBalance}
//           coinToMeme={coinToMeme}
//           tokenSymbol={tokenSymbol}
//           quoteMint={quoteTokenInfo.mint.toString()}
//         />
//       )}
//       <input
//         disabled={poolIsMigratingToLive}
//         className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
//         value={inputAmount}
//         onChange={(e) =>
//           handleSwapInputChange({
//             decimalPlaces: coinToMeme ? memeChanQuoteTokenDecimals : MEMECHAN_MEME_TOKEN_DECIMALS,
//             e,
//             setValue: setInputAmount,
//           })
//         }
//         placeholder="0"
//         type="text"
//       />
//       {coinToMeme && (
//         <div className="text-xs font-bold text-regular">
//           available {quoteTokenInfo?.displayName + " "}
//           {publicKey && coinBalance
//             ? Number(coinBalance).toLocaleString(undefined, {
//                 maximumFractionDigits: memeChanQuoteTokenDecimals,
//               }) ?? "loading..."
//             : "0"}
//         </div>
//       )}
//       {!coinToMeme && availableTicketsAmount !== "0" && (
//         <div className="text-xs font-bold text-regular">
//           Available {tokenSymbol} tickets to sell: {parseChainValue(+availableTicketsAmount, 0, 6)}
//         </div>
//       )}
//       {!coinToMeme && unavailableTicketsAmount !== "0" && (
//         <div className="text-xs !normal-case font-bold text-regular">
//           Unavailable {tokenSymbol} tickets to sell (locked): {parseChainValue(+unavailableTicketsAmount, 0, 6)}
//         </div>
//       )}
//       {isLoadingOutputAmount && (
//         <div className="text-xs font-bold text-regular">
//           {coinToMeme ? (
//             <span>{tokenSymbol} tickets to receive: loading...</span>
//           ) : (
//             <span>{quoteTokenInfo?.displayName} to receive: loading...</span>
//           )}
//         </div>
//       )}
//       {outputAmount !== null && !isLoadingOutputAmount && (
//         <div className="text-xs font-bold text-regular">
//           {coinToMeme
//             ? `${tokenSymbol} tickets to receive: ${parseChainValue(Number(outputAmount), 0, 6)}`
//             : `${quoteTokenInfo?.displayName} to receive: ${parseChainValue(Number(outputAmount), 0, 12)}`}
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
//     {unavailableTickets.length > 0 && (
//       <UnavailableTicketsToSellDialog unavailableTickets={unavailableTickets} symbol={tokenSymbol} />
//     )}
//     <Button
//       disabled={swapButtonIsDiabled}
//       onClick={onSwap}
//       className="w-full bg-regular bg-opacity-80 sm:hover:bg-opacity-50 disabled:opacity-50"
//     >
//       <div className="text-xs font-bold text-white">
//         {isLoadingOutputAmount || isSwapping ? "Loading..." : "Swap"}
//       </div>
//     </Button>
//   </>
