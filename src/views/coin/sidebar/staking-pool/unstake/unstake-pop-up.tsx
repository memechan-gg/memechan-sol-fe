import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useConnection } from "@/context/ConnectionContext";
import { useStakingPool } from "@/hooks/staking/useStakingPool";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { UnstakeDialogProps } from "@/views/coin/coin.types";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MEMECHAN_MEME_TOKEN_DECIMALS } from "@rinegade/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export const UnstakePopUp = ({
  tokenSymbol,
  livePoolAddress,
  ticketsData: { tickets, stakedAmount, refresh: refetchTickets },
  stakingPoolFromApi,
  closePopUp,
}: UnstakeDialogProps) => {
  const [availableAmountToUnstake, setAvailableAmountToUnstake] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: stakingPool } = useStakingPool(stakingPoolFromApi?.address);
  const { data: stakingPoolClient } = useStakingPoolClient(stakingPoolFromApi?.address);

  let cliffStartedTime: JSX.Element | string = <Skeleton width={35} />;
  let startVestingTime: JSX.Element | string = <Skeleton width={35} />;
  let endVestingTime: JSX.Element | string = <Skeleton width={35} />;
  let cliffStartedTimeInMs: number = 0;
  let startVestingTimeInMs: number = 0;
  let endVestingTimeInMs: number = 0;

  if (stakingPool) {
    cliffStartedTimeInMs = new BigNumber(stakingPool.vestingConfig.startTs.toString()).multipliedBy(1000).toNumber();
    startVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.cliffTs.toString()).multipliedBy(1000).toNumber();
    endVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.endTs.toString()).multipliedBy(1000).toNumber();

    cliffStartedTime = new Date(cliffStartedTimeInMs).toLocaleString();
    startVestingTime = new Date(startVestingTimeInMs).toLocaleString();
    endVestingTime = new Date(endVestingTimeInMs).toLocaleString();
  }

  const updateAvailableAmountToUnstake = useCallback(async () => {
    if (!stakingPoolClient || !stakingPool || !tickets) return;

    const amount = await stakingPoolClient.getAvailableUnstakeAmount({
      tickets: tickets.map((ticket) => ticket.fields),
      stakingPoolVestingConfig: stakingPool.vestingConfig,
    });

    //TODO: remove -1 after fix SDK
    const formattedAmount = new BigNumber(amount)
      .minus(1)
      .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)
      .toString();

    setAvailableAmountToUnstake(formattedAmount);
  }, [stakingPool, stakingPoolClient, tickets]);

  const unstake = useCallback(async () => {
    if (!publicKey || !availableAmountToUnstake || !stakingPoolClient) return;

    const sinceVestingStartedInMin = (Date.now() - startVestingTimeInMs) / 60000;

    const unstakeTrackObj = {
      availableAmountToUnstake,
      tokenSymbol,
      sinceVestingStartedInMin,
    };

    track("Unstake", unstakeTrackObj);

    try {
      setIsLoading(true);

      const ticketIds = tickets.map((ticket) => ticket.id);

      const rawAmountToUnstake = new BigNumber(availableAmountToUnstake)
        .multipliedBy(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)
        .toFixed(0);

      const transactions = await stakingPoolClient.getPreparedUnstakeTransactions({
        ammPoolId: new PublicKey(livePoolAddress),
        ticketIds: ticketIds,
        user: publicKey,
        amount: new BN(rawAmountToUnstake),
      });

      for (const tx of transactions) {
        const signature = await sendTransaction(tx, connection, {
          maxRetries: 3,
          skipPreflight: true,
        });

        toast(() => <TransactionSentNotification signature={signature} />);

        // Check that a part of the unstake succeeded
        const swapSucceeded = await confirmTransaction({ connection, signature });
        if (!swapSucceeded) return;
      }

      refetchTickets();
      toast.success("Successfully unstaked");
      track("Unstake_Success", unstakeTrackObj);
    } catch (e) {
      console.error("[UnstakeDialog.unstake] Failed to unstake:", e);
      toast.error("Failed to unstake. Please, try again");
    } finally {
      setIsLoading(false);
    }
  }, [
    sendTransaction,
    availableAmountToUnstake,
    livePoolAddress,
    publicKey,
    stakingPoolClient,
    tickets,
    connection,
    refetchTickets,
  ]);

  useEffect(() => {
    updateAvailableAmountToUnstake();
  }, [updateAvailableAmountToUnstake]);

  const unstakeButtonIsDisabled =
    availableAmountToUnstake === null || isLoading || new BigNumber(availableAmountToUnstake).isZero();

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between w-full">
          <Typography variant="h4" color="mono-600">
            Unstake
          </Typography>
          <FontAwesomeIcon icon={faXmark} color="#fff" className="sm:hover:cursor-pointer" onClick={closePopUp} />
        </div>
      </Card.Header>
      <Card.Body>
        <Typography variant="body">
          {" "}
          Unstake your staked memecoins from the staking pool. Once you unstake you cannot earn fees and stake back
          anymore.{" "}
        </Typography>
        <div>
          <Typography variant="body" className="mt-5">
            Cliff period started at: {cliffStartedTime}
          </Typography>
        </div>
        <div>
          <Typography variant="body" className="block">
            Vesting period starts at: {startVestingTime}
          </Typography>
        </div>
        <div>
          <Typography variant="body">Vesting period ends at: {endVestingTime}</Typography>
        </div>
        <div className="mt-5 flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-mono-500">
            Locked amount:{" "}
            {availableAmountToUnstake !== null &&
              BigNumber(stakedAmount).minus(availableAmountToUnstake).toNumber().toLocaleString()}
            {availableAmountToUnstake === null && <Skeleton width={35} />}{" "}
            <span className="!normal-case">{tokenSymbol}</span>
          </div>
          <div className="text-xs font-bold text-mono-500">
            Unstakable amount:{" "}
            {availableAmountToUnstake ? Number(availableAmountToUnstake).toLocaleString() : <Skeleton width={35} />}{" "}
            <span className="!normal-case">{tokenSymbol}</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <Button
            disabled={unstakeButtonIsDisabled}
            onClick={unstake}
            variant="primary"
            className="mt-5 w-full disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xs font-bold text-white">Unstake</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
