import { ThreadBoard } from "@/components/thread";
import { useLiveCoinUniqueHolders } from "@/hooks/live/useLiveCoinUniqueHolders";
import { useLiveMemePriceAndMCap } from "@/hooks/live/useLiveMemePriceAndMCap";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { CoinMetadata } from "@/types/coin";
import { LivePoolData } from "@/types/pool";
import { normalizeNumber } from "@/utils/normalizeNumber";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { CommentsPanel } from "./comments-panel";
import { LiveCoinSidebar } from "./sidebar/live-coin-sidebar";

export function LiveCoin({ coinMetadata, livePoolData }: { coinMetadata: CoinMetadata; livePoolData: LivePoolData }) {
  const { priceData, marketCap } = useLiveMemePriceAndMCap(livePoolData.id);
  const { seedPool } = useSeedPool(coinMetadata.address);
  const uniqueHoldersData = useLiveCoinUniqueHolders(coinMetadata.address, seedPool?.address);
  const CHARTS_API_HOSTNAME = process.env.NEXT_PUBLIC_CHARTS_API_HOSTNAME;

  return (
    <ThreadBoard title={coinMetadata.name}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap flex-row gap-3 gap-x-10">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Token Name</div>
            <div className="text-xs font-bold text-regular">{coinMetadata.name}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Token Ticker</div>
            <div className="text-xs font-bold text-regular">{coinMetadata.symbol}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Market Cap</div>
            <div className="text-xs font-bold text-regular">${marketCap ?? <Skeleton width={35} />}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold !normal-case text-regular">USD price</div>
            <div className="text-xs font-bold !normal-case text-regular">
              {priceData ? `$${normalizeNumber(priceData.priceInUsd)}` : <Skeleton />}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Unique holders</div>
            <div className="text-xs font-bold text-regular">
              {uniqueHoldersData ? uniqueHoldersData.holders.length : <Skeleton />}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-link">Created By</div>
            <Link href={`/profile/${coinMetadata.creator}`} className="text-xs font-bold text-link">
              {coinMetadata.creator.slice(0, 5)}...
              {coinMetadata.creator.slice(-3)}
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3 w-full">
            {/* Mockup Chart for live, presale one*/}
            {/* {seedPool?.address && CHARTS_API_HOSTNAME && (
              <ChartIframe address={seedPool.address} symbol={"SLERF"} chartsApiUrl={CHARTS_API_HOSTNAME} />
            )} */}

            <div className="flex flex-col gap-3 lg:hidden">
              <LiveCoinSidebar pool={livePoolData} coinMetadata={coinMetadata} />
            </div>
            <CommentsPanel coinType={coinMetadata.address} />
          </div>
          <div className="lg:flex hidden w-1/3 flex-col gap-4">
            <LiveCoinSidebar pool={livePoolData} coinMetadata={coinMetadata} />
          </div>
        </div>
      </div>
    </ThreadBoard>
  );
}
