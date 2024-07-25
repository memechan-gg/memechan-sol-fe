import { ChartApiInstance } from "@/common/solana";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { WithConnectedWallet } from "@/components/WithConnectedWallet";
import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useBalance } from "@/hooks/useBalance";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { getTokenInfo } from "@/hooks/utils";
import { Button } from "@/memechan-ui/Atoms";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { GetSwapOutputAmountParams, GetSwapTransactionParams } from "@/types/hooks";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { parseChainValue } from "@/utils/parseChainValue";
import {
  GetBuyMemeTransactionOutput,
  GetSellMemeTransactionOutput,
  MEMECHAN_MEME_TOKEN_DECIMALS,
} from "@avernikoz/memechan-sol-sdk";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { faUpDown } from "@fortawesome/free-solid-svg-icons/faUpDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@reach/dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { track } from "@vercel/analytics";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PresaleCoinSwapProps } from "../../coin.types";
import { presaleSwapParamsAreValid } from "../../coin.utils";
import { getFreeMemeTicketIndex, handleSlippageInputChange, handleSwapInputChange, validateSlippage } from "./utils";

export const PresaleCoinSwap = ({
  tokenSymbol,
  pool,
  memeImage,
  boundPool,
  ticketsData: {
    freeIndexes,
    availableTicketsAmount,
    unavailableTicketsAmount,
    unavailableTickets,
    refresh: refreshAvailableTickets,
  },
}: PresaleCoinSwapProps) => {
  const [coinToMeme, setCoinToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: boundPoolClient } = useBoundPoolClient(pool.address);

  const tokenInfo = boundPoolClient?.boundPoolInstance.quoteTokenMint
    ? getTokenInfo({ tokenAddress: boundPoolClient.boundPoolInstance.quoteTokenMint, variant: "publicKey" })
    : null;
  const memeChanQuoteMint = tokenInfo?.mint || "";
  const memeChanQuoteTokenDecimals = tokenInfo?.decimals || 6;

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
      if (coinToMeme) {
        let result = undefined;
        try {
          result = await boundPoolClient.boundPoolInstance.getBuyMemeTransaction({
            user: publicKey,
            inputAmount,
            minOutputAmount,
            slippagePercentage,
            memeTicketNumber: getFreeMemeTicketIndex(freeIndexes, boundPoolClient.version as "V1" | "V2"),
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
    [publicKey, boundPoolClient, freeIndexes],
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
      setIsSwapping(false);
    }
  }, [
    availableTicketsAmount,
    coinBalance,
    getSwapTransaction,
    inputAmount,
    outputAmount,
    publicKey,
    sendTransaction,
    coinToMeme,
    slippage,
    refetchCoinBalance,
    refreshAvailableTickets,
    pool.address,
    connection,
    updateOutputAmount,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || outputAmount === null;
  const poolIsMigratingToLive = boundPool?.locked || boundPool === null;
  const refresh = useCallback(async () => {
    await refetchCoinBalance();
    await refreshAvailableTickets();
    // await memeBalanceRefech();
  }, [refetchCoinBalance, refreshAvailableTickets]);
  const { data: solanaBalance } = useSolanaBalance();

  const [baseCurrency, setBaseCurrency] = useState({
    currencyName: "SOL",
    currencyLogoUrl: "/tokens/solana.png",
    coinBalance: solanaBalance ?? 0,
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
    if (secondCurrency.currencyName !== "SOL") {
      setSecondCurrency((prevState) => ({
        ...prevState,
        coinBalance: +(availableTicketsAmount ?? 0),
      }));
    }
  }, [baseCurrency.currencyName, availableTicketsAmount, secondCurrency.currencyName, solanaBalance]);

  useEffect(() => {
    if (baseCurrency.currencyName !== "SOL") {
      // setMountedSolana(true);
      setBaseCurrency((prevState) => ({
        ...prevState,
        coinBalance: +(availableTicketsAmount ?? 0),
      }));
    }
    if (secondCurrency.currencyName === "SOL") {
      setSecondCurrency((prevState) => ({ ...prevState, coinBalance: solanaBalance ?? 0 }));
    }
  }, [availableTicketsAmount, baseCurrency.currencyName, secondCurrency.currencyName, solanaBalance]);
  return (
    <Swap
      slippage={slippage}
      setSlippage={setSlippage}
      refresh={refresh}
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
    />
  );
};

interface SwapProps {
  slippage: string;
  refresh: () => void;
  baseCurrency: {
    currencyName: string;
    currencyLogoUrl: string;
    coinBalance: number;
  };
  secondCurrency: {
    currencyName: string;
    currencyLogoUrl: string;
    coinBalance: number;
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputAmount: string;
  publicKey: PublicKey | null;

  isSwapping?: boolean;
  isLoadingOutputAmount?: boolean;
  onSwap: () => Promise<void>;
  onReverseClick: () => void;
  toReceive: string;
  swapButtonIsDisabled?: boolean;
  setSlippage: (e: string) => void;
}

export const Swap = (props: SwapProps) => {
  const {
    slippage,
    refresh,
    baseCurrency,
    secondCurrency,
    onInputChange,
    inputAmount,
    publicKey,
    isLoadingOutputAmount,
    isSwapping,
    onReverseClick,
    onSwap,
    toReceive,
    swapButtonIsDisabled,
    setSlippage,
  } = props;
  const [variant, setVariant] = useState<"swap" | "claim">("swap");
  const [localSlippage, setLocalSlippage] = useState(slippage);
  const isVariantSwap = variant === "swap";

  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  return (
    <>
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
              {/* <Typography
                variant="text-button"
                underline
                onClick={() => setVariant("claim")}
                className={isVariantSwap ? "order-2" : "order-1"}
              >
                Claim
              </Typography> */}
            </div>
            <div className="flex items-center gap-2">
              <Typography underline onClick={() => setIsOpen(true)}>
                Slippage {slippage}%
              </Typography>
              <Typography onClick={refresh}>🔄</Typography>
              {/* <Divider vertical className="bg-mono-600" />
              <Typography onClick={onCloseClick}>
                <FontAwesomeIcon icon={faClose} fontSize={16} />
              </Typography> */}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col">
            <SwapInput
              currencyName={baseCurrency.currencyName}
              inputValue={inputAmount}
              setInputValue={onInputChange}
              placeholder="0.00"
              currencyLogoUrl={baseCurrency.currencyLogoUrl}
              label="Pay"
              labelRight={publicKey ? `👛 ${baseCurrency.coinBalance ?? 0} ${baseCurrency.currencyName}` : undefined}
            />
            <div className="relative h-12">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-mono-400"></div>
              <div
                onClick={onReverseClick}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-mono-200 hover:bg-mono-300 cursor-pointer border-2 border-mono-400 rounded-sm flex justify-center items-center ${swapButtonIsDisabled && "cursor-not-allowed hover:bg-mono-200"}`}
              >
                <FontAwesomeIcon icon={faUpDown} className="text-white" fontWeight={100} />
              </div>
            </div>
            <SwapInput
              currencyName={secondCurrency.currencyName}
              type="text"
              inputValue={toReceive}
              currencyLogoUrl={secondCurrency.currencyLogoUrl}
              label="Receive"
              isReadOnly
              labelRight={
                publicKey ? `👛 ${secondCurrency.coinBalance ?? 0} ${secondCurrency.currencyName}` : undefined
              }
            />
          </div>

          <WithConnectedWallet
            variant="primary"
            className="mt-4 p-1"
            disabled={swapButtonIsDisabled || isLoadingOutputAmount}
            onClick={onSwap}
            isLoading={isSwapping || isLoadingOutputAmount}
          >
            <Typography variant="h4">
              {isLoadingOutputAmount ? "Calculating..." : isSwapping ? "Swapping..." : "Swap"}
            </Typography>
          </WithConnectedWallet>
        </Card.Body>
      </Card>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-mono-200 md:bg-[#19191957] md:backdrop-blur-[0.5px] md:z-50"
      >
        <Card>
          <Card.Header>
            <div className="flex justify-between items-center w-full">
              <Typography>Slippage Preferences</Typography>
              <FontAwesomeIcon icon={faClose} onClick={() => setIsOpen(false)} />
            </div>
          </Card.Header>
          <Card.Body>
            <TextInput
              value={localSlippage}
              setValue={setLocalSlippage}
              onChange={(e) => setSlippage(e.target.value)}
            />
            <Button
              variant="primary"
              className="mt-5 p-4"
              onClick={() => {
                const e = { target: { value: slippage } } as any;
                handleSlippageInputChange({
                  decimalPlaces: 2,
                  e,
                  setValue: setSlippage,
                  max: MAX_SLIPPAGE,
                  min: MIN_SLIPPAGE,
                });
                setSlippage(localSlippage);
                setIsOpen(false);
              }}
            >
              <Typography variant="h4" color="mono-600">
                Save
              </Typography>
            </Button>
          </Card.Body>
        </Card>
      </Dialog>
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
//       {tokenInfo?.mint && (
//         <InputAmountTitle
//           memeBalance={availableTicketsAmount}
//           setInputAmount={setInputAmount}
//           setOutputData={setOutputAmount}
//           coinBalance={coinBalance}
//           coinToMeme={coinToMeme}
//           tokenSymbol={tokenSymbol}
//           quoteMint={tokenInfo.mint.toString()}
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
//           available {tokenInfo?.displayName + " "}
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
//             <span>{tokenInfo?.displayName} to receive: loading...</span>
//           )}
//         </div>
//       )}
//       {outputAmount !== null && !isLoadingOutputAmount && (
//         <div className="text-xs font-bold text-regular">
//           {coinToMeme
//             ? `${tokenSymbol} tickets to receive: ${parseChainValue(Number(outputAmount), 0, 6)}`
//             : `${tokenInfo?.displayName} to receive: ${parseChainValue(Number(outputAmount), 0, 12)}`}
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
//       className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50 disabled:opacity-50"
//     >
//       <div className="text-xs font-bold text-white">
//         {isLoadingOutputAmount || isSwapping ? "Loading..." : "Swap"}
//       </div>
//     </Button>
//   </>
