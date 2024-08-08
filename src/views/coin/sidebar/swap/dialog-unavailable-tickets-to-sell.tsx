import { Button } from "@/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dialog";
import { formatNumber } from "@/utils/formatNumber";
import { MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { UnavailableTicketsToSellDialogParams } from "../../coin.types";

export const UnavailableTicketsToSellDialog = ({
  unavailableTickets,
  symbol,
}: UnavailableTicketsToSellDialogParams) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 sm:hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Locked Tickets</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40vw]">
        <DialogHeader>
          <DialogTitle className="text-regular mb-4">Locked Tickets</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {unavailableTickets.map((ticket, index) => {
            const memeTicketLink = `https://explorer.solana.com/address/${ticket.id.toString()}`;
            const unlockTimestampInMs = new BigNumber(ticket.jsonFields.untilTimestamp).multipliedBy(1000).toNumber();

            return (
              <div key={index} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <a target="_blank" href={memeTicketLink}>
                  <span className="sm:hover:underline font-bold">
                    {index + 1}. {ticket.id.toString().slice(0, 5)}...{ticket.id.toString().slice(-3)}
                  </span>
                </a>
                <div>
                  <span className="font-normal">
                    {formatNumber(+ticket.amountWithDecimals, MEMECHAN_MEME_TOKEN_DECIMALS)} {symbol}
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
