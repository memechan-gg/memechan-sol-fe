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
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInterval } from "usehooks-ts";
import { UnstakeDialogProps } from "../../coin.types";

export const UnstakeDialog = ({ tokenSymbol, ticketBalance, stakingPool, clammPoolId }: UnstakeDialogProps) => {
  const [ticketAmount, setTicketAmount] = useState("0.0");
  const account = useCurrentAccount();
  const { mutateAsync: doTX } = useSignAndExecuteTransactionBlock();
  const [close, setClose] = useState(false);

  useEffect(() => {
    if (!account) return;
    stakingPool
      .getAvailableAmountToUnstake({
        owner: account.address,
      })
      .then((res) => {
        setTicketAmount(res.availableMemeAmountToUnstake);
      })
      .catch((e) => {
        toast.error((e as Error).message);
      });
  }, [stakingPool, account]);

  async function onUnstake() {
    if (!account) return;

    try {
      let tx = await stakingPool.getCollectFeesAndUnstakeTransaction({
        inputAmount: ticketAmount,
        signerAddress: account.address,
        clmmPool: clammPoolId,
        stakingPool: stakingPool.data.address,
      });

      const res = await doTX({
        transactionBlock: tx.tx,
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
        toast.success("Successfully unstaked");
        return;
      }

      if (status === "failure") {
        toast.error("Failed to unstake");
        return;
      }

      setClose(true);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  useInterval(() => {
    if (!account) return;
    stakingPool
      .getAvailableAmountToUnstake({
        owner: account.address,
      })
      .then((res) => {
        setTicketAmount(res.availableMemeAmountToUnstake);
      })
      .catch((e) => {
        toast.error((e as Error).message);
      });
  }, 5000);

  const startVestingTime = new Date(+stakingPool.data.vesting.data.cliffTs).toLocaleString();
  const endVestingTime = new Date(+stakingPool.data.vesting.data.endTs).toLocaleString();

  return (
    <Dialog open={close ? false : undefined}>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Unlock Token</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock</DialogTitle>
          <DialogDescription>
            Unlock your locked Meme Coins from the staking pool. Once you unlock you cannot earn fees anymore, and
            can&apos;t lock.
            <div className="text-xs font-bold text-regular mt-2">Vesting starts at: {startVestingTime}</div>
            <div className="text-xs font-bold text-regular">Vesting ends at: {endVestingTime}</div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-regular">
            Locked amount: {BigNumber(ticketBalance).minus(ticketAmount).toString()}{" "}
            <span className="!normal-case">{tokenSymbol}</span>
          </div>
          <div className="text-xs font-bold text-regular">
            Unlockable amount: {ticketAmount} <span className="!normal-case">{tokenSymbol}</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1"></div>
        <DialogFooter>
          <Button onClick={onUnstake} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
            <div className="text-xs font-bold text-white">Unstake</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
