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
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AddLiquidityDialogProps } from "../../coin.types";
import { validateAddLiquidityInput } from "../../coin.utils";
import { useWallet } from "@solana/wallet-adapter-react";

export const AddLiquidityDialog = ({
  lpCoinBalance,
  memeBalance,
  tokenSymbol,
  addLiquidity,
  quoteAddLiquidity,
}: AddLiquidityDialogProps) => {
  const [memeAmount, setMemeAmount] = useState("0.0");
  const [suiAmount, setSuiAmount] = useState("0.0");
  const [slippage, setSlippage] = useState(0.5);
  const [outputLP, setOutputLP] = useState("0.0");

  const { balance: suiBalance } = useUser();
  const {connected} = useWallet();

  useEffect(() => {
    setMemeAmount("");
    setSuiAmount("");
  }, []);

  useEffect(() => {
    if (Number.isNaN(parseInt(suiAmount)) || suiAmount === "0.0") {
      setOutputLP("0");
      return;
    }
    if (Number.isNaN(parseInt(memeAmount)) || memeAmount === "0.0") {
      setOutputLP("0");
      return;
    }

    quoteAddLiquidity({
      memeCoinInput: memeAmount,
      suiCoinInput: suiAmount,
      slippagePercentage: slippage,
    }).then((res) => {
      setOutputLP(res);
    });
  }, [memeAmount, slippage, suiAmount, quoteAddLiquidity]);

  async function onAddLiquidity() {
    if (!connected) return;
    if (!validateAddLiquidityInput(memeAmount, suiAmount, memeBalance, suiBalance, slippage.toString())) return;

    try {
      let tx = await addLiquidity({
        memeCoinInput: memeAmount,
        suiCoinInput: suiAmount,
        minOutputAmount: outputLP,
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
          <div className="text-xs font-bold text-white">Add Liquidity</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Liquidity</DialogTitle>
          <DialogDescription>Add liquidity to the pool to earn fees and rewards</DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-regular">MemeCoin</div>
          <input
            className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
            value={memeAmount}
            onChange={(e) => setMemeAmount(e.target.value)}
            placeholder="0.0"
            // only accept numbers
            type="number"
          />
          {/** Show memecoin balance */}
          <div className="text-xs font-bold text-regular">
            Available: {memeBalance} {tokenSymbol}
          </div>
          <div className="text-xs font-bold text-regular">SUI</div>
          <input
            className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
            value={suiAmount}
            onChange={(e) => setSuiAmount(e.target.value)}
            placeholder="0.0"
            // only accept numbers
            type="number"
          />
          <div className="text-xs font-bold text-regular">Available: {suiBalance} SUI</div>
          <div className="text-xs font-bold text-regular">Output LP</div>
          <input className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg" value={outputLP} disabled />
          <div className="text-xs font-bold text-regular">{lpCoinBalance} LP</div>
          <div className="text-xs font-bold text-regular">Slippage</div>
          <input
            className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button onClick={onAddLiquidity} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
            <div className="text-xs font-bold text-white">Add Liquidity</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
