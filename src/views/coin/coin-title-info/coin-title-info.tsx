import { useLiveCoinUniqueHoldersFromBE } from "@/hooks/live/useLiveCoinUniqueHoldersFromBE";
import { usePresaleCoinUniqueHoldersFromBE } from "@/hooks/presale/usePresaleCoinUniqueHoldersFromBE";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { formatNumber } from "@/utils/formatNumber";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

type CoinTitleInfoProps = {
  coinMetadata: SolanaToken;
  price: ReturnType<typeof useMemePriceFromBE>;
  uniqueHoldersData: ReturnType<typeof usePresaleCoinUniqueHoldersFromBE | typeof useLiveCoinUniqueHoldersFromBE>;
};

export const CoinTitleInfo = ({ coinMetadata, price, uniqueHoldersData }: CoinTitleInfoProps) => {
  return (
    <div className="lg:flex lg:max-xl:justify-between gap-y-4 gap-x-10 grid md:max-lg:grid-cols-4 sm:grid-cols-3 xxs:grid-cols-2 grid-cols-1 text-center">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold text-regular">Token Name</div>
        <div className="text-xs font-bold text-regular">{coinMetadata.name}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold text-regular">Token Ticker</div>
        <div className="text-xs font-bold text-regular">{coinMetadata.symbol}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold text-regular">Market Cap</div>
        <div className="text-xs font-bold text-regular">${formatNumber(coinMetadata.marketcap, 2)}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold !normal-case text-regular">USD price</div>
        <div className="text-xs font-bold !normal-case text-regular">
          {price ? `$${(+price).toFixed(10)}` : <Skeleton />}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold text-regular">Unique holders</div>
        <div className="text-xs font-bold text-regular">
          {uniqueHoldersData ? uniqueHoldersData.fullHolders.length : <Skeleton />}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold text-link">Address</div>
        <a
          href={`https://solscan.io/token/${coinMetadata.address}`}
          className="text-xs font-bold text-link"
          target="_blank"
        >
          {coinMetadata.address.slice(0, 5)}...
          {coinMetadata.address.slice(-3)}
        </a>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold text-link">Created By</div>
        <Link href={`/profile/${coinMetadata.creator}`} className="text-xs font-bold text-link">
          {coinMetadata.creator.slice(0, 5)}...
          {coinMetadata.creator.slice(-3)}
        </Link>
      </div>
    </div>
  );
};
