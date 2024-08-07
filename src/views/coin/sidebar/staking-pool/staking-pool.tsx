import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useStakingPool } from "@/hooks/staking/useStakingPool";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { CHAN_TOKEN_DECIMALS, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { StakingPoolProps } from "../../coin.types";

export const StakingPool = ({
  tokenSymbol,
  livePoolAddress,
  ticketsData,
  stakingPoolFromApi,
  ticketsData: { tickets, stakedAmount, refresh: refetchTickets },
}: StakingPoolProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [memeAmount, setMemeAmount] = useState<string | null>(null);
  const [chanAmount, setChanAmount] = useState<string | null>(null);
  const [slerfAmount, setSlerfAmount] = useState<string | null>(null);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [availableAmountToUnstake, setAvailableAmountToUnstake] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: stakingPool } = useStakingPool(stakingPoolFromApi?.address);
  const { data: stakingPoolClient } = useStakingPoolClient(stakingPoolFromApi?.address);
  const { data: tokenInfo } = useQuery({
    queryKey: ["staking-pool", stakingPoolFromApi?.address, !!stakingPoolClient?.getTokenInfo],
    queryFn: () => stakingPoolClient?.getTokenInfo(),
    enabled: !!stakingPoolClient?.getTokenInfo,
  });

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

  const updateAvailableFeesToWithdraw = useCallback(async () => {
    if (!stakingPoolClient || !tokenInfo) return;

    const ticketFields = tickets.map((ticket) => ticket.fields);
    const { memeFees, quoteFees, chanFees } = (await stakingPoolClient.getAvailableWithdrawFeesAmount({
      tickets: ticketFields as any,
    })) as any;

    const formattedMemeFees = new BigNumber(memeFees).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);
    const formattedSlerfFees = new BigNumber(quoteFees).div(10 ** tokenInfo.decimals);
    const formattedChanFees = new BigNumber(chanFees).div(10 ** CHAN_TOKEN_DECIMALS);

    setMemeAmount(formattedMemeFees.toString());
    setSlerfAmount(formattedSlerfFees.toString());
    setChanAmount(formattedChanFees.toString());
  }, [stakingPoolClient, tickets, tokenInfo]);

  // TODO: This executes more than should
  useEffect(() => {
    updateAvailableFeesToWithdraw();
  }, [updateAvailableFeesToWithdraw]);

  const withdrawFees = useCallback(async () => {
    if (!publicKey || !stakingPoolClient) return;

    try {
      setIsWithdrawLoading(true);

      const withdrawFeesTrackObj = {
        memeAmount,
        chanAmount,
        solAmount: slerfAmount,
        tokenSymbol,
      };

      track("WithdrawFees", withdrawFeesTrackObj);

      const ticketIds = tickets.map((ticket) => ticket.id);

      const transactions = await stakingPoolClient.getPreparedWithdrawFeesTransactions({
        ammPoolId: new PublicKey(livePoolAddress),
        ticketIds: ticketIds,
        user: publicKey,
      });

      for (const tx of transactions) {
        const signature = await sendTransaction(tx, connection, {
          maxRetries: 3,
          skipPreflight: true,
        });

        toast(() => <TransactionSentNotification signature={signature} />);

        // Check that a part of the withdraw fees succeeded
        const swapSucceeded = await confirmTransaction({ connection, signature });
        if (!swapSucceeded) return;
      }

      setMemeAmount("0");
      setSlerfAmount("0");

      refetchTickets();

      track("WithdrawFees_Success", withdrawFeesTrackObj);

      toast.success("Fees are successfully withdrawn");
    } catch (e) {
      console.error("[WithdrawFeesDialog.withdrawFees] Error while withdrawing:", e);
      toast.error("Failed to withdraw the available fees. Please, try again");
    } finally {
      setIsWithdrawLoading(false);
    }
  }, [
    publicKey,
    stakingPoolClient,
    memeAmount,
    chanAmount,
    slerfAmount,
    tokenSymbol,
    tickets,
    livePoolAddress,
    refetchTickets,
    sendTransaction,
    connection,
  ]);

  const unstakeButtonIsDisabled =
    availableAmountToUnstake === null || isLoading || new BigNumber(availableAmountToUnstake).isZero();

  const withdrawFeesButtonIsDisabled =
    memeAmount === null ||
    chanAmount === null ||
    slerfAmount === null ||
    isWithdrawLoading ||
    (new BigNumber(memeAmount).isZero() && new BigNumber(slerfAmount).isZero() && new BigNumber(chanAmount).isZero());

  const updateFeesButtonIsDisabled =
    memeAmount === null || slerfAmount === null || chanAmount === null || isUpdateLoading;

  return (
    <div className="flex flex-col">
      {/* <div className="flex w-full border-mono-400 border p-2 gap-4 pr-4 pl-3">
        <div className="text-[10px] mt-[2px]">⚠️</div>
        <div>
          <Typography variant="body" color="yellow-100">
            Presale is ongoing still. Vesting and revenue sharing will start once the token goes live.
          </Typography>
        </div>
      </div> */}
      <div className="flex flex-col">
        <div className="flex justify-between mt-4">
          <Typography variant="body" color="mono-500">
            Staked Amount
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              69,420 {tokenSymbol}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $13.42
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Typography variant="body" color="mono-500">
            Claimable Amount
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              0 {tokenSymbol}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $0.00
            </Typography>
          </div>
        </div>
        <Divider vertical={false} className="mt-4"></Divider>
        <div className="flex justify-between mt-4">
          <Typography variant="body" color="mono-500">
            {tokenSymbol} Fees Earned
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              0 {tokenSymbol}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $0.00
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Typography variant="body" color="mono-500">
            SOL Fees Earned
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              0 SOL
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $0.00
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Typography variant="body" color="mono-500">
            CHAN Fees Earned
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              0 CHAN
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $0.00
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-4 gap-3">
          <Button variant="primary" className="px-2 py-5">
            <Typography variant="h4" color="mono-600">
              Unstake
            </Typography>
          </Button>
          <Button variant="secondary" className="px-2 py-5">
            <Typography variant="h4" color="mono-600">
              Claim Fees
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

// <div className="flex flex-col gap-2 w-full">
//   <Card>
//     <Card.Header>
//       <Typography variant="h4" color="mono-600">
//         Staking Pool
//       </Typography>
//     </Card.Header>
//     <Card.Body>
//       <Typography variant="body" color="mono-500">
//         As Pre-Sale investor you are earning fees from trading of the{" "}
//         <span className="!normal-case underline">{tokenSymbol}</span> token. You can unstake your staked memecoins
//         or withdraw your fees from the staking pool.
//       </Typography>
//       <div className="flex flex-col w-full gap-1 mt-4">
//         <div className="flex w-full flex-row gap-4 mt-2 justify-between">
//           <UnstakeDialog
//             tokenSymbol={tokenSymbol}
//             livePoolAddress={livePoolAddress}
//             ticketsData={ticketsData}
//             stakingPoolFromApi={stakingPoolFromApi}
//           />
//           <WithdrawFeesDialog
//             tokenSymbol={tokenSymbol}
//             livePoolAddress={livePoolAddress}
//             ticketsData={ticketsData}
//             stakingPoolFromApi={stakingPoolFromApi}
//           />
//         </div>
//       </div>
//     </Card.Body>
//   </Card>
// </div>
