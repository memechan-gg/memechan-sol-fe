import { parseChainValue } from "@/utils/parseChainValue";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { track } from "@vercel/analytics";
import Link from "next/link";

export function NoticeBoard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-solid border-black w-full sm:text-start text-center">
      {/* Title part of the board */}
      <div className="bg-regular text-white pl-2 py-1 font-bold dark:bg-gray-800 dark:text-gray-200">
        <h2 className="text-sm">{title}</h2>
      </div>
      {/* Body part of the board */}
      <div className="p-2 bg-white text-xs dark:bg-gray-700 dark:text-gray-300">
        <div>{children}</div>
      </div>
    </div>
  );
}

export function ThreadBoard({
  title,
  titleChildren,
  children,
  showNavigateBtn,
  navigateUrl,
}: {
  title: string;
  titleChildren?: React.ReactNode;
  children: React.ReactNode;
  showNavigateBtn?: boolean;
  navigateUrl?: string;
}) {
  return (
    <div className="flex flex-col border border-solid border-black w-full">
      {/* Title part of the board */}
      <div className="relative bg-board text-regular flex items-center p-2 sm:pb-2 pb-3 font-bold justify-between sm:flex-row flex-col dark:bg-gray-800 dark:text-gray-300">
        <h2 className="text-sm sm:mb-0 mb-4 ">{title}</h2>
        {showNavigateBtn && (
          <Link
            href={navigateUrl || "/"}
            className="hidden md:block absolute right-0 mr-2 bg-title bg-opacity-15 items-center text-xs justify-center font-bold text-regular px-2 py-[2px] rounded-lg hover:bg-opacity-25"
          >
            Back
          </Link>
        )}
        {titleChildren}
      </div>
      {/* Body part of the board */}
      <div className="p-2 bg-white text-xs flex w-full dark:bg-gray-700 dark:text-gray-400">
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
  const onImageClick = () => {
    track("List_CoinImageClick", { coin: address });
  };
  const onContentClick = () => {
    track("List_CoinContentClick", { coin: address });
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[150px]">
        <h2 className="text-sm font-bold text-regular truncate">{name}</h2>
      </div>
      <Link href={`/coin/${address}`} onClick={onImageClick}>
        <img
          className="w-[150px] border border-regular h-[150px] object-cover object-center hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-2"
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
        {status === "PRESALE" && (
          <div className="text-green font-bold">
            market cap: <span className="text-green">{parseChainValue(marketcap, 0, 2)}</span>
          </div>
        )}
        <Link href={`/coin/${address}`} onClick={onContentClick}>
          <div className="text-regular flex flex-col flex-wrap">
            <div className="font-bold !normal-case">symbol: {symbol}</div>
            <div className="max-w-[150px] truncate">{description}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
