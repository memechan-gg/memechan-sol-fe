import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RemoveLiquidityDialogProps } from "../../coin.types";
import { validateRemoveLiquidityInput } from "../../coin.utils";
import { useWallet } from "@solana/wallet-adapter-react";

export const RemoveLiquidityDialog = ({
  lpCoinBalance,
  tokenSymbol,
  quoteRemoveLiquidity,
  removeLiquidity,
}: RemoveLiquidityDialogProps) => {
  const [memeAmount, setMemeAmount] = useState("0.0");
  const [suiAmount, setSuiAmount] = useState("0.0");
  const [slippage, setSlippage] = useState(0.5);
  const [inputLp, setInputLP] = useState("0.0");

  const {connected} = useWallet();

  useEffect(() => {
    if (Number.isNaN(parseInt(inputLp)) || inputLp === "0.0") {
      setMemeAmount("0.0");
      setSuiAmount("0.0");
      return;
    }

    quoteRemoveLiquidity({
      lpCoinInput: inputLp,
      slippagePercentage: slippage,
    }).then((res) => {
      const [suiAmount, memeAmount] = res;
      setMemeAmount(memeAmount);
      setSuiAmount(suiAmount);
    });
  }, [memeAmount, slippage, suiAmount, inputLp, quoteRemoveLiquidity]);

  async function onRemoveLiquidity() {
    if (!connected) return;

    if (!validateRemoveLiquidityInput(inputLp, lpCoinBalance, slippage.toString())) return;

    try {
      let tx = await removeLiquidity({
        lpCoinInput: inputLp,
        minAmounts: {
          memeCoin: memeAmount,
          suiCoin: suiAmount,
        },
        slippagePercentage: slippage,
      });

      if (!tx) {
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
      toast.error((e as Error).message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Remove Liquidity</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Liquidity</DialogTitle>
          <DialogDescription>Remove liquidity from the pool</DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-regular">LP</div>
          <input
            className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
            value={inputLp}
            onChange={(e) => setInputLP(e.target.value)}
            type="number"
          />
          <div className="text-xs font-bold text-regular">Available: {lpCoinBalance} LP</div>
          <div className="text-xs font-bold text-regular">Slippage</div>
          <input
            className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
          />

          <div className="text-xs font-bold text-regular mt-6">Outputs</div>
          <div className="flex flex-row gap-2">
            {/* Show amounts of removed */}
            <input
              disabled
              className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
              value={memeAmount + " " + tokenSymbol}
            />
            <input
              disabled
              className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
              value={suiAmount + " SUI"}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onRemoveLiquidity} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
            <div className="text-xs font-bold text-white">Remove Liquidity</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
