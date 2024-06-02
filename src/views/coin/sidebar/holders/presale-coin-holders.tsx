import { usePresaleCoinUniqueHolders } from "@/hooks/presale/usePresaleCoinUniqueHolders";
import { useWallet } from "@solana/wallet-adapter-react";
import { HoldersProps } from "../../coin.types";
import { getBondingCurvePercentage, getBoundPoolHolderPercentage, getSlicedAddress } from "./utils";

export const PresaleCoinHolders = ({ poolAddress, coinMetadata }: HoldersProps) => {
  const { publicKey } = useWallet();
  const uniqueHolders = usePresaleCoinUniqueHolders(poolAddress);

  const bondingCurveSlicedAddress = poolAddress.slice(0, 6) + "..." + poolAddress.slice(-4);
  const bondingCurvePercentage = uniqueHolders ? getBondingCurvePercentage(uniqueHolders) : null;

  const userHoldings = publicKey ? uniqueHolders?.get(publicKey?.toString()) : null;
  const userPercentage = userHoldings ? getBoundPoolHolderPercentage(userHoldings) : null;
  const userSlicedAddress = publicKey ? getSlicedAddress(publicKey) : null;

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {userHoldings && (
          <div className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal">{userSlicedAddress}</span> (me)
            </div>
            <div>{userPercentage}%</div>
          </div>
        )}
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
            const holderIsUser = publicKey?.toString() === holder;

            if (holderIsUser) return;

            const percentage = getBoundPoolHolderPercentage(tickets);
            const slicedAddress = getSlicedAddress(holder);
            const holderIsDev = coinMetadata.creator === holder;

            return (
              <div key={slicedAddress} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal">{slicedAddress}</span> {holderIsDev ? "(dev)" : ""}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
        {!uniqueHolders && <div className="font-normal text-regular">Loading...</div>}
      </div>
    </div>
  );
};
