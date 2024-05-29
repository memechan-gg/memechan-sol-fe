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
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPool } from "@/hooks/staking/useStakingPool";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useTickets } from "@/hooks/useTickets";
import { getTransactionSigners } from "@/utils/getTransactionSigners";
import { MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { UnstakeDialogProps } from "../../coin.types";

export const UnstakeDialog = ({ tokenSymbol, livePoolAddress, memeMint }: UnstakeDialogProps) => {
  const [availableAmountToUnstake, setAvailableAmountToUnstake] = useState<string | null>(null);

  const { publicKey, sendTransaction } = useWallet();
  const { seedPool } = useSeedPool(memeMint);
  const stakingPoolFromApi = useStakingPoolFromApi(memeMint);
  const stakingPool = useStakingPool(stakingPoolFromApi?.address);
  const stakingPoolClient = useStakingPoolClient(stakingPoolFromApi?.address);
  const { tickets, stakedAmount } = useTickets(seedPool?.address);

  const updateAvailableAmountToUnstake = useCallback(async () => {
    if (!stakingPoolClient || !stakingPool || !tickets) return;

    const amount = await stakingPoolClient.getAvailableUnstakeAmount({
      tickets: tickets.map((ticket) => ticket.fields),
      stakingPoolVestingConfig: stakingPool.vestingConfig,
    });

    const formattedAmount = new BigNumber(amount).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

    setAvailableAmountToUnstake(formattedAmount);
  }, [stakingPool, stakingPoolClient, tickets]);

  const unstake = useCallback(async () => {
    if (!publicKey || !availableAmountToUnstake || !stakingPoolClient) return;

    const ticketIds = tickets.map((ticket) => ticket.id);

    const rawAmountToUnstake = new BigNumber(availableAmountToUnstake)
      .multipliedBy(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)
      .toFixed(0);

    const { transactions, memeAccountKeypair, quoteAccountKeypair } =
      await stakingPoolClient.getPreparedUnstakeTransactions({
        ammPoolId: new PublicKey(livePoolAddress),
        ticketIds: ticketIds,
        user: publicKey,
        amount: new BN(rawAmountToUnstake),
      });

    for (const tx of transactions) {
      const signers = getTransactionSigners({
        extraSigners: [memeAccountKeypair, quoteAccountKeypair],
        transaction: tx,
      });

      const signature = await sendTransaction(tx, MemechanClientInstance.connection, {
        signers,
        maxRetries: 3,
        skipPreflight: true,
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
        toast.error("Unstake failed. Please, try again");
        return;
      }
    }

    toast.success("Successfully unstaked");
  }, [sendTransaction, availableAmountToUnstake, livePoolAddress, publicKey, stakingPoolClient, tickets]);

  useEffect(() => {
    updateAvailableAmountToUnstake();
  }, [updateAvailableAmountToUnstake]);

  let startVestingTime: JSX.Element | string = <Skeleton width={35} />;
  let endVestingTime: JSX.Element | string = <Skeleton width={35} />;

  if (stakingPool) {
    const startVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.cliffTs.toString())
      .multipliedBy(1000)
      .toNumber();
    const endVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.endTs.toString()).multipliedBy(1000).toNumber();

    startVestingTime = new Date(startVestingTimeInMs).toLocaleString();
    endVestingTime = new Date(endVestingTimeInMs).toLocaleString();
  }

  return (
    <Dialog>
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
            {availableAmountToUnstake !== null && BigNumber(stakedAmount).minus(availableAmountToUnstake).toString()}
            {availableAmountToUnstake === null && <Skeleton width={35} />}{" "}
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
            <span className="text-xs font-bold text-white">Unstake</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
