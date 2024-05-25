import { useUniqueHolders } from "@/hooks/solana/useUniqueHolders";
import { FULL_MEME_AMOUNT_CONVERTED, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { HoldersProps } from "../coin.types";

export const Holders = ({ poolAddress, coinMetadata }: HoldersProps) => {
  const uniqueHolders = useUniqueHolders(poolAddress);

  const renderHolderType = (type: "bonding_curve" | "dev" | string | undefined) => {
    switch (type) {
      case "bonding_curve":
        return "(bonding curve)";
      case "dev":
        return "(dev)";
      default:
        return "";
    }
  };

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
            const type = coinMetadata.creator === holder ? "dev" : undefined;

            return (
              <div key={address} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal">{address}</span> {renderHolderType(type)}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
