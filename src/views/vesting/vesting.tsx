import { Button } from "@/components/button";
import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { LOW_VESTING_CLAIMABLE_AMOUNT_THRESHOLD } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useVesting } from "@/hooks/vesting/useVesting";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { MEMECHAN_QUOTE_TOKEN_DECIMALS, VestingClient } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { InputAmountButtons } from "../coin/sidebar/swap/input-amount-buttons";
import { handleSwapInputChange } from "../coin/sidebar/swap/utils";
import { validateVestingClaimInputAmount } from "./utils";

export const Vesting = () => {
  const [claimableAmount, setClaimableAmount] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [inputAmount, setInputAmount] = useState<string>("");

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { vesting, connected, isLoading, refresh: refreshVesting } = useVesting();

  const updateClaimableAmount = useCallback(async () => {
    if (!vesting) return;

    const rawAmount = VestingClient.getVestingClaimableAmount({ vesting });
    // TODO: Find out what decimals should be here
    const formattedAmount = new BigNumber(rawAmount).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();

    setClaimableAmount(
      new BigNumber(formattedAmount).lt(LOW_VESTING_CLAIMABLE_AMOUNT_THRESHOLD) ? "0" : formattedAmount,
    );
  }, [vesting]);

  const claim = useCallback(async () => {
    if (!claimableAmount || !vesting || !publicKey) return;

    if (!validateVestingClaimInputAmount({ maxAmount: claimableAmount, inputAmount })) return;

    try {
      setIsClaiming(true);

      const rawAmountToClaim = new BigNumber(inputAmount).multipliedBy(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();
      const vestingId = VestingClient.getVestingPDA({
        vestingNumber: VestingClient.VESTING_NUMBER_START,
        user: publicKey,
      });

      const tx = await VestingClient.getClaimTransaction({ amount: new BN(rawAmountToClaim), vesting, vestingId });

      const signature = await sendTransaction(tx, connection, {
        maxRetries: 3,
        skipPreflight: true,
      });

      toast(() => <TransactionSentNotification signature={signature} />);

      // Check that a part of the unstake succeeded
      const swapSucceeded = await confirmTransaction({ connection, signature });
      if (!swapSucceeded) return;

      refreshVesting();
      toast.success("Successfully claimed");
    } catch (e) {
      console.error("[Vesting.claim] Failed to claim:", e);
      toast.error("Failed to claim. Please, try again");
    } finally {
      setIsClaiming(false);
    }
  }, [claimableAmount, connection, publicKey, sendTransaction, vesting, refreshVesting, inputAmount]);

  useEffect(() => {
    updateClaimableAmount();
  }, [updateClaimableAmount]);

  let cliffStartedTime: JSX.Element | string = <Skeleton width={35} />;
  let startVestingTime: JSX.Element | string = <Skeleton width={35} />;
  let endVestingTime: JSX.Element | string = <Skeleton width={35} />;

  if (vesting) {
    const cliffStartedTimeInMs = new BigNumber(vesting.createdTs.toString()).multipliedBy(1000).toNumber();
    const startVestingTimeInMs = new BigNumber(vesting.startTs.toString()).multipliedBy(1000).toNumber();
    const endVestingTimeInMs = new BigNumber(vesting.endTs.toString()).multipliedBy(1000).toNumber();

    cliffStartedTime = new Date(cliffStartedTimeInMs).toLocaleString();
    startVestingTime = new Date(startVestingTimeInMs).toLocaleString();
    endVestingTime = new Date(endVestingTimeInMs).toLocaleString();
  }

  const userIsNotEligible = connected && !isLoading && vesting === null;
  const userIsEligible = connected && !isLoading && vesting;
  const isPossibleToClaim = claimableAmount && new BigNumber(claimableAmount).gt(0);
  const claimButtonIsDisabled = !isPossibleToClaim || isClaiming || inputAmount === "0" || inputAmount === "";
  const inputIsDisabled = !isPossibleToClaim || isClaiming;
  // TODO: Find out what decimals should be here
  const outstandingAmount =
    userIsEligible && new BigNumber(vesting.outstanding.toString()).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();

  return (
    <div className="flex text-regular justify-center items-center">
      <div className="flex flex-col gap-8">
        <h1 className="max-xxs:text-center text-2xl font-semibold">$CHAN Vesting</h1>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Vesting Information</h2>
          {!connected && "Connect your wallet to find out whether you are eligible for $CHAN vesting."}
          {connected && isLoading && (
            <div>
              You are <Skeleton width={35} inline /> for $CHAN vesting.
            </div>
          )}
          {userIsNotEligible && <div>You are not eligible for $CHAN vesting.</div>}
          {userIsEligible && (
            <div className="flex flex-col gap-2 xs:gap-1">
              <div className="mb-5">You are eligible for $CHAN vesting!</div>
              <p className="flex flex-col xs:flex-row">
                <span>Cliff period starts at:&nbsp;</span>
                <span>{cliffStartedTime}</span>
              </p>
              <p className="flex flex-col xs:flex-row">
                <span>Vesting period starts at:&nbsp;</span>
                <span>{startVestingTime}</span>
              </p>
              <p className="flex flex-col xs:flex-row">
                <span>Vesting period ends at:&nbsp;</span>
                <span>{endVestingTime}</span>
              </p>
              <div className="flex flex-col gap-2 xxs:gap-1">
                <div className="mt-5 flex flex-col xxs:flex-row">
                  <span>Vested amount:&nbsp;</span>
                  <span>{outstandingAmount ?? <Skeleton width={35} inline />} CHAN</span>
                </div>
                <div className="flex flex-col xxs:flex-row">
                  <span>Claimable amount:&nbsp;</span>
                  <span>{claimableAmount ?? <Skeleton width={35} inline />} CHAN</span>
                </div>
              </div>
              <div className="flex flex-col xxs:flex-row justify-between font-bold text-xs mt-5">
                <label htmlFor="amount-to-claim">Amount to claim:</label>
                {isPossibleToClaim && (
                  <InputAmountButtons
                    decimals={MEMECHAN_QUOTE_TOKEN_DECIMALS}
                    maxAmount={claimableAmount}
                    setInputAmount={setInputAmount}
                  />
                )}
              </div>
              <input
                id="amount-to-claim"
                disabled={inputIsDisabled}
                className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
                value={inputAmount}
                onChange={(e) =>
                  handleSwapInputChange({
                    decimalPlaces: MEMECHAN_QUOTE_TOKEN_DECIMALS,
                    e,
                    setValue: setInputAmount,
                  })
                }
                placeholder="0"
                type="text"
                autoComplete="off"
              />
              <Button
                className="max-xxs:self-center w-20 bg-regular bg-opacity-80 hover:bg-opacity-50 text-xs font-bold text-white mt-4 disabled:opacity-50"
                disabled={claimButtonIsDisabled}
                onClick={claim}
              >
                {isClaiming ? "Claiming..." : "Claim"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
