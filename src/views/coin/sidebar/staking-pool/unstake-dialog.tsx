import { MemechanClientInstance } from "@/common/solana";
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
import { useLivePool } from "@/hooks/live/useLivePool";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPool } from "@/hooks/staking/useStakingPool";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { useTickets } from "@/hooks/useTickets";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { useInterval } from "usehooks-ts";
import { UnstakeDialogProps } from "../../coin.types";

export const UnstakeDialog = ({ tokenSymbol, poolAddress, memeMint }: UnstakeDialogProps) => {
  const [availableAmountToUnstake, setAvailableAmountToUnstake] = useState<string | null>(null);
  const [close, setClose] = useState(false);

  const { publicKey, sendTransaction } = useWallet();
  const seedPoolData = useSeedPool(memeMint);
  const livePool = useLivePool(memeMint);
  const stakingPool = useStakingPool(poolAddress);
  const stakingPoolClient = useStakingPoolClient(poolAddress);
  const { tickets, availableTicketsAmount } = useTickets(seedPoolData?.address);

  const updateAvailableAmountToUnstake = useCallback(async () => {
    if (!stakingPoolClient || !stakingPool || !tickets) return;

    const amount = await stakingPoolClient.getAvailableUnstakeAmount({
      tickets: tickets.map((ticket) => ticket.fields),
      stakingPoolVestingConfig: stakingPool.vestingConfig,
    });

    setAvailableAmountToUnstake(amount);
  }, [stakingPool, stakingPoolClient, tickets]);

  const unstake = useCallback(async () => {
    if (!livePool || !publicKey || !availableAmountToUnstake || !stakingPoolClient) return;

    const ticketIds = tickets.map((ticket) => ticket.id);

    const { transactions, memeAccountKeypair, quoteAccountKeypair } =
      await stakingPoolClient.getPreparedUnstakeTransactions({
        ammPoolId: new PublicKey(livePool.address),
        ticketIds: ticketIds,
        user: publicKey,
        amount: availableAmountToUnstake,
      });

    for (const tx of transactions) {
      const signature = await sendTransaction(tx, MemechanClientInstance.connection, {
        signers: [memeAccountKeypair, quoteAccountKeypair],
        maxRetries: 3,
      });

      // Check that a part of the unstake succeeded
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

      if (swapTxResult.value.err) {
        console.error("[UnstakeDialog.unstake] Unstake failed:", JSON.stringify(swapTxResult, null, 2));
        toast("Unstake failed. Please, try again");
        return;
      }
    }

    toast.success("Successfully unstaked");
    setClose(true);
  }, [sendTransaction, availableAmountToUnstake, livePool, publicKey, stakingPoolClient, tickets]);

  useEffect(() => {
    updateAvailableAmountToUnstake();
  }, [updateAvailableAmountToUnstake]);

  useInterval(() => {
    updateAvailableAmountToUnstake();
  }, 5000);

  const startVestingTime = new Date(+stakingPool?.vestingConfig.cliffTs).toLocaleString();
  const endVestingTime = new Date(+stakingPool?.vestingConfig.endTs).toLocaleString();

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
            Locked amount:{" "}
            {availableAmountToUnstake !== null ? (
              BigNumber(availableTicketsAmount).minus(availableAmountToUnstake).toString()
            ) : (
              <Skeleton width={35} />
            )}{" "}
            <span className="!normal-case">{tokenSymbol}</span>
          </div>
          <div className="text-xs font-bold text-regular">
            Unlockable amount: {availableAmountToUnstake ?? <Skeleton width={35} />}{" "}
            <span className="!normal-case">{tokenSymbol}</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1"></div>
        <DialogFooter>
          <Button
            disabled={availableAmountToUnstake === null || availableAmountToUnstake === "0"}
            onClick={unstake}
            className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50"
          >
            <div className="text-xs font-bold text-white">Unstake</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
