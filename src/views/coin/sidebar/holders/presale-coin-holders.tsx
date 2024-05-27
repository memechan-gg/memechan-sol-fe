import { usePresaleCoinUniqueHolders } from "@/hooks/presale/usePresaleCoinUniqueHolders";
import { FULL_MEME_AMOUNT_CONVERTED, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { HoldersProps } from "../../coin.types";

export const PresaleCoinHolders = ({ poolAddress, coinMetadata }: HoldersProps) => {
  const uniqueHolders = usePresaleCoinUniqueHolders(poolAddress);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {uniqueHolders &&
          uniqueHolders.size > 0 &&
          Array.from(uniqueHolders.entries()).map(([holder, tickets]) => {
            const ticketsMemeAmount = tickets
              .reduce((sum, ticket) => sum.plus(ticket.amount.toString()), new BigNumber(0))
              .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);

            const percentage = ticketsMemeAmount.div(FULL_MEME_AMOUNT_CONVERTED).multipliedBy(100).toFixed(2);
            const address = holder.slice(0, 6) + "..." + holder.slice(-4);
            const holderIsDev = coinMetadata.creator === holder;

            return (
              <div key={address} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal">{address}</span> {holderIsDev ? "(dev)" : ""}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
        {uniqueHolders && uniqueHolders.size === 0 && <div className="font-normal text-regular">No holders yet.</div>}
        {!uniqueHolders && <div className="font-normal text-regular">Loading...</div>}
      </div>
    </div>
  );
};
