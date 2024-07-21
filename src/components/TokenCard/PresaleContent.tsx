import { parseChainValue } from "@/utils/parseChainValue";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
interface Props {
  token: SolanaToken;
}
export const PresaleContent = ({ token }: Props) => {
  const { name, address, image, marketcap, description, holdersCount } = token;
  return (
    <>
      <div className=" pt-2 p-4  flex flex-row text-sm text-white mt-2">
        <div className=" mr-4 flex gap-1 flex-col items-start text-xs-custom text-mono-500">
          <span>Market Cap</span>
          <span className="text-white font-bold">${parseChainValue(marketcap, 0, 2)}</span>
        </div>
        <div className="flex gap-1 flex-col items-start text-xs-custom text-mono-500">
          <span>Holders</span>
          <span className="text-white font-bold">{holdersCount}</span>
        </div>
      </div>
    </>
  );
};
