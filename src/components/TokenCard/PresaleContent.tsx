import { parseChainValue } from "@/utils/parseChainValue";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
interface Props {
  token: SolanaToken;
}
export const PresaleContent = ({ token }: Props) => {
  const { name, address, image, marketcap, description, holdersCount } = token;

  // TODO:EDO for now we will mock presale progress data
  // Make UI for this
  // https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=428-6881&t=JvSbSggCPJO8wL1D-4
  // include only percentage bar and percantage number above bar
  // no need to include: 123.44 of 500 SOL and 224 Participants / 13h from example

  const mockedPresalePercantage = 24;

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
