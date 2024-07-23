import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { ConvertedHolderItem } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { HoldersProps } from "../../coin.types";
import { getSlicedAddress } from "./utils";

interface HolderProps {
  holders: ConvertedHolderItem[];
  publicKey?: PublicKey;
  poolAddress: string;
  creator: string;
}

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
    <Card>
      <Card.Header>
        <Typography variant="h4" color="mono-600">
          Holders
        </Typography>
      </Card.Header>
      <Card.Body>
        {userHoldings && (
          <div className="flex justify-between flex-row gap-2 mt-1">
            <div>
              <a target="_blank" href={`https://solana.fm/address/${publicKey?.toString()}`}>
                <Typography underline variant="text-button" color="mono-500">
                  {userSlicedAddress}
                  (me) {userIsDev ? " (dev)" : ""}
                </Typography>
              </a>
            </div>
            <Typography color={userIsDev ? "yellow-100" : "mono-600"}>{userPercentage}%</Typography>
          </div>
        )}

        {bondingCurvePercentage && (
          <div className="flex justify-between flex-row gap-2 mt-1">
            <div>
              <a target="_blank" href={`https://solana.fm/address/${poolAddress}`}>
                <Typography underline variant="text-button" color="mono-500">
                  {bondingCurveSlicedAddress} (bonding curve)
                </Typography>
              </a>
            </div>
            <Typography color={userIsDev ? "yellow-100" : "mono-600"}>{bondingCurvePercentage}%</Typography>
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
              <div key={slicedAddress} className="flex justify-between flex-row mt-1">
                <div>
                  <a target="_blank" href={`https://solana.fm/address/${owner.toString()}`}>
                    <Typography underline variant="text-button" color="mono-500">
                      {slicedAddress}
                      {holderIsDev ? "(dev)" : ""}
                    </Typography>
                  </a>
                </div>
                <Typography color={holderIsDev ? "yellow-100" : "mono-600"}>{percentage}%</Typography>
              </div>
            );
          })}
        {holders.length === 0 && <Typography>No holders yet.</Typography>}
      </Card.Body>
    </Card>
  );
};
