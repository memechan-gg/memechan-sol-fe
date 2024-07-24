import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useMedia } from "@/hooks/useMedia";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { SeedPoolData } from "@/types/pool";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { track } from "@vercel/analytics";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChartTab } from "./chart-tab/chart-tab";
import { CommentsTab } from "./comments-tab/comments-tab";
import { InfoTab } from "./info-tab/info-tab";

const mobileTabs = ["info", "chart", "comments"];
const desktopTabs = ["chart", "comments"];

export function PresaleCoin({
  coinMetadata,
  seedPoolData,
  tab,
}: {
  coinMetadata: SolanaToken;
  seedPoolData: SeedPoolData;
  tab: string;
}) {
  const mediaQuery = useMedia();
  const router = useRouter();
  const { data: boundPoolClient } = useBoundPoolClient(seedPoolData.address);

  useEffect(() => {
    let intervalId: number | undefined;

    if (boundPoolClient === null) {
      // Set an interval to reload the page every 10 seconds
      intervalId = window.setInterval(() => {
        window.location.reload();
      }, 10000);
    }

    // Cleanup function to clear the interval when the component unmounts or boundPoolClient changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [boundPoolClient]);

  const onTabChange = (tab: string) => {
    track("PresaleCoin_SetTab", { status: tab });
    router.push({
      pathname: `/coin/[coinType]`,
      query: { coinType: coinMetadata.address, tab: tab.toLowerCase() },
    });
  };

  if (boundPoolClient === null || boundPoolClient === undefined) {
    return (
      <div className="absolute rounded-xl top-0 left-0 w-full h-full bg-regular bg-opacity-70 flex items-center justify-center">
        <div className="text-white text-center text-balance font-bold text-lg tracking-wide">
          Pool is currently migrating to the Live Phase. Please wait.
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar tokenAddress={coinMetadata.address} tokenSymbol={coinMetadata.symbol} />
      {mediaQuery.isSmallDevice ? (
        <>
          <div className="fixed bottom-0 bg-mono-100 border-t border-mono-400 w-full z-50 flex items-center justify-center p-2 md:hidden">
            <Tabs tabs={mobileTabs} onTabChange={onTabChange} activeTab={tab} />
          </div>
          <div>
            {tab === "info" && (
              <InfoTab coinMetadata={coinMetadata} pool={seedPoolData} boundPoolClient={boundPoolClient} />
            )}
            {tab === "comments" && (
              <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
            )}
            {tab === "chart" && (
              <ChartTab seedPoolDataAddress={seedPoolData.address} tokenSymbol={coinMetadata.symbol} />
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div>
              <Tabs tabs={desktopTabs} onTabChange={onTabChange} activeTab={tab} />
              {tab === "comments" && (
                <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
              )}
              {tab === "chart" && (
                <ChartTab seedPoolDataAddress={seedPoolData.address} tokenSymbol={coinMetadata.symbol} />
              )}
            </div>
          </div>
          <div className="col-span-1">
            <InfoTab coinMetadata={coinMetadata} pool={seedPoolData} boundPoolClient={boundPoolClient} />
          </div>
        </div>
      )}
    </>
  );
}
