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
import { MEMECHAN_MEME_TOKEN_DECIMALS, MEMECHAN_QUOTE_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WithdrawFeesDialogProps } from "../../coin.types";

export const WithdrawFeesDialog = ({ tokenSymbol, livePoolAddress, memeMint }: WithdrawFeesDialogProps) => {
  const [memeAmount, setMemeAmount] = useState<string | null>(null);
  const [slerfAmount, setSlerfAmount] = useState<string | null>(null);

  const { publicKey, sendTransaction } = useWallet();
  const { seedPool } = useSeedPool(memeMint);
  const stakingPoolFromApi = useStakingPoolFromApi(memeMint);
  const stakingPoolClient = useStakingPoolClient(stakingPoolFromApi?.address);
  const { tickets } = useTickets(seedPool?.address);

  const updateAvailableFeesToWithdraw = useCallback(async () => {
    if (!stakingPoolClient) return;

    const ticketFields = tickets.map((ticket) => ticket.fields);

    const { memeFees, slerfFees } = await stakingPoolClient.getAvailableWithdrawFeesAmount({ tickets: ticketFields });

    const formattedMemeFees = new BigNumber(memeFees).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();
    const formattedSlerfFees = new BigNumber(slerfFees).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();

    setMemeAmount(formattedMemeFees);
    setSlerfAmount(formattedSlerfFees);
  }, [stakingPoolClient, tickets]);

  useEffect(() => {
    updateAvailableFeesToWithdraw();
  }, [updateAvailableFeesToWithdraw]);

  const withdrawFees = useCallback(async () => {
    if (!publicKey || !stakingPoolClient) return;

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
        console.error("[WithdrawFeesDialog.withdrawFees] Withdraw fees failed:", JSON.stringify(swapTxResult, null, 2));
        toast.error("Fees withdrawal failed. Please, try again");
        return;
      }
    }

    toast.success("Fees are successfully withdrawn");
  }, [sendTransaction, publicKey, stakingPoolClient, tickets, livePoolAddress]);

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
              value={slerfAmount + " SLERF"}
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
