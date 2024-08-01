import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { useWallet } from "@solana/wallet-adapter-react";
import { LiveCoinHoldersProps } from "../../coin.types";
import { getSlicedAddress } from "./utils";

export const LiveCoinHolders = ({ coinMetadata, uniqueHoldersData, livePool }: LiveCoinHoldersProps) => {
  const { publicKey } = useWallet();

  const userHoldings = uniqueHoldersData?.holders.find(({ address }) => publicKey?.toString() === address);
  const userPercentage = userHoldings?.tokenAmountInPercentage.toFixed(2);
  const userSlicedAddress = publicKey ? getSlicedAddress(publicKey) : null;
  const userIsDev = coinMetadata.creator === publicKey?.toString();
  return (
    <div className="flex flex-col gap-1">
      <Card additionalStyles="hover:border-primary-100">
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
                <div key={address} className="flex justify-between flex-row mt-1">
                  <div>
                    <a target="_blank" href={`https://solana.fm/address/${address}`}>
                      <Typography underline variant="text-button" color="mono-500">
                        {slicedAddress}
                        {holderIsDev ? " (dev)" : holderIsRaydiumLiquidity ? " (raydium liquidity)" : ""}
                      </Typography>
                    </a>
                  </div>
                  <Typography color={holderIsDev ? "yellow-100" : "mono-600"}>{percentage}%</Typography>
                </div>
              );
            })}
          {uniqueHoldersData && uniqueHoldersData.holders.length === 0 && <Typography>No holders yet.</Typography>}
          {!uniqueHoldersData && <Typography variant="h4">Loading...</Typography>}
        </Card.Body>
      </Card>
    </div>
  );
};
