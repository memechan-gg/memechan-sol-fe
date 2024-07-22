import BackIcon from "@/memechan-ui/icons/BackIcon";
import Link from "next/link";
import { Typography } from "../Typography";

export interface TopBarProps {
  tokenSymbol: string;
  tokenAddress: string;
}

const TopBar = ({ tokenSymbol, tokenAddress }: TopBarProps) => {
  return (
    <div className="w-full justify-between items-center flex bottom-border py-2">
      <div>
        <Link href="/">
          <BackIcon fill="var(--color-mono-500)" />
        </Link>
      </div>
      <div className="flex items-center">
        <Typography variant="h4" color="mono-600">
          {tokenSymbol}
        </Typography>
        {tokenAddress && (
          <Typography variant="body" color="mono-500">
            {"/" + tokenAddress}
          </Typography>
        )}
      </div>
      <Link href="/" className="">
        <img src="/android-chrome-192x192.png" alt="logo" className="w-3 h-3" />{" "}
      </Link>
    </div>
  );
};

export default TopBar;
