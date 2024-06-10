import { ChartIframe } from "@/components/chart-iframe";
import { ThreadBoard } from "@/components/thread";
import { TICKETS_INTERVAL } from "@/config/config";
import { usePresaleCoinUniqueHoldersFromBE } from "@/hooks/presale/usePresaleCoinUniqueHoldersFromBE";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { useTickets } from "@/hooks/useTickets";
import { SeedPoolData } from "@/types/pool";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { CoinTitleInfo } from "./coin-title-info/coin-title-info";
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

  const CHARTS_API_HOSTNAME = process.env.NEXT_PUBLIC_CHARTS_API_HOSTNAME;

  const CHART_QUOTE_SYMBOL: "SLERF" | "USD" = "SLERF";

  return (
    <ThreadBoard title={coinMetadata.name}>
      <div className="flex flex-col gap-2">
        <CoinTitleInfo coinMetadata={coinMetadata} price={price} uniqueHoldersData={uniqueHoldersData} />
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3 w-full">
            {CHARTS_API_HOSTNAME && (
              <ChartIframe
                src={`https://${CHARTS_API_HOSTNAME}/?address=${seedPoolData.address}&symbol=${CHART_QUOTE_SYMBOL}&contract=${coinMetadata.symbol.toUpperCase()}/${CHART_QUOTE_SYMBOL}`}
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
  );
}
