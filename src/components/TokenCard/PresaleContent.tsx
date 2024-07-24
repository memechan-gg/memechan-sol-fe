import { Typography } from "@/memechan-ui/Atoms/Typography";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
interface Props {
  token: SolanaToken;
}

export const PresaleContent = ({ token }: Props) => {
  // const { name, address, image, marketcap, description, holdersCount } = token;

  // TODO:ALDIN HANDLE DYNAMIC mockedPresalePercantage
  const mockedPresalePercantage = 50;

  return (
    <>
      <div className="flex flex-row text-sm text-white mt-2">
        <div className="w-full flex flex-col items-start text-xs-custom text-mono-500 overflow-hidden">
          <Typography variant="h4" color="primary-100">
            {mockedPresalePercantage}%
          </Typography>
          <div className="w-full h-4 relative  overflow-hidden">
            <div
              className="h-full text-red-500 whitespace-nowrap overflow-hidden"
              style={{
                width: `${mockedPresalePercantage}%`,
              }}
            >
              <Typography variant="h4" color="primary-100">
                {"#".repeat(100)}
              </Typography>
            </div>
            <div
              className="h-full  text-white absolute top-0 left-0 whitespace-nowrap overflow-hidden"
              style={{
                width: `${100 - mockedPresalePercantage}%`,
                marginLeft: `${mockedPresalePercantage}%`,
              }}
            >
              <Typography variant="h4" color="mono-400">
                {"#".repeat(100)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
