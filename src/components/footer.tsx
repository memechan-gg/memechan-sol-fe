import { Typography } from "@/memechan-ui/Atoms/Typography";
import Image from "next/image";
import Link from "next/link";
import TelegramIcon from "../memechan-ui/icons/telegram-icon.svg";
import TwitterIcon from "../memechan-ui/icons/twitter-icon.svg";
import { Logo } from "./logo";

export const Footer = () => (
  <footer className="hidden sm:block">
    <div className="items-center justify-between flex py-[14px] px-3 xl:px-0">
      <div className="flex gap-2 items-center">
        <Link href="/" className="pink-border rounded-sm size-4 self-end">
          <Logo />
        </Link>
        <span className="flex cursor-default">
          <Typography color="mono-500"> solana.memechan.gg </Typography>
        </span>
        <span className="flex cursor-default">
          <Typography color="mono-500"> / </Typography>
        </span>
        <span className="flex cursor-default">
          <Typography color="mono-500"> all rights fucked up </Typography>
        </span>
      </div>
      <div className="flex gap-6">
        <a href="https://x.com/memechan_gg" target="_blank" rel="noopener noreferrer">
          <Image
            width={24}
            height={24}
            src={TwitterIcon}
            alt="twitter"
            className="m-[6px] sm:hover:opacity-80 sm:hover:cursor-pointer"
          />
        </a>
        <a href="https://t.me/memechan_gg" target="_blank" rel="noopener noreferrer">
          <Image
            width={24}
            height={24}
            src={TelegramIcon}
            alt="telegram"
            className="m-[6px] sm:hover:opacity-80 sm:hover:cursor-pointer"
          />
        </a>
      </div>
    </div>
  </footer>
);
