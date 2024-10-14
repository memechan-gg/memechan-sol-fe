import { Typography } from "@/memechan-ui/Atoms/Typography";
import { parseChainValue } from "@/utils/parseChainValue";
import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import { useTheme } from "next-themes";
interface Props {
  token: SolanaToken;
  progressInfo?: {
    progress?: number;
    totalQuoteAmount?: string;
    currentQuoteAmount?: string;
    participactsAmount?: string;
    timeFromCreation?: string;
  };
}

export const PresaleContent = ({ token, progressInfo }: Props) => {
  const { theme } = useTheme();
  return (
    <>
      <div className="flex flex-col text-sm text-white mt-[14px]">
        {progressInfo && (
          <div className="w-full flex flex-row items-start text-xs-custom text-mono-500 overflow-hidden justify-between">
            <div className="flex flex-row gap-x-2">
              {progressInfo?.progress !== undefined && (
                <Typography variant="h4" color="primary-100">
                  {parseChainValue(progressInfo?.progress, 0, 1)}%
                </Typography>
              )}
              {progressInfo?.currentQuoteAmount !== undefined && progressInfo.totalQuoteAmount !== undefined && (
                <Typography variant="h4" color="mono-600">
                  {progressInfo?.currentQuoteAmount} of {progressInfo?.totalQuoteAmount} {token.quoteSymbol}
                </Typography>
              )}
            </div>
            <div className="flex flex-row gap-x-1">
              <Typography variant="body" color="mono-500">
                {progressInfo?.participactsAmount} Participants
              </Typography>
              <Typography variant="h4" color="mono-600">
                / {progressInfo?.timeFromCreation}
              </Typography>
            </div>
          </div>
        )}
        {progressInfo && (
          <div className="w-full flex flex-col items-start text-xs-custom text-mono-500 overflow-hidden">
            <div className="w-full h-4 relative  overflow-hidden">
              <div
                className="h-full text-red-500 whitespace-nowrap overflow-hidden"
                style={{
                  width: `${progressInfo?.progress}%`,
                }}
              >
                <Typography variant="h4" color="primary-100">
                  {"#".repeat(100)}
                </Typography>
              </div>
              <div
                className="h-full  text-white absolute top-0 left-0 whitespace-nowrap overflow-hidden"
                style={{
                  width: `${100 - (progressInfo?.progress ?? 0)}%`,
                  marginLeft: `${progressInfo?.progress}%`,
                }}
              >
                <Typography variant="h4" color={theme === "light" ? "mono-300" : "mono-400"}>
                  {"#".repeat(100)}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
