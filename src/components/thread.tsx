import { formatNumber } from "@/utils/formatNumber";
import Link from "next/link";

export function NoticeBoard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-solid border-black w-full">
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
      <div className="bg-board text-regular flex items-center flex-row pl-2 py-1 font-bold justify-between">
        <h2 className="text-sm">{title}</h2>
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
  title,
  mint,
  image,
  createdBy,
  marketCap,
  ticker,
  description,
}: {
  title: string;
  mint: string;
  image: string;
  createdBy: string;
  marketCap: number;
  ticker: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[150px]">
        <h2 className="text-sm font-bold text-regular truncate">{title}</h2>
      </div>
      <Link href={`/coin/${mint}`}>
        <img
          className="w-[150px] border border-regular h-[150px] object-cover object-center"
          src={image}
          alt="Coin Image"
        />
      </Link>
      <div className="flex flex-col gap-1 text-xs">
        <div className="text-link">
          Created by:{" "}
          <Link href={`/profile/${createdBy}`}>
            <span className="font-bold hover:underline">{createdBy.slice(0, 5) + "..." + createdBy.slice(-3)}</span>
          </Link>
        </div>
        <div className="text-green">market cap: ${formatNumber(marketCap, 2)}</div>
        <Link href={`/coin/${mint}`}>
          <div className="text-regular flex flex-col flex-wrap">
            <div className="font-bold !normal-case">symbol: {ticker}</div>
            <div className="max-w-[150px] truncate">{description}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
