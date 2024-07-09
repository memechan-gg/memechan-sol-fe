import Skeleton from "react-loading-skeleton";

type CoinItemProps = { image: string; name: string; marketCap: string; tokenAmount: number; usdValue?: number };

export const CoinItem = ({ image, name, marketCap, tokenAmount, usdValue }: CoinItemProps) => {
  console.log(tokenAmount);
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex flex-row gap-2 items-center">
        <img className="w-[75px] border border-regular h-auto rounded-lg" src={image} alt="Coin Image" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-xs">Name: {name}</div>
        <div className="text-xs">Marketcap: ${marketCap}</div>
        <div className="text-xs">Token amount: {tokenAmount}</div>
        <div className="text-xs ">USD token value: {usdValue ? `$${(+usdValue).toFixed(2)}` : <Skeleton />}</div>
      </div>
    </div>
  );
};
