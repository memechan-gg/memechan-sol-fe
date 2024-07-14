import { formatNumber } from "@/utils/formatNumber";
import BigNumber from "bignumber.js";

type CoinItemProps = { image: string; name: string; marketCap: number };

export const CoinItem = ({ image, name, marketCap }: CoinItemProps) => {
  // TODO: check
  const mc = new BigNumber(marketCap).div(10 ** 8).toNumber();
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex flex-row gap-2 items-center">
        <img className="w-[75px] border border-regular h-auto rounded-lg" src={image} alt="Coin Image" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xs">Name: {name}</div>
        <div className="text-xs">Market Cap: ${formatNumber(mc, 2)}</div>
      </div>
    </div>
  );
};
