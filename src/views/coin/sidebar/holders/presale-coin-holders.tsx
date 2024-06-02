import { usePresaleCoinUniqueHolders } from "@/hooks/presale/usePresaleCoinUniqueHolders";
import { useWallet } from "@solana/wallet-adapter-react";
import { HoldersProps } from "../../coin.types";
import { getBondingCurvePercentage, getSlicedAddress } from "./utils";

export const PresaleCoinHolders = ({ poolAddress, coinMetadata }: HoldersProps) => {
  const { publicKey } = useWallet();
  const { holders, map } = usePresaleCoinUniqueHolders(poolAddress);

  const bondingCurveSlicedAddress = getSlicedAddress(poolAddress);
  const bondingCurvePercentage = map ? getBondingCurvePercentage(map) : null;

  const userHoldings = holders?.find(({ address }) => publicKey?.toString() === address);
  const userPercentage = userHoldings?.tokenAmountInPercentage.toFixed(2);
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
        {holders && (
          <div key="bonding-curve" className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal">{bondingCurveSlicedAddress}</span> (bonding curve)
            </div>
            <div>{bondingCurvePercentage}%</div>
          </div>
        )}
        {holders &&
          holders.length > 0 &&
          holders.map(({ address, tokenAmountInPercentage }) => {
            const holderIsUser = publicKey?.toString() === address;

            if (holderIsUser) return;

            const percentage = tokenAmountInPercentage.toFixed(2);
            const slicedAddress = getSlicedAddress(address);
            const holderIsDev = coinMetadata.creator === address;

            return (
              <div key={slicedAddress} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal">{slicedAddress}</span> {holderIsDev ? "(dev)" : ""}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
        {!holders && <div className="font-normal text-regular">Loading...</div>}
      </div>
    </div>
  );
};
