import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useMedia } from "@/hooks/useMedia";
import { Button } from "@/memechan-ui/Atoms";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { SeedPoolData } from "@/types/pool";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { track } from "@vercel/analytics";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CommentsTab } from "./common-tabs/comments-tab/comments-tab";
import { ChartTab } from "./presale-coin-tabs/chart-tab/chart-tab";
import { InfoTab } from "./presale-coin-tabs/info-tab/info-tab";

export const mobileTabs = ["Info", "Chart", "Comments"];
export const desktopTabs = ["Chart", "Comments"];

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
    router.push(
      {
        pathname: `/coin/[coinType]`,
        query: { coinType: coinMetadata.address, tab: tab },
      },
      undefined,
      { shallow: true },
    );
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
          <div className="fixed bottom-0 bg-mono-100 border-t border-mono-400 w-full z-50 flex flex-col items-center justify-center p-2 md:hidden">
            <div className="flex h-[50px] mx-4 mb-4 mt-2 gap-2 w-full">
              <div className="flex-grow w-3/5">
                <Button variant="contained">
                  <img src="/memechan-button.png" alt="Memechan Button" className="max-h-[50px]" />
                </Button>
              </div>
              <div className="flex-grow-2 w-2/5">
                <Button variant="primary">Buy / Claim</Button>
              </div>
            </div>
            <Tabs tabs={mobileTabs} onTabChange={onTabChange} activeTab={tab} />
          </div>
          <div className="w-full px-3">
            {tab === "Info" && (
              <InfoTab coinMetadata={coinMetadata} pool={seedPoolData} boundPoolClient={boundPoolClient} />
            )}
            {tab === "Comments" && (
              <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
            )}
            {tab === "Chart" && (
              <ChartTab seedPoolDataAddress={seedPoolData.address} tokenSymbol={coinMetadata.symbol} />
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 flex flex-col gap-y-3">
            <div className="bg-mono-400 py-1">
              <Tabs tabs={desktopTabs} onTabChange={onTabChange} activeTab={tab} />
            </div>
            {tab === "Comments" && (
              <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
            )}
            {tab === "Chart" && (
              <ChartTab seedPoolDataAddress={seedPoolData.address} tokenSymbol={coinMetadata.symbol} />
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <InfoTab coinMetadata={coinMetadata} pool={seedPoolData} boundPoolClient={boundPoolClient} />
          </div>
        </div>
      )}
    </>
  );
}
