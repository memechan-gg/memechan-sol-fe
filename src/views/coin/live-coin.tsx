import { Button } from "@/components/button";
import { ChartIframe } from "@/components/chart-iframe";
import { ThreadBoard } from "@/components/thread";
import { useLiveCoinUniqueHoldersFromBE } from "@/hooks/live/useLiveCoinUniqueHoldersFromBE";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { LivePoolData } from "@/types/pool";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { useState } from "react";
import { CoinTitleInfo } from "./coin-title-info/coin-title-info";
import { CommentsPanel } from "./comments-panel";
import { LiveCoinSidebar } from "./sidebar/live-coin-sidebar";

export function LiveCoin({ coinMetadata, livePoolData }: { coinMetadata: SolanaToken; livePoolData: LivePoolData }) {
  const price = useMemePriceFromBE({ memeMint: coinMetadata.address, poolType: "livePool" });
  const seedPoolData = useSeedPool(coinMetadata.address);
  const stakingPoolFromApi = useStakingPoolFromApi(coinMetadata.address);
  const uniqueHoldersData = useLiveCoinUniqueHoldersFromBE(coinMetadata.address, stakingPoolFromApi?.address);

  // Initialize state with 'birdeye' as the default
  const [selectedChart, setSelectedChart] = useState<"birdeye" | "dexscreener">("dexscreener");

  return (
    <ThreadBoard title={coinMetadata.name}>
      <div className="flex flex-col gap-2">
        <CoinTitleInfo coinMetadata={coinMetadata} price={price} uniqueHoldersData={uniqueHoldersData} />
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3 w-full">
            {selectedChart === "birdeye" ? (
              <ChartIframe
                src={`https://birdeye.so/tv-widget/${coinMetadata.address}/${livePoolData.id}?chain=solana&chartType=candle&chartInterval=5&chartLeftToolbar=show`}
              />
            ) : (
              <ChartIframe
                src={`https://dexscreener.com/solana/${livePoolData.id}?embed=1&theme=dark&trades=0&info=0&interval=5`}
              />
            )}
            <div className="flex flex-col gap-3 lg:hidden">
              <LiveCoinSidebar
                pool={livePoolData}
                coinMetadata={coinMetadata}
                uniqueHoldersData={uniqueHoldersData}
                seedPoolData={seedPoolData}
                stakingPoolFromApi={stakingPoolFromApi}
              />
            </div>
            <div className="flex justify-center items-center gap-3">
              <Button onClick={() => setSelectedChart("birdeye")}>Birdeye.so</Button>
              <Button onClick={() => setSelectedChart("dexscreener")}>Dexscreener.com</Button>
            </div>
            <CommentsPanel coinType={coinMetadata.address} coinCreator={coinMetadata.creator} />
          </div>
          <div className="lg:flex hidden w-1/3 flex-col gap-4">
            <LiveCoinSidebar
              pool={livePoolData}
              coinMetadata={coinMetadata}
              uniqueHoldersData={uniqueHoldersData}
              seedPoolData={seedPoolData}
              stakingPoolFromApi={stakingPoolFromApi}
            />
          </div>
        </div>
      </div>
    </ThreadBoard>
  );
}
