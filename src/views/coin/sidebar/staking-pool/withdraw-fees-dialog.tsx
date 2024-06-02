import { connection } from "@/common/solana";
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
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useTickets } from "@/hooks/useTickets";
import { MEMECHAN_MEME_TOKEN_DECIMALS, MEMECHAN_QUOTE_TOKEN_DECIMALS, sleep } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WithdrawFeesDialogProps } from "../../coin.types";
import { LOW_FEES_THRESHOLD } from "./config";

export const WithdrawFeesDialog = ({ tokenSymbol, livePoolAddress, memeMint }: WithdrawFeesDialogProps) => {
  const [memeAmount, setMemeAmount] = useState<string | null>(null);
  const [slerfAmount, setSlerfAmount] = useState<string | null>(null);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);

  const { publicKey, sendTransaction } = useWallet();
  const { seedPool } = useSeedPool(memeMint);
  const stakingPoolFromApi = useStakingPoolFromApi(memeMint);
  const stakingPoolClient = useStakingPoolClient(stakingPoolFromApi?.address);
  const { tickets } = useTickets(seedPool?.address);

  const updateAvailableFeesToWithdraw = useCallback(async () => {
    if (!stakingPoolClient) return;

    const ticketFields = tickets.map((ticket) => ticket.fields);

    const { memeFees, slerfFees } = await stakingPoolClient.getAvailableWithdrawFeesAmount({ tickets: ticketFields });

    const formattedMemeFees = new BigNumber(memeFees).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);
    const formattedSlerfFees = new BigNumber(slerfFees).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS);

    if (formattedMemeFees.lt(LOW_FEES_THRESHOLD) || formattedSlerfFees.lt(LOW_FEES_THRESHOLD)) {
      setMemeAmount("0");
      setSlerfAmount("0");
    } else {
      setMemeAmount(formattedMemeFees.toString());
      setSlerfAmount(formattedSlerfFees.toString());
    }
  }, [stakingPoolClient, tickets]);

  useEffect(() => {
    updateAvailableFeesToWithdraw();
  }, [updateAvailableFeesToWithdraw]);

  const withdrawFees = useCallback(async () => {
    if (!publicKey || !stakingPoolClient) return;

    try {
      setIsWithdrawLoading(true);

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

        // Check that a part of the withdraw fees succeeded
        const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
          await connection.getLatestBlockhash("confirmed");
        const swapTxResult = await connection.confirmTransaction(
          {
            signature: signature,
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
          },
          "confirmed",
        );

        if (swapTxResult.value.err) {
          console.error(
            "[WithdrawFeesDialog.withdrawFees] Withdraw fees failed:",
            JSON.stringify(swapTxResult, null, 2),
          );
          toast.error("Fees withdrawal failed. Please, try again");
          return;
        }
      }

      setMemeAmount("0");
      setSlerfAmount("0");

      toast.success("Fees are successfully withdrawn");
    } catch (e) {
      console.error("[WithdrawFeesDialog.withdrawFees] Error while withdrawing:", e);
      toast.error("Failed to withdraw the available fees. Please, try again");
    } finally {
      setIsWithdrawLoading(false);
    }
  }, [sendTransaction, publicKey, stakingPoolClient, tickets, livePoolAddress]);

  const updateFees = useCallback(async () => {
    if (!stakingPoolClient || !publicKey) return;

    try {
      setIsUpdateLoading(true);

      const addFeesTransaction = await stakingPoolClient.getAddFeesTransaction({
        ammPoolId: new PublicKey(livePoolAddress),
        payer: publicKey,
      });

      const signature = await sendTransaction(addFeesTransaction, connection, {
        maxRetries: 3,
        skipPreflight: true,
      });

      // Check that an add fees succeeded
      const { blockhash: blockhash, lastValidBlockHeight: lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      const txResult = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed",
      );

      if (txResult.value.err) {
        console.error("[WithdrawFeesDialog.updateFees] Failed to add fees:", JSON.stringify(txResult, null, 2));
        toast.error("Failed to update the available fees. Please, try again");
        return;
      }

      toast("Almost there...");
      await sleep(3000);
      updateAvailableFeesToWithdraw();

      toast.success("The available fees are successfully updated");
    } catch (e) {
      console.error("[WithdrawFeesDialog.updateFees] Failed to add fees:", e);
      toast.error("Failed to update the available fees. Please, try again");
      return;
    } finally {
      setIsUpdateLoading(false);
    }
  }, [stakingPoolClient, publicKey, livePoolAddress, sendTransaction, updateAvailableFeesToWithdraw]);

  const withdrawFeesButtonIsDisabled =
    memeAmount === null ||
    slerfAmount === null ||
    isWithdrawLoading ||
    (new BigNumber(memeAmount).isZero() && new BigNumber(slerfAmount).isZero());

  const updateFeesButtonIsDisabled = memeAmount === null || slerfAmount === null || isUpdateLoading;

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Withdraw Fees</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-regular mb-2">Withdraw Fees</DialogTitle>
          <DialogDescription className="text-regular">Withdraw fees from the staking pool.</DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-regular mt-6">Available fees to withdraw</div>
          <div className="flex flex-row gap-2">
            {/* Show amounts of removed */}
            <input
              disabled
              className="w-full bg-white !normal-case text-xs font-bold text-regular p-2 rounded-lg"
              value={memeAmount ? memeAmount + " " + tokenSymbol : "loading..."}
            />
            <input
              disabled
              className="w-full bg-white !normal-case text-xs font-bold text-regular p-2 rounded-lg"
              value={slerfAmount ? slerfAmount + " SLERF" : "loading..."}
            />
          </div>
        </div>
        <DialogFooter className="flex-col">
          <Button
            disabled={withdrawFeesButtonIsDisabled || updateFeesButtonIsDisabled}
            onClick={withdrawFees}
            className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-xs font-bold text-white">{isWithdrawLoading ? "Loading..." : "Withdraw Fees"}</div>
          </Button>
          <Button
            disabled={updateFeesButtonIsDisabled || isWithdrawLoading}
            onClick={updateFees}
            className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-xs font-bold text-white">
              {isUpdateLoading ? "Loading..." : "Update Available Fees"}
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
