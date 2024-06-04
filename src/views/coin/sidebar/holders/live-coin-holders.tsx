import { useLivePool } from "@/hooks/live/useLivePool";
import { useWallet } from "@solana/wallet-adapter-react";
import { LiveCoinHoldersProps } from "../../coin.types";
import { getSlicedAddress } from "./utils";

export const LiveCoinHolders = ({ coinMetadata, uniqueHoldersData }: LiveCoinHoldersProps) => {
  const { publicKey } = useWallet();
  const { livePool } = useLivePool(coinMetadata.address);

  const userHoldings = uniqueHoldersData?.holders.find(({ address }) => publicKey?.toString() === address);
  const userPercentage = userHoldings?.tokenAmountInPercentage.toFixed(2);
  const userSlicedAddress = publicKey ? getSlicedAddress(publicKey) : null;
  const userIsDev = coinMetadata.creator === publicKey?.toString();

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {userHoldings && (
          <div className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal">{userSlicedAddress}</span> (me) {userIsDev ? "(dev)" : ""}
            </div>
            <div>{userPercentage}%</div>
          </div>
        )}
        {uniqueHoldersData &&
          uniqueHoldersData.holders.length > 0 &&
          uniqueHoldersData.holders.map(({ address, tokenAmountInPercentage }) => {
            const holderIsUser = publicKey?.toString() === address;

            if (holderIsUser) return;

            const percentage = tokenAmountInPercentage.toFixed(2);
            const slicedAddress = getSlicedAddress(address);
            const holderIsDev = coinMetadata.creator === address;
            const holderIsRaydiumLiquidity = livePool?.authority === address;

            return (
              <div key={address} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
                <div>
                  <span className="font-normal">{slicedAddress}</span>{" "}
                  {holderIsDev ? "(dev)" : holderIsRaydiumLiquidity ? "(raydium liquidity)" : ""}
                </div>
                <div>{percentage}%</div>
              </div>
            );
          })}
        {uniqueHoldersData && uniqueHoldersData.holders.length === 0 && (
          <div className="font-normal text-regular">No holders yet.</div>
        )}
        {!uniqueHoldersData && <div className="font-normal text-regular">Loading...</div>}
      </div>
    </div>
  );
};
