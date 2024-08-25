import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useStakingPool } from "@/hooks/staking/useStakingPool";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { useChanPrice } from "@/hooks/useChanPrice";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { useSolanaPrice } from "@/hooks/useSolanaPrice";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import { format, parse, roundToNearestMinutes } from "date-fns";
import { CHAN_TOKEN_DECIMALS, MEMECHAN_MEME_TOKEN_DECIMALS } from "memechan-sol-sdk";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import { StakingPoolProps } from "../../coin.types";

export const StakingPool = ({
  tokenSymbol,
  livePoolAddress,
  ticketsData,
  quoteTokenInfo,
  stakingPoolFromApi,
  ticketsData: { tickets, stakedAmount, refresh: refetchTickets },
}: StakingPoolProps) => {
  const { theme } = useTheme();
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
  const { data: memePrice, isLoading: memePriceLoading } = useMemePriceFromBE({
    memeMint: stakingPoolFromApi?.tokeAddress || "",
    poolType: "livePool",
  });
  const { data: solanaPriceInUSD, isLoading: solPriceLoading } = useSolanaPrice();
  const { data: chanPriceInUSD, isLoading: chanPriceLoading } = useChanPrice();

  // let cliffStartedTime: string = undefined;
  let startVestingTime: string | undefined = undefined;
  let endVestingTime: string | undefined = undefined;
  // let cliffStartedTimeInMs: number = 0;
  let startVestingTimeInMs: number = 0;
  let endVestingTimeInMs: number = 0;

  if (stakingPool) {
    // cliffStartedTimeInMs = new BigNumber(stakingPool.vestingConfig.startTs.toString()).multipliedBy(1000).toNumber();
    startVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.cliffTs.toString()).multipliedBy(1000).toNumber();
    endVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.endTs.toString()).multipliedBy(1000).toNumber();

    // cliffStartedTime = new Date(cliffStartedTimeInMs).toLocaleString();
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
    publicKey,
    availableAmountToUnstake,
    stakingPoolClient,
    startVestingTimeInMs,
    tokenSymbol,
    tickets,
    livePoolAddress,
    refetchTickets,
    sendTransaction,
    connection,
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

  function formatDates(dateStr1: string, dateStr2: string) {
    function parseRoundAndFormat(dateStr: string) {
      const date = parse(dateStr, "dd/MM/yyyy, HH:mm:ss", new Date());
      const roundedDate = roundToNearestMinutes(date, { nearestTo: 1 });

      try {
        return format(roundedDate, "dd MMM, HH:mm");
      } catch (e) {
        return undefined;
      }
    }

    const formattedDate1 = parseRoundAndFormat(dateStr1);
    const formattedDate2 = parseRoundAndFormat(dateStr2);
    if (!formattedDate1 || !formattedDate2) return undefined;

    return `${formattedDate1} - ${formattedDate2}`;
  }

  console.log(chanPriceInUSD);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {startVestingTime && endVestingTime && formatDates(startVestingTime, endVestingTime) && (
          <div className="flex justify-between mt-4 items-center text-end">
            <Typography variant="body" color="mono-500">
              Vesting Period
            </Typography>
            <div>
              <Typography variant="body" color="mono-600">
                {startVestingTime && endVestingTime ? (
                  <div>{formatDates(startVestingTime, endVestingTime)}</div>
                ) : (
                  <Skeleton
                    width={35}
                    baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                    highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                  />
                )}
              </Typography>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-2 items-center text-end">
          <Typography variant="body" color="mono-500">
            Staked Amount
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              {stakedAmount ? (
                <div>
                  {Number(stakedAmount).toLocaleString()} <span className="!normal-case">{tokenSymbol}</span>
                </div>
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="10px"
                    width="10px"
                    color="#3e3e3e"
                    ariaLabel="oval-loading"
                    secondaryColor="#979797"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              {"/ "}
              {stakedAmount && !memePriceLoading && memePrice ? (
                <span>${Math.round(Number(stakedAmount) * (+memePrice * 100)) / 100}</span>
              ) : (
                <Skeleton
                  width={45}
                  baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                  highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                />
              )}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2 items-center text-end">
          <Typography variant="body" color="mono-500">
            Claimable Amount
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              {availableAmountToUnstake ? (
                <span>
                  {Number(availableAmountToUnstake).toLocaleString()}{" "}
                  <span className="!normal-case">{tokenSymbol}</span>
                </span>
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="10px"
                    width="10px"
                    color="#3e3e3e"
                    ariaLabel="oval-loading"
                    secondaryColor="#979797"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              {"/ "}
              {availableAmountToUnstake && !memePriceLoading && memePrice ? (
                <span>${Math.round(Number(availableAmountToUnstake) * (+memePrice * 100)) / 100}</span>
              ) : (
                <Skeleton
                  width={45}
                  baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                  highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                />
              )}
            </Typography>
          </div>
        </div>
        <Divider vertical={false} className="mt-4"></Divider>
        <div className="flex justify-between mt-4 items-center text-end">
          <Typography variant="body" color="mono-500">
            {tokenSymbol} Unclaimed Fees
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              {memeAmount ? (
                Number(memeAmount).toLocaleString(undefined, {
                  maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS,
                }) +
                " " +
                tokenSymbol
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="10px"
                    width="10px"
                    color="#3e3e3e"
                    ariaLabel="oval-loading"
                    secondaryColor="#979797"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              {"/ "}
              {memeAmount && !memePriceLoading && memePrice ? (
                <span>${Math.round(Number(memeAmount) * (+memePrice * 100)) / 100}</span>
              ) : (
                <Skeleton
                  width={45}
                  baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                  highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                />
              )}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2 items-center text-end">
          <Typography variant="body" color="mono-500">
            {quoteTokenInfo?.symbol || "SOL"} Unclaimed Fees
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              {slerfAmount && tokenInfo ? (
                Number(slerfAmount).toLocaleString(undefined, {
                  maximumFractionDigits: tokenInfo.decimals,
                }) +
                  " " +
                  quoteTokenInfo?.symbol || "SOL"
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="10px"
                    width="10px"
                    color="#3e3e3e"
                    ariaLabel="oval-loading"
                    secondaryColor="#979797"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              {"/ "}
              {slerfAmount && !solPriceLoading && solanaPriceInUSD ? (
                <span>${Math.round(Number(slerfAmount) * (solanaPriceInUSD.price * 100)) / 100}</span>
              ) : (
                <Skeleton
                  width={45}
                  baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                  highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                />
              )}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2 items-center text-end">
          <Typography variant="body" color="mono-500">
            CHAN Unclaimed Fees
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              {chanAmount && tokenInfo ? (
                Number(chanAmount).toLocaleString(undefined, {
                  maximumFractionDigits: CHAN_TOKEN_DECIMALS,
                }) + " CHAN"
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="10px"
                    width="10px"
                    color="#3e3e3e"
                    ariaLabel="oval-loading"
                    secondaryColor="#979797"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              {"/ "}
              {chanAmount && !chanPriceLoading && chanPriceInUSD ? (
                <span>${Math.round(Number(chanAmount) * (chanPriceInUSD.price * 100)) / 100}</span>
              ) : (
                <Skeleton
                  width={45}
                  baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                  highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                />
              )}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-4 gap-3">
          <Button
            variant={unstakeButtonIsDisabled ? "disabled" : "primary"}
            className="px-2 py-5 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            disabled={unstakeButtonIsDisabled}
            onClick={unstake}
          >
            <Typography variant="h4" color="mono-600">
              Unstake
            </Typography>
          </Button>
          <Button
            variant={withdrawFeesButtonIsDisabled || updateFeesButtonIsDisabled ? "disabled" : "secondary"}
            className="px-2 py-5 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            disabled={withdrawFeesButtonIsDisabled || updateFeesButtonIsDisabled}
            onClick={withdrawFees}
          >
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
