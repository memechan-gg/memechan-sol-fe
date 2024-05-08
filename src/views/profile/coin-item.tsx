type CoinItemProps = { image: string; name: string; marketCap: string };

export const CoinItem = ({ image, name, marketCap }: CoinItemProps) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex flex-row gap-2 items-center">
        <img className="w-[75px] border border-regular h-auto rounded-lg" src={image} alt="Coin Image" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xs">Name: {name}</div>
        <div className="text-xs">Marketcap: {marketCap}</div>
      </div>
    </div>
  );
};
