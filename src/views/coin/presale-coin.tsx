import { ChartIframe } from "@/components/chart-iframe";
import { ThreadBoard } from "@/components/thread";
import { TICKETS_INTERVAL } from "@/config/config";
import { useBoundPool } from "@/hooks/presale/useBoundPool";
import { usePresaleCoinUniqueHoldersFromBE } from "@/hooks/presale/usePresaleCoinUniqueHoldersFromBE";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { useTickets } from "@/hooks/useTickets";
import { getTokenInfo } from "@/hooks/utils";
import { SeedPoolData } from "@/types/pool";
import { formatNumber } from "@/utils/formatNumber";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { CommentsPanel } from "./comments-panel";
import { PresaleCoinSidebar } from "./sidebar/presale-coin-sidebar";

export function PresaleCoin({ coinMetadata, seedPoolData }: { coinMetadata: SolanaToken; seedPoolData: SeedPoolData }) {
  const price = useMemePriceFromBE({ memeMint: coinMetadata.address, poolType: "seedPool" });
  const uniqueHoldersData = usePresaleCoinUniqueHoldersFromBE(coinMetadata.address);
  const ticketsData = useTickets({
    poolAddress: seedPoolData.address,
    poolStatus: "PRESALE",
    refreshInterval: TICKETS_INTERVAL,
  });

  const boundPool = useBoundPool(seedPoolData.address);

  const tokenData = boundPool?.quoteReserve
    ? getTokenInfo({ variant: "publicKey", quoteMint: boundPool?.quoteReserve.mint })
    : undefined;

  const CHARTS_API_HOSTNAME = process.env.NEXT_PUBLIC_CHARTS_API_HOSTNAME;

  return (
    <>
      <div className="flex justify-center">
        <div className="inline-flex justify-center items-center p-2 border border-black shadow-sm w-full max-w-sm sm:max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="font-bold text-regular">{coinMetadata.name}</div>
            <div>
              <Link
                href={`/profile/${coinMetadata.address}/${coinMetadata.creator}`}
                className="text-[11px] md:text-xs text-link hover:underline text-ellipsis"
              >
                {coinMetadata.creator}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ThreadBoard title={coinMetadata.name} showNavigateBtn>
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
                {price ? `$${(+price).toFixed(10)}` : <Skeleton />}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-regular">Unique holders</div>
              <div className="text-xs font-bold text-regular">
                {uniqueHoldersData ? uniqueHoldersData.fullHolders.length : <Skeleton />}
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
              {CHARTS_API_HOSTNAME && tokenData && (
                <ChartIframe
                  src={`https://${CHARTS_API_HOSTNAME}/?address=${seedPoolData.address}&symbol=${tokenData.displayName}&contract=${coinMetadata.symbol.toUpperCase()}/${tokenData.displayName}`}
                />
              )}
              <div className="flex flex-col gap-3 lg:hidden">
                <PresaleCoinSidebar
                  coinMetadata={coinMetadata}
                  pool={seedPoolData}
                  uniqueHoldersData={uniqueHoldersData}
                  ticketsData={ticketsData}
                />
              </div>
              <CommentsPanel coinType={coinMetadata.address} coinCreator={coinMetadata.creator} />
            </div>
            <div className="lg:flex hidden w-1/3 flex-col gap-4">
              <PresaleCoinSidebar
                coinMetadata={coinMetadata}
                pool={seedPoolData}
                uniqueHoldersData={uniqueHoldersData}
                ticketsData={ticketsData}
              />
            </div>
          </div>
        </div>
      </ThreadBoard>
    </>
  );
}
