import { formatNumberForDisplay, formatSmallNumber } from "@/utils/formatNumber";
import { timeSince } from "@/utils/timeSpents";
import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import { useTheme } from "next-themes";
interface Props {
  token: SolanaToken;
}
export const LiveContent = ({ token }: Props) => {
  const { marketcap, holdersCount, creationTime } = token;
  const { theme } = useTheme();

  const textColor = theme === "light" ? "text-mono-600" : "text-mono-600";

  return (
    <div className="flex justify-between mt-[14px] items-center w-full">
      <div className="flex gap-1 flex-col items-start">
        <span className="text-[13px] text-mono-500 font-light leading-[16px]">Marketcap</span>
        <span className={`${textColor} font-bold text-[13px] leading-[16px]`}>
          ${formatNumberForDisplay(marketcap || 0)}
        </span>
      </div>
      <div className="flex gap-1 flex-col items-start">
        <span className="text-[13px] text-mono-500 font-light leading-[16px]">Holders</span>
        <span className={`${textColor} font-bold text-[13px] leading-[16px]`}>
          {holdersCount ? formatNumberForDisplay(Number(holdersCount), true) : 0}
        </span>
      </div>
      <div className="flex gap-1 flex-col items-start">
        <span className="text-[13px] text-mono-500 font-light leading-[16px]">Age</span>
        <span className={`${textColor} font-bold text-[13px] leading-[16px]`}>{timeSince(creationTime)}</span>
      </div>
      <div className="flex gap-1 flex-col items-start">
        <span className="text-[13px] text-mono-500 font-light leading-[16px]">Price</span>
        <span className={`${textColor} font-bold text-[13px] leading-[16px]`}>
          {formatSmallNumber(marketcap / 1_000_000_000, 3)}
        </span>
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
