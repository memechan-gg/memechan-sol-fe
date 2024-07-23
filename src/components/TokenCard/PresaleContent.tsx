import { Typography } from "@/memechan-ui/Atoms/Typography";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
interface Props {
  token: SolanaToken;
}
export const PresaleContent = ({ token }: Props) => {
  const { name, address, image, marketcap, description, holdersCount } = token;

  // TODO:ALDIN HANDLE DYNAMIC PERCENTAGE
  const mockedPresalePercantage = 24.5;

  // Calculate the number of red and black # characters
  const totalCharacters = 60; // Adjust this value based on how many # characters you want in total
  const redCharacters = Math.round((mockedPresalePercantage / 100) * totalCharacters);
  const blackCharacters = totalCharacters - redCharacters;

  // Generate the # strings
  const redHash = "#".repeat(redCharacters);
  const blackHash = "#".repeat(blackCharacters);

  return (
    <>
      <div className="flex flex-row text-sm text-white mt-2">
        <div className=" w-full flex gap-1 flex-col items-start text-xs-custom text-mono-500 overflow-hidden">
          <Typography variant="h4" color="primary-100">
            {mockedPresalePercantage}%
          </Typography>
          <div className="flex w-full">
            <Typography variant="h4" color="primary-100">
              {redHash}
            </Typography>
            <Typography variant="h4" color="mono-400">
              {blackHash}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};
