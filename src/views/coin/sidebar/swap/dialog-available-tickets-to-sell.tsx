import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { AvailableTicketToSellDialogParams } from "../../coin.types";

export const AvailableTicketsToSellDialog = ({ availableTickets, symbol }: AvailableTicketToSellDialogParams) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Staked Tickets</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Staked Tickets</DialogTitle>
          <DialogDescription>Here are your staked tickets</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {availableTickets.map((ticket, index) => (
            <div key={index} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
              <a target="_blank" href={`https://suivision.xyz/object/${ticket.objectId}`}>
                <span className="hover:underline font-bold">
                  {index + 1}. {ticket.objectId.slice(0, 5)}...{ticket.objectId.slice(-3)}
                </span>
              </a>
              <div>
                <span className="font-normal">
                  {ticket.balanceWithDecimals} {symbol}
                </span>
              </div>
              <div>
                <span className="font-normal">
                  Opens in:
                  {new Date(ticket.untilTimestamp).toLocaleDateString()}{" "}
                  {new Date(ticket.untilTimestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
