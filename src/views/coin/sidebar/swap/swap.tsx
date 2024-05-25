import { MemechanClientInstance } from "@/common/solana";
import { Button } from "@/components/button";
import { useAvailableTickets } from "@/hooks/solana/useAvailableTickets";
import { useBalance } from "@/hooks/solana/useBalance";
import { MEMECHAN_QUOTE_MINT } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SwapComponentParams } from "../../coin.types";
import { validateSwapInput } from "../../coin.utils";
import { SwapButton } from "./button";

export const Swap = ({
  tokenSymbol,
  pool,
  swapMethods: { getSwapOutputAmount, getSwapTransaction },
  status,
}: SwapComponentParams) => {
  const [slerfToMeme, setSlerfToMeme] = useState<boolean>(true);
  const [inputAmount, setInputAmount] = useState<string>("0");
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [isLoadingOutputAmount, setIsLoadingOutputAmount] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<string>("10");

  const { publicKey, sendTransaction } = useWallet();
  const { availableTickets } = useAvailableTickets(pool.address);
  const { balance: slerfBalance, refetch: refetchSlerfBalance } = useBalance(MEMECHAN_QUOTE_MINT.toString());
  const { balance: memeBalance, refetch: refetchMemeBalance } = useBalance(pool.tokenAddress);

  useEffect(() => {
    setInputAmount("0");
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

        const outputAmount = await getSwapOutputAmount({ inputAmount, slerfToMeme, slippagePercentage: +slippage });

        if (!outputAmount) {
          setOutputAmount(null);
          return;
        }

        setOutputAmount(outputAmount);
      } catch (e) {
        console.error("[Swap.updateOutputAmount] Failed to get the swap output amount:", e);
        toast.error("Cannot calculate output amount for the swap");
      } finally {
        setIsLoadingOutputAmount(false);
      }
    };

    const timeoutId = setTimeout(() => updateOutputAmount(), 1000);
    return () => clearTimeout(timeoutId);
  }, [getSwapOutputAmount, inputAmount, slerfToMeme, slippage]);

  const onSwap = useCallback(async () => {
    if (!publicKey || !outputAmount) return;

    if (!validateSwapInput(inputAmount, slerfBalance, memeBalance, availableTickets, slippage, slerfToMeme)) return;

    try {
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

      const { memeTicketKeypair, tx } = transactionResult;

      const signature = await sendTransaction(tx, MemechanClientInstance.connection, {
        signers: [memeTicketKeypair],
        maxRetries: 3,
      });

      // Check the swap succeeded
      const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
        await MemechanClientInstance.connection.getLatestBlockhash("confirmed");
      const swapTxResult = await MemechanClientInstance.connection.confirmTransaction(
        {
          signature: signature,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        },
        "confirmed",
      );
      console.log("swapTxResult:", swapTxResult);

      if (swapTxResult.value.err) {
        console.error("[Swap.onSwap] Swap failed:", JSON.stringify(swapTxResult, null, 2));
        toast("Swap failed. Please, try again");
        return;
      }

      toast.success("Swap succeeded");
      refetchSlerfBalance();
      refetchMemeBalance();
    } catch (e) {
      console.error("[Swap.onSwap] Swap error:", e);
      toast.error("Failed to swap. Please, try again");
    }
  }, [
    availableTickets,
    slerfBalance,
    getSwapTransaction,
    inputAmount,
    memeBalance,
    outputAmount,
    publicKey,
    sendTransaction,
    slerfToMeme,
    slippage,
    refetchSlerfBalance,
    refetchMemeBalance,
  ]);

  return (
    <>
      <div className="flex w-full flex-row gap-2">
        <SwapButton slerfToMeme={slerfToMeme} onClick={() => setSlerfToMeme(true)} label="Buy" />
        <SwapButton slerfToMeme={!slerfToMeme} onClick={() => setSlerfToMeme(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="text-xs font-bold text-regular">
          {slerfToMeme ? `SLERF to ${tokenSymbol}` : `${tokenSymbol} to SLERF`}
        </div>
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="0.0"
          type="number"
        />
        {slerfToMeme && <div className="text-xs font-bold text-regular">Available SLERF: {slerfBalance}</div>}
        {!slerfToMeme && status === "PRESALE" && availableTickets !== "0" && (
          <div className="text-xs font-bold text-regular">Available tickets to sell: {availableTickets}</div>
        )}
        {!slerfToMeme && status === "LIVE" && (
          <div className="text-xs font-bold text-regular">
            Available {tokenSymbol} to sell: {memeBalance}
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
            {slerfToMeme ? `${tokenSymbol} to receive: ${outputAmount}` : `SLERF to receive: ${outputAmount}`}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="text-xs font-bold text-regular">Slippage</div>
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          type="number"
        />
      </div>
      {/* TODO: Make it work */}
      {/* {stakedLps[pool.tokenAddress]?.length > 0 && (
        <UnavailableTicketsToSellDialog availableTickets={stakedLps[pool.tokenAddress]} symbol={tokenSymbol} />
      )} */}
      <Button onClick={onSwap} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
        <div className="text-xs font-bold text-white">Swap</div>
      </Button>
    </>
  );
};
