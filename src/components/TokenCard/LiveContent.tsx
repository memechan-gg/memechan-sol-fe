import { parseChainValue } from "@/utils/parseChainValue";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
interface Props {
  token: SolanaToken;
}
export const LiveContent = ({ token }: Props) => {
  const { marketcap, holdersCount } = token;

  return (
    <div className="pt-2 p-4 flex justify-between text-sm text-white mt-2">
      <div className=" mr-4 flex gap-1 flex-col items-start text-xs-custom text-mono-500">
        <span>Market Cap</span>
        <span className="text-white font-bold">${parseChainValue(marketcap, 0, 2)}</span>
      </div>
      <div className="flex gap-1 flex-col items-start text-xs-custom text-mono-500">
        <span>Holders</span>
        <span className="text-white font-bold">{holdersCount}</span>
      </div>
      {/* <div className="flex gap-1 flex-col items-start text-xs-custom text-gradient-gold">
            <span>Gen. Fees</span>
            <span className="font-bold">$123</span>
          </div>
          <div className="flex gap-1 flex-col items-start text-xs-custom text-mono-500">
            <span>24h Volume</span>
            <span className="text-white font-bold">$456</span>
          </div> */}
    </div>
  );
};
