import { Button } from "@/components/button";
import { ChartIframe } from "@/components/chart-iframe";
import { ThreadBoard } from "@/components/thread";
import { useLiveCoinUniqueHolders } from "@/hooks/live/useLiveCoinUniqueHolders";
import { useLiveMemePrice } from "@/hooks/live/useLiveMemePrice";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { CoinMetadata } from "@/types/coin";
import { LivePoolData } from "@/types/pool";
import { formatNumber } from "@/utils/formatNumber";
import { normalizeNumber } from "@/utils/normalizeNumber";
import Link from "next/link";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { CommentsPanel } from "./comments-panel";
import { LiveCoinSidebar } from "./sidebar/live-coin-sidebar";

export function LiveCoin({ coinMetadata, livePoolData }: { coinMetadata: CoinMetadata; livePoolData: LivePoolData }) {
  const priceData = useLiveMemePrice(livePoolData.id);
  const { seedPool } = useSeedPool(coinMetadata.address);
  const uniqueHoldersData = useLiveCoinUniqueHolders(coinMetadata.address, seedPool?.address);

  // Initialize state with 'birdeye' as the default
  const [selectedChart, setSelectedChart] = useState<"birdeye" | "dexscreener">("birdeye");

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
            <div className="text-xs font-bold text-regular">${formatNumber(coinMetadata.marketcap, 2)}</div>
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
            {selectedChart === "birdeye" ? (
              <ChartIframe
                src={`https://birdeye.so/tv-widget/${coinMetadata.address}/${livePoolData.id}?chain=solana&chartType=candle&chartInterval=5&chartLeftToolbar=show`}
              />
            ) : (
              <ChartIframe
                src={`https://dexscreener.com/solana/${livePoolData.id}?embed=1&theme=dark&trades=0&info=0`}
              />
            )}
            <div className="flex flex-col gap-3 lg:hidden">
              <LiveCoinSidebar pool={livePoolData} coinMetadata={coinMetadata} />
            </div>
            <div className="flex justify-center items-center gap-3">
              <Button onClick={() => setSelectedChart("birdeye")}>Birdeye.so</Button>
              <Button onClick={() => setSelectedChart("dexscreener")}>Dexscreener.com</Button>
            </div>
            <CommentsPanel coinType={coinMetadata.address} coinCreator={coinMetadata.creator} />
          </div>
          <div className="lg:flex hidden w-1/3 flex-col gap-4">
            <LiveCoinSidebar pool={livePoolData} coinMetadata={coinMetadata} />
          </div>
        </div>
      </div>
    </ThreadBoard>
  );
}
