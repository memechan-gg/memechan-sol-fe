import { Button } from "@/components/button";
import { useUser } from "@/context/UserContext";
import { getSlippage } from "@/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SwapComponentParams } from "../../coin.types";
import { validateSwapInput } from "../../coin.utils";
import { SwapButton } from "./button";
import { AvailableTicketsToSellDialog } from "./dialog-available-tickets-to-sell";
import { useWallet } from "@solana/wallet-adapter-react";

export const Swap = ({ tokenSymbol, pool, memeBalance, swap, quoteSwap, availableTickets }: SwapComponentParams) => {
  const account = useWallet();
  const [isXToY, setIsXToY] = useState(true);
  const [sendTokenAmount, setSendTokenAmount] = useState("0.0");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState("0.0");
  const [slippage, setSlippage] = useState<string>("0.5");
  const { balance, stakedLps } = useUser();

  useEffect(() => {
    setSendTokenAmount("0.0");
    setReceiveTokenAmount("0.0");
  }, [isXToY]);

  useEffect(() => {
    if (sendTokenAmount === "0.0") return;

    quoteSwap({
      inputAmount: sendTokenAmount,
      SuiToMeme: isXToY,
      slippagePercentage: getSlippage(slippage),
    })
      .then((res) => {
        setReceiveTokenAmount(res);
      })
      .catch((error) => {
        console.error("Quote swap error:", error);
        toast.error("An error occurred while fetching quote, please try again");
      });
  }, [sendTokenAmount, slippage, isXToY, quoteSwap]);

  async function onSwap() {
    if (!account) return;

    if (!validateSwapInput(sendTokenAmount, balance, memeBalance, availableTickets, slippage, isXToY)) return;

    try {
      let tx = await swap({
        inputAmount: sendTokenAmount,
        minOutputAmount: receiveTokenAmount,
        slippagePercentage: getSlippage(slippage),
        SuiToMeme: isXToY,
      });

      if (!tx) {
        toast.error("An error occurred while swapping, please try again");
        return;
      }

      /*await doTX({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
          showBalanceChanges: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showInput: true,
        },
      });*/
    } catch (e) {
      console.error("Swap error:", e);
      toast.error("An error occurred while swapping, please try again");
    }
  }

  return (
    <>
      <div className="flex w-full flex-row gap-2">
        <SwapButton isXToY={isXToY} onClick={() => setIsXToY(true)} label="Buy" />
        <SwapButton isXToY={!isXToY} onClick={() => setIsXToY(false)} label="Sell" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="text-xs font-bold text-regular">
          {isXToY ? `Sui to ${tokenSymbol}` : `${tokenSymbol} to Sui`}
        </div>
        <input
          className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
          value={sendTokenAmount}
          onChange={(e) => setSendTokenAmount(e.target.value)}
          placeholder="0.0"
          type="number"
        />
        {isXToY && <div className="text-xs font-bold text-regular">Available SUI: {balance}</div>}
        {!isXToY && availableTickets !== "0" && (
          <div className="text-xs font-bold text-regular">Available tickets to sell: {availableTickets}</div>
        )}
        {!isXToY && (
          <div className="text-xs font-bold text-regular">
            Available {tokenSymbol} to sell: {memeBalance}
          </div>
        )}
        <div className="text-xs font-bold text-regular">
          {isXToY ? `${tokenSymbol} to receive: ${receiveTokenAmount}` : `Sui to receive: ${receiveTokenAmount}`}
        </div>
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
      {stakedLps[pool.memeCoinType]?.length > 0 && (
        <AvailableTicketsToSellDialog availableTickets={stakedLps[pool.memeCoinType]} symbol={tokenSymbol} />
      )}
      <Button onClick={onSwap} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
        <div className="text-xs font-bold text-white">Swap</div>
      </Button>
    </>
  );
};
