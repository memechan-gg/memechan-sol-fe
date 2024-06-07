import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { HoldersProps } from "../../coin.types";
import { getSlicedAddress } from "./utils";

export const PresaleCoinHolders = ({ poolAddress, coinMetadata, uniqueHoldersData }: HoldersProps) => {
  const { publicKey } = useWallet();

  if (!uniqueHoldersData) {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-xs font-bold text-regular">Holders</div>
        <div className="flex flex-col gap-1">{<div className="font-normal text-regular">Loading...</div>}</div>
      </div>
    );
  }

  const { holders } = uniqueHoldersData;

  const bondingCurveSlicedAddress = getSlicedAddress(poolAddress);
  const bondingCurvePercentage = holders.find(({ owner }) => owner.toString() === poolAddress)?.percetange.toFixed(2);

  const userHoldings = holders.find(({ owner }) => publicKey?.equals(owner));
  const userPercentage = userHoldings?.percetange.toFixed(2);
  const userSlicedAddress = publicKey ? getSlicedAddress(publicKey) : null;
  const userIsDev = coinMetadata.creator === publicKey?.toString();

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {userHoldings && (
          <div className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal hover:underline cursor-pointer">
                <a target="_blank" href={`https://solana.fm/address/${publicKey?.toString()}`}>
                  {userSlicedAddress}
                </a>
              </span>{" "}
              (me) {userIsDev ? "(dev)" : ""}
            </div>
            <div>{userPercentage}%</div>
          </div>
        )}
        {bondingCurvePercentage && (
          <div key="bonding-curve" className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal hover:underline cursor-pointer">
                <a target="_blank" href={`https://solana.fm/address/${poolAddress}`}>
                  {bondingCurveSlicedAddress}
                </a>
              </span>{" "}
              (bonding curve)
            </div>
            <div>{bondingCurvePercentage}%</div>
          </div>
        )}
        {holders.length > 0 &&
          holders.map(({ owner, percetange }) => {
            const holderIsUser = publicKey?.equals(owner);
            const holderIsBondingCurve = owner?.equals(new PublicKey(poolAddress));

            if (holderIsUser || holderIsBondingCurve) return;

            const percentage = percetange.toFixed(2);
            const slicedAddress = getSlicedAddress(owner.toString());
            const holderIsDev = coinMetadata.creator === owner.toString();

            return (
              <div key={slicedAddress} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal hover:underline cursor-pointer">
                    <a target="_blank" href={`https://solana.fm/address/${owner.toString()}`}>
                      {slicedAddress}
                    </a>
                  </span>{" "}
                  {holderIsDev ? "(dev)" : ""}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
        {holders.length === 0 && <div className="font-normal text-regular">No holders yet.</div>}
      </div>
    </div>
  );
};
