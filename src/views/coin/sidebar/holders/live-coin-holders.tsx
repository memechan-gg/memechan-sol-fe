import { useLiveCoinUniqueHolders } from "@/hooks/live/useLiveCoinUniqueHolders";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { LiveCoinHoldersProps } from "../../coin.types";

export const LiveCoinHolders = ({ coinMetadata }: LiveCoinHoldersProps) => {
  const seedPool = useSeedPool(coinMetadata.address);
  const uniqueHoldersData = useLiveCoinUniqueHolders(coinMetadata.address, seedPool?.address);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {uniqueHoldersData &&
          uniqueHoldersData.holders.length > 0 &&
          uniqueHoldersData.holders.map(({ address, tokenAmountInPercentage }) => {
            const percentage = tokenAmountInPercentage.toFixed(2);
            const slicedAddress = address.slice(0, 6) + "..." + address.slice(-4);
            const holderIsDev = coinMetadata.creator === address;

            return (
              <div key={address} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal">{slicedAddress}</span> {holderIsDev ? "(dev)" : ""}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
        {uniqueHoldersData && uniqueHoldersData.holders.length === 0 && (
          <div className="font-normal">No holders yet.</div>
        )}
        {!uniqueHoldersData && <div className="font-normal">Loading...</div>}
      </div>
    </div>
  );
};
