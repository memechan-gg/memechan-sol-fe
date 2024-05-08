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
import { WithdrawFeesDialogProps } from "../../coin.types";
import { useWallet } from "@solana/wallet-adapter-react";

export const WithdrawFeesDialog = ({ tokenSymbol, stakingPool }: WithdrawFeesDialogProps) => {
  const {publicKey, connected} = useWallet();
  const [memeAmount, setMemeAmount] = useState("0.0");
  const [suiAmount, setSuiAmount] = useState("0.0");

  useEffect(() => {
    if (!connected || !publicKey) return;
    stakingPool
      .getAvailableFeesToWithdraw({
        owner: publicKey.toBase58(),
      })
      .then((res: any) => {
        setMemeAmount(res.availableFees.memeAmount);
        setSuiAmount(res.availableFees.suiAmount);
      });
  }, [publicKey, stakingPool]);

  async function withdrawFees() {
    if (!connected || !publicKey) return;

    try {
      //stakingPool.withdrawFees(transactionBlock, publicKey.toBase58());

      /*await doTX({
        transactionBlock,
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
          <div className="text-xs font-bold text-white">Withdraw Fees</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Fees</DialogTitle>
          <DialogDescription>Withdraw fees from the staking pool</DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
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
          <Button onClick={withdrawFees} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
            <div className="text-xs font-bold text-white">Withdraw Fees</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
