import { usePresaleCoinUniqueHolders } from "@/hooks/presale/usePresaleCoinUniqueHolders";
import { MAX_TICKET_TOKENS, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { HoldersProps } from "../../coin.types";
import { getBondingCurvePercentage } from "./utils";

export const PresaleCoinHolders = ({ poolAddress, coinMetadata }: HoldersProps) => {
  const uniqueHolders = usePresaleCoinUniqueHolders(poolAddress);

  const bondingCurveSlicedAddress = poolAddress.slice(0, 6) + "..." + poolAddress.slice(-4);
  const bondingCurvePercentage = uniqueHolders ? getBondingCurvePercentage(uniqueHolders) : null;

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {uniqueHolders && (
          <div key="bonding-curve" className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal">{bondingCurveSlicedAddress}</span> (bonding curve)
            </div>
            <div>{bondingCurvePercentage}%</div>
          </div>
        )}
        {uniqueHolders &&
          uniqueHolders.size > 0 &&
          Array.from(uniqueHolders.entries()).map(([holder, tickets]) => {
            const ticketsMemeAmount = tickets
              .reduce((sum, ticket) => sum.plus(ticket.amount.toString()), new BigNumber(0))
              .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);

            const percentage = ticketsMemeAmount.div(MAX_TICKET_TOKENS).multipliedBy(100).toFixed(2);
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
        {/* {uniqueHolders && uniqueHolders.size === 0 && <div className="font-normal text-regular">No holders yet.</div>} */}
        {!uniqueHolders && <div className="font-normal text-regular">Loading...</div>}
      </div>
    </div>
  );
};
