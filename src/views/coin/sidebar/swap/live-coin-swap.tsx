import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useConnection } from "@/context/ConnectionContext";
import { useBalance } from "@/hooks/useBalance";
import { useTokenAccounts } from "@/hooks/useTokenAccounts";
import { getTokenInfo } from "@/hooks/utils";
// import SwapInput from "@/memechan-ui/Atoms/Input/SwapInput";
import { Swap } from "@/components/Swap";
import { QUOTE_TOKEN_DECIMALS } from "@/constants/constants";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { useSlerfPrice } from "@/hooks/useSlerfPrice";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { useSolanaPrice } from "@/hooks/useSolanaPrice";
import { GetLiveSwapTransactionParams, GetSwapOutputAmountParams } from "@/types/hooks";
import { parseChainValue } from "@/utils/parseChainValue";
import { MEMECHAN_MEME_TOKEN_DECIMALS, SwapMemeOutput, buildTxs } from "@avernikoz/memechan-sol-sdk";
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
  stakingPoolFromApi,
  seedPoolAddress,
  onClose,
  livePoolClient,
}: LiveCoinSwapProps) => {
  const { connected } = useWallet();
  const [coinToMeme, setCoinToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputData, setOutputData] = useState<SwapMemeOutput | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const { data: solanaBalance } = useSolanaBalance();
  // const [refetchBalanceIncrement, setRefetchBalanceIncrement] = useState(0);
  const quoteTokenInfo = getTokenInfo({ variant: "string", tokenAddress: quoteMint });
  const {
    balance: coinBalance,
    isLoading: isBalanceLoading,
    refetch: coinBalanceRefetch,
    isRefetching: coinBalanceRefetching,
  } = useBalance(quoteTokenInfo.mint.toString(), quoteTokenInfo.decimals);

  const { data: memePrice } = useMemePriceFromBE({ memeMint: tokenAddress, poolType: "livePool" });
  const { data: solanaPrice } = useSolanaPrice();
  const { data: slerfPrice } = useSlerfPrice();
  const {
    balance: memeBalance,
    isLoading: isMemeBalanceLoading,
    refetch: memeBalanceRefech,
    isRefetching: memeBalanceRefetching,
  } = useBalance(tokenAddress, MEMECHAN_MEME_TOKEN_DECIMALS);

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
    coinBalance: +(memeBalance ?? 0),
  });

  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();

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

  const refresh = useCallback(async () => {
    await coinBalanceRefetch();
    await memeBalanceRefech();
  }, [coinBalanceRefetch, memeBalanceRefech]);

  const onSwap = useCallback(async () => {
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
      refresh();
      setInputAmount("0");
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
    refresh,
    refetchTokenAccounts,
    sendTransaction,
    connection,
  ]);

  const swapButtonIsDiabled = isLoadingOutputAmount || isSwapping || (outputData === null && connected);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSwapInputChange({
      decimalPlaces: coinToMeme ? quoteTokenInfo.decimals : MEMECHAN_MEME_TOKEN_DECIMALS,
      e,
      setValue: setInputAmount,
    });
  };

  const onReverseClick = () => {
    setCoinToMeme((prev) => !prev);
    const copyBaseCurrency = { ...baseCurrency };
    const copySecondCurrency = { ...secondCurrency };
    setBaseCurrency(copySecondCurrency);
    setSecondCurrency(copyBaseCurrency);
    setInputAmount("0");
  };
  const onSlippageClick = () => {
    console.log(slippage);
  };
  const onCloseClick = () => {};

  let toReceive = "0";

  if (quoteTokenInfo.symbol === "SOL" && outputData) {
    if (coinToMeme) {
      toReceive = parseChainValue(Number(outputData.minAmountOut.toString()), MEMECHAN_MEME_TOKEN_DECIMALS, 6);
    } else {
      toReceive = parseChainValue(Number(outputData.minAmountOut.toString()), QUOTE_TOKEN_DECIMALS, 12);
    }
  } else if (quoteTokenInfo.symbol !== "SOL" && outputData) {
    if (coinToMeme) {
      toReceive = parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 2);
    } else {
      toReceive = parseChainValue(Number(+outputData.minAmountOut.toExact()), 0, 12);
    }
  }

  const [mountedSolana, setMountedSolana] = useState(false);
  const [mountedMeme, setMountedMeme] = useState(false);

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
        coinBalance: +(memeBalance ?? 0),
      }));
    }
  }, [baseCurrency.currencyName, memeBalance, mountedSolana, secondCurrency.currencyName, slerfBalance, solanaBalance]);

  useEffect(() => {
    if (baseCurrency.currencyName !== "SOL" && baseCurrency.currencyName !== "SLERF") {
      // setMountedSolana(true);
      setBaseCurrency((prevState) => ({
        ...prevState,
        coinBalance: +(memeBalance ?? 0),
      }));
    }
    if (secondCurrency.currencyName === "SOL") {
      setSecondCurrency((prevState) => ({ ...prevState, coinBalance: solanaBalance ?? 0 }));
    }
    if (secondCurrency.currencyName === "SLERF") {
      setSecondCurrency((prevState) => ({ ...prevState, coinBalance: +(slerfBalance ?? "0") }));
    }
  }, [baseCurrency.currencyName, memeBalance, mountedSolana, secondCurrency.currencyName, slerfBalance, solanaBalance]);
  // const submitButtonDisabled = swapButtonIsDiabled || isLoadingOutputAmount
  return (
    <Swap
      variant="LIVE"
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
      isRefreshing={memeBalanceRefetching || coinBalanceRefetching}
      onReverseClick={onReverseClick}
      toReceive={toReceive}
      swapButtonIsDisabled={swapButtonIsDiabled}
      stakingPoolFromApi={stakingPoolFromApi}
      livePoolId={address}
      seedPoolAddress={seedPoolAddress}
      tokenSymbol={tokenSymbol}
      onClose={onClose}
      tokenDecimals={coinToMeme ? quoteTokenInfo.decimals : MEMECHAN_MEME_TOKEN_DECIMALS}
      memePrice={memePrice}
      quotePrice={quoteTokenInfo?.symbol === "SOL" ? solanaPrice : slerfPrice}
      quoteTokenInfo={quoteTokenInfo}
    />
  );
};
