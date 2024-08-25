import { TransactionSentNotification } from "@/components/notifications/transaction-sent-notification";
import { useConnection } from "@/context/ConnectionContext";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { Button } from "@/memechan-ui/Atoms";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { confirmTransaction } from "@/utils/confirmTransaction";
import { WithdrawFeesDialogProps } from "@/views/coin/coin.types";
import { CHAN_TOKEN_DECIMALS, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { track } from "@vercel/analytics";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const WithdrawFeesPopUp = ({
  tokenSymbol,
  livePoolAddress,
  ticketsData: { tickets, refresh: refreshTickets },
  stakingPoolFromApi,
  closePopUp,
}: WithdrawFeesDialogProps) => {
  const [memeAmount, setMemeAmount] = useState<string | null>(null);
  const [chanAmount, setChanAmount] = useState<string | null>(null);
  const [slerfAmount, setSlerfAmount] = useState<string | null>(null);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { data: stakingPoolClient } = useStakingPoolClient(stakingPoolFromApi?.address);
  // console.log(tickets);
  const { data: tokenInfo } = useQuery({
    queryKey: ["staking-pool", stakingPoolFromApi?.address, !!stakingPoolClient?.getTokenInfo],
    queryFn: () => stakingPoolClient?.getTokenInfo(),
    enabled: !!stakingPoolClient?.getTokenInfo,
  });

  const updateAvailableFeesToWithdraw = useCallback(async () => {
    if (!stakingPoolClient || !tokenInfo) return;

    const ticketFields = tickets.map((ticket) => ticket.fields);

    // console.log("before", ticketFields);

    const { memeFees, quoteFees, chanFees } = (await stakingPoolClient.getAvailableWithdrawFeesAmount({
      tickets: ticketFields as any,
    })) as any;

    const formattedMemeFees = new BigNumber(memeFees).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);
    const formattedSlerfFees = new BigNumber(quoteFees).div(10 ** tokenInfo.decimals);
    const formattedChanFees = new BigNumber(chanFees).div(10 ** CHAN_TOKEN_DECIMALS);

    setMemeAmount(formattedMemeFees.toString());
    setSlerfAmount(formattedSlerfFees.toString());
    setChanAmount(formattedChanFees.toString());

    // if (formattedMemeFees.lt(LOW_FEES_THRESHOLD) || formattedSlerfFees.lt(LOW_FEES_THRESHOLD)) {
    //   console.log("ASIFJDASIOFJSAIOFJSAIOJFAIOS");
    //   setMemeAmount("0");
    //   setSlerfAmount("0");
    // } else {
    //   setMemeAmount(formattedMemeFees.toString());
    //   setSlerfAmount(formattedSlerfFees.toString());
    // }
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

      refreshTickets();

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
    refreshTickets,
    sendTransaction,
    connection,
  ]);

  // const updateFees = useCallback(async () => {
  //   if (!stakingPoolClient || !publicKey) return;

  //   try {
  //     setIsUpdateLoading(true);

  //     const addFeesTransaction = await stakingPoolClient.getAddFeesTransaction({
  //       ammPoolId: new PublicKey(livePoolAddress),
  //       payer: publicKey,
  //     });

  //     const signature = await sendTransaction(addFeesTransaction, connection, {
  //       maxRetries: 3,
  //       skipPreflight: true,
  //     });

  //     toast(() => <TransactionSentNotification signature={signature} />);

  //     // Check that an add fees succeeded
  //     const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
  //       await connection.getLatestBlockhash("confirmed");
  //     const txResult = await connection.confirmTransaction(
  //       {
  //         signature,
  //         blockhash,
  //         lastValidBlockHeight,
  //       },
  //       "confirmed",
  //     );

  //     if (txResult.value.err) {
  //       console.error("[WithdrawFeesDialog.updateFees] Failed to add fees:", JSON.stringify(txResult, null, 2));
  //       toast.error("Failed to update the available fees. Please, try again");
  //       return;
  //     }

  //     toast("Almost there...");
  //     await sleep(3000);
  //     updateAvailableFeesToWithdraw();

  //     toast.success("The available fees are successfully updated");
  //   } catch (e) {
  //     console.error("[WithdrawFeesDialog.updateFees] Failed to add fees:", e);
  //     toast.error("Failed to update the available fees. Please, try again");
  //     return;
  //   } finally {
  //     setIsUpdateLoading(false);
  //   }
  // }, [stakingPoolClient, publicKey, livePoolAddress, sendTransaction, updateAvailableFeesToWithdraw, connection]);

  const withdrawFeesButtonIsDisabled =
    memeAmount === null ||
    chanAmount === null ||
    slerfAmount === null ||
    isWithdrawLoading ||
    (new BigNumber(memeAmount).isZero() && new BigNumber(slerfAmount).isZero() && new BigNumber(chanAmount).isZero());

  const updateFeesButtonIsDisabled =
    memeAmount === null || slerfAmount === null || chanAmount === null || isUpdateLoading;

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between w-full">
          <Typography variant="h4" color="mono-600">
            Withdraw Fees
          </Typography>
          <FontAwesomeIcon icon={faXmark} color="#fff" className="sm:hover:cursor-pointer" onClick={closePopUp} />
        </div>
      </Card.Header>
      <Card.Body>
        <div>
          <Typography variant="body">Withdraw fees from the staking pool.</Typography>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-mono-500 mt-6">Available fees to withdraw</div>
          <div className="flex flex-col gap-2">
            <TextInput
              disabled
              value={
                memeAmount
                  ? Number(memeAmount).toLocaleString(undefined, {
                      maximumFractionDigits: MEMECHAN_MEME_TOKEN_DECIMALS,
                    }) +
                    " " +
                    tokenSymbol
                  : "loading..."
              }
              setValue={(e) => {
                setMemeAmount(e);
              }}
            />
            <TextInput
              disabled
              value={
                slerfAmount && tokenInfo
                  ? Number(slerfAmount).toLocaleString(undefined, {
                      maximumFractionDigits: tokenInfo.decimals,
                    }) +
                    " " +
                    tokenInfo.displayName
                  : "loading..."
              }
              setValue={(e) => {
                setSlerfAmount(e);
              }}
            />
            <TextInput
              disabled
              value={
                chanAmount && tokenInfo
                  ? Number(chanAmount).toLocaleString(undefined, {
                      maximumFractionDigits: CHAN_TOKEN_DECIMALS,
                    }) + " Chan"
                  : "loading..."
              }
              setValue={setChanAmount}
            />
          </div>
        </div>
        <Button
          disabled={withdrawFeesButtonIsDisabled || updateFeesButtonIsDisabled}
          onClick={withdrawFees}
          variant="primary"
          className="py-3 mt-5 w-full disabled:bg-opacity-50 disabled:cursor-not-allowed"
        >
          <Typography variant="h4" color="mono-600">
            {isWithdrawLoading ? "Loading..." : "Withdraw Fees"}
          </Typography>
        </Button>
      </Card.Body>
    </Card>
  );
};

{
  /* <DialogFooter className="flex-col"> */
}
{
  /* <Button
  disabled={updateFeesButtonIsDisabled || isWithdrawLoading}
  onClick={updateFees}
  className="w-full bg-regular bg-opacity-80 sm:hover:bg-opacity-50 disabled:bg-opacity-50 disabled:cursor-not-allowed"
>
  <div className="text-xs font-bold text-white">{isUpdateLoading ? "Loading..." : "Update Available Fees"}</div>
</Button> */
}
{
  /* </DialogFooter> */
}
