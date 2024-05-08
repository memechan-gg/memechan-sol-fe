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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UnstakeDialogProps } from "../../coin.types";
import { useWallet } from "@solana/wallet-adapter-react";

export const UnstakeStakingPoolDialog = ({ ticketBalance, tokenSymbol, stakingPool }: UnstakeDialogProps) => {
  const [ticketAmount, setTicketAmount] = useState("0.0");
  const {connected, publicKey} = useWallet();
  const [memeAmount, setMemeAmount] = useState("0.0");
  const [suiAmount, setSuiAmount] = useState("0.0");

  useEffect(() => {
    if (!connected) return;
    if (Number.isNaN(parseInt(ticketAmount)) || ticketAmount === "0.0") {
      setMemeAmount("0.0");
      setSuiAmount("0.0");
      return;
    }

    // stakingPool.getAvailableAmountToUnstake({
    //   owner: account.address,
    // }).then((res) => {
    //   setMemeAmount(res.availableMemeAmountToUnstake);
    //   setSuiAmount(res.suiAmount);
    // });
  }, [ticketAmount, publicKey]);

  async function onUnstake() {
    if (!connected || !publicKey) return;

    if (Number.isNaN(parseInt(ticketAmount)) || ticketAmount === "0.0") {
      toast.error("Invalid amount");
      return;
    }

    if (parseInt(ticketAmount) > parseInt(ticketBalance)) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      let tx = await stakingPool.getUnstakeTransaction({
        inputAmount: ticketAmount,
        signerAddress: publicKey.toBase58(),
      });

      /*await doTX({
        transactionBlock: tx.tx,
        requestType: "WaitForLocalExecution",
        options: {
          showBalanceChanges: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showInput: true,
        },
      });*/
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Unstake Tickets</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unstake Tickets</DialogTitle>
          <DialogDescription>
            Unstake your tickets from the staking pool. Tickets are equal to Memecoin 1:1
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs font-bold text-regular">{tokenSymbol} Ticket</div>
          <input
            className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
            value={ticketAmount}
            onChange={(e) => setTicketAmount(e.target.value)}
            type="number"
          />
          <div className="text-xs font-bold text-regular">
            Available: {ticketBalance} {tokenSymbol} Ticket
          </div>
          <div className="text-xs font-bold text-regular mt-6">Outputs</div>
          <div className="flex flex-row gap-2">
            {/* Show amounts of removed */}
            <input
              disabled
              className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
              value={memeAmount + " " + tokenSymbol}
            />
            <input
              disabled
              className="w-full bg-white text-xs font-bold text-regular p-2 rounded-lg"
              value={suiAmount + " SUI"}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onUnstake} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
            <div className="text-xs font-bold text-white">Unstake</div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
