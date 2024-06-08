import { formatNumber } from "@/utils/formatNumber";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import Link from "next/link";

export function NoticeBoard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-solid border-black w-full sm:text-start text-center">
      {/* Title part of the board */}
      <div className="bg-regular text-white pl-2 py-1 font-bold">
        <h2 className="text-sm">{title}</h2>
      </div>
      {/* Body part of the board */}
      <div className="p-2 bg-white text-xs">
        <div>{children}</div>
      </div>
    </div>
  );
}

export function ThreadBoard({
  title,
  titleChildren,
  children,
}: {
  title: string;
  titleChildren?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border border-solid border-black w-full">
      {/* Title part of the board */}
      <div className="bg-board text-regular flex items-center p-2 sm:pb-2 pb-3 font-bold justify-between sm:flex-row flex-col">
        <h2 className="sm:text-sm text-xl sm:mb-0 mb-4">{title}</h2>
        {titleChildren}
      </div>
      {/* Body part of the board */}
      <div className="p-2 bg-white text-xs flex w-full">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

export function Thread({
  coinMetadata: { name, address, image, creator, marketcap, symbol, description, status },
}: {
  coinMetadata: SolanaToken;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[150px]">
        <h2 className="text-sm font-bold text-regular truncate">{name}</h2>
      </div>
      <Link href={`/coin/${address}`}>
        <img
          className="w-[150px] border border-regular h-[150px] object-cover object-center"
          src={image}
          alt="Coin Image"
        />
      </Link>
      <div className="flex flex-col gap-1 text-xs">
        <div className="text-link">
          Created by:{" "}
          <Link href={`/profile/${creator}`}>
            <span className="font-bold hover:underline">{creator.slice(0, 5) + "..." + creator.slice(-3)}</span>
          </Link>
        </div>
        {status && status === "PRESALE" && <div className="text-green">market cap: ${formatNumber(marketcap, 2)}</div>}
        <Link href={`/coin/${address}`}>
          <div className="text-regular flex flex-col flex-wrap">
            <div className="font-bold !normal-case">symbol: {symbol}</div>
            <div className="max-w-[150px] truncate">{description}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
