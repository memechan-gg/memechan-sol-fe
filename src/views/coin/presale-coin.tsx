import { ThreadBoard } from "@/components/thread";
import { useBoundPool } from "@/hooks/solana/useBoundPool";
import { useMemePriceAndMarketCap } from "@/hooks/solana/useMemePriceAndMarketCap";
import { useUniqueHolders } from "@/hooks/solana/useUniqueHolders";
import { CoinMetadata } from "@/types/coin";
import { SeedPoolData } from "@/types/pool";
import { normalizeNumber } from "@/utils/normalizeNumber";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { CommentsPanel } from "./comments-panel";
import { PresaleCoinSidebar } from "./sidebar/presale-coin-sidebar";

export function PresaleCoin({
  coinMetadata,
  seedPoolData,
}: {
  coinMetadata: CoinMetadata;
  seedPoolData: SeedPoolData;
}) {
  const boundPool = useBoundPool(seedPoolData.address);
  const { marketCap, priceData } = useMemePriceAndMarketCap({ status: "PRESALE", boundPoolInfo: boundPool });
  const uniqueHoldersMap = useUniqueHolders(seedPoolData.address);

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
              {uniqueHoldersMap ? uniqueHoldersMap.size : <Skeleton />}
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
            {/* Mockup Chart */}
            <div className="h-64 w-full bg-regular flex items-center justify-center">
              <div className="text-white text-center">Chart</div>
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              <PresaleCoinSidebar coinMetadata={coinMetadata} pool={seedPoolData} />
            </div>
            <CommentsPanel coinType={coinMetadata.address} />
          </div>
          <div className="lg:flex hidden w-1/3 flex-col gap-4">
            <PresaleCoinSidebar coinMetadata={coinMetadata} pool={seedPoolData} />
          </div>
        </div>
      </div>
    </ThreadBoard>
  );
}
