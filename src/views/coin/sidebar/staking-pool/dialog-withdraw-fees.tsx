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
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WithdrawFeesDialogProps } from "../../coin.types";

export const WithdrawFeesDialog = ({ tokenSymbol, stakingPool, clammPoolId }: WithdrawFeesDialogProps) => {
  const account = useCurrentAccount();
  const { mutateAsync: doTX } = useSignAndExecuteTransactionBlock();
  const [memeAmount, setMemeAmount] = useState("0.0");
  const [suiAmount, setSuiAmount] = useState("0.0");

  useEffect(() => {
    if (!account) return;
    stakingPool
      .getAvailableFeesToWithdraw({
        owner: account.address,
      })
      .then((res) => {
        setMemeAmount(res.availableFees.memeAmount);
        setSuiAmount(res.availableFees.suiAmount);
      });
  }, [account, stakingPool]);

  async function withdrawFees() {
    if (!account) return;

    try {
      const res = await doTX({
        transactionBlock: (
          await stakingPool.getCollectFeesAndWithdrawFeesTransaction({
            clmmPool: clammPoolId,
            signerAddress: account.address,
            stakingPool: stakingPool.data.address,
          })
        ).tx,
        requestType: "WaitForLocalExecution",
        options: {
          showBalanceChanges: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showInput: true,
        },
      });

      const status = res.effects?.status.status;

      if (status === "success") {
        toast.success("Fees are successfully withdrawn");
        return;
      }

      if (status === "failure") {
        toast.error("Failed to withdraw fees");
        return;
      }
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
              className="w-full bg-white !normal-case text-xs font-bold text-regular p-2 rounded-lg"
              value={memeAmount + " " + tokenSymbol}
            />
            <input
              disabled
              className="w-full bg-white !normal-case text-xs font-bold text-regular p-2 rounded-lg"
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
