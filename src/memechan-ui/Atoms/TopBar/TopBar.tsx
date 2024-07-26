import BackIcon from "@/memechan-ui/icons/BackIcon";
import Link from "next/link";
import { Typography } from "../Typography";

export interface TopBarProps {
  tokenSymbol?: string;
  tokenAddress?: string;
  title?: string;
  rightIcon?: string;
  rightIconLink?: string;
}

const TopBar = ({ tokenSymbol, tokenAddress, title, rightIcon, rightIconLink }: TopBarProps) => {
  return (
    <div className="w-full justify-between items-center flex bottom-border py-auto px-3 h-10">
      <div>
        <Link href="/">
          <BackIcon fill="var(--color-mono-500)" />
        </Link>
      </div>
      <div className="flex items-center">
        <Typography variant="h4" color="mono-600">
          {tokenSymbol || title}
        </Typography>
        <div className="hidden md:block">
          {tokenAddress && (
            <Typography variant="body" color="mono-500">
              {"/" + tokenAddress}
            </Typography>
          )}
        </div>
      </div>
      {rightIcon ? (
        <Link href={rightIconLink || "/"} className="">
          <img src={rightIcon as string} alt="logo" className="w-4 h-4" />{" "}
        </Link>
      ) : (
        <Link href="/" className="">
          <img src="/android-chrome-192x192.png" alt="logo" className="w-4 h-4" />{" "}
        </Link>
      )}
    </div>
  );
};

export default TopBar;
