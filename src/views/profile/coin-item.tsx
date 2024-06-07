import { formatNumber } from "@/utils/formatNumber";
import Link from "next/link";
import { Token } from ".";

type CoinItemProps = { token: Token };

export const CoinItem = ({ token: { image, marketCap, mint, name } }: CoinItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[150px]">
        <h2 className="text-sm font-bold text-regular truncate">{name}</h2>
      </div>
      <Link href={`/coin/${mint}`} target="_blank">
        <img
          className="w-[150px] border border-regular h-[150px] object-cover object-center"
          src={image}
          alt="Coin Image"
        />
      </Link>
      <div className="flex flex-col gap-1 text-xs">
        <div>market cap: ${formatNumber(marketCap, 2)}</div>
      </div>
    </div>
  );
};
