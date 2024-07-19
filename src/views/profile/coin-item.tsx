import { useLiveMemePrice } from "@/hooks/live/useLiveMemePrice";
import { useLivePool } from "@/hooks/live/useLivePool";
import { formatNumber } from "@/utils/formatNumber";
import Skeleton from "react-loading-skeleton";

type CoinItemProps = { image: string; name: string; marketCap: number; mint: string };

export const CoinItem = ({ image, name, marketCap, mint }: CoinItemProps) => {
  const livePool = useLivePool(mint);

  const { data: prices, isLoading } = useLiveMemePrice(livePool.livePool?.id, !!livePool);

  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex flex-row gap-2 items-center">
        <img className="w-[75px] border border-regular h-auto rounded-lg" src={image} alt="Coin Image" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xs">Name: {name}</div>
        {livePool.isLoading || isLoading ? (
          <Skeleton />
        ) : (
          <div className="text-xs">
            Market Cap: ${formatNumber(prices ? +prices.priceInUsd * 1_000_000_000 : marketCap, 2)}
          </div>
        )}
      </div>
    </div>
  );
};
