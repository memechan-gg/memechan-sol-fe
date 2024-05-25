import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import BigNumber from "bignumber.js";
import { UnavailableTicketsToSellDialogParams } from "../../coin.types";

export const UnavailableTicketsToSellDialog = ({
  unavailableTickets,
  symbol,
}: UnavailableTicketsToSellDialogParams) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Staked Tickets</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Staked Tickets</DialogTitle>
          <DialogDescription>Here are your staked tickets</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {unavailableTickets.map((ticket, index) => {
            const memeTicketLink = `https://explorer.solana.com/address/${ticket.id.toString()}?cluster=devnet`;
            const unlockTimestampInMs = new BigNumber(ticket.jsonFields.untilTimestamp).multipliedBy(1000).toNumber();

            return (
              <div key={index} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <a target="_blank" href={memeTicketLink}>
                  <span className="hover:underline font-bold">
                    {index + 1}. {ticket.id.toString().slice(0, 5)}...{ticket.id.toString().slice(-3)}
                  </span>
                </a>
                <div>
                  <span className="font-normal">
                    {ticket.amountWithDecimals} {symbol}
                  </span>
                </div>
                <div>
                  <span className="font-normal">
                    Unlocks at: {new Date(unlockTimestampInMs).toLocaleDateString()}{" "}
                    {new Date(unlockTimestampInMs).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
