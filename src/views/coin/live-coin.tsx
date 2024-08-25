import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useMedia } from "@/hooks/useMedia";
import { Button } from "@/memechan-ui/Atoms";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { LivePoolData } from "@/types/pool";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import { SolanaToken } from "memechan-sol-sdk";
import { useRouter } from "next/router";
import { useState } from "react";
import { CommentsTab } from "./common-tabs/comments-tab/comments-tab";
import { ChartTab } from "./live-coin-tabs/chart-tab/chart-tab";
import { InfoTab } from "./live-coin-tabs/info-tab/info-tab";
import { desktopTabs, mobileTabs } from "./presale-coin";
import { LiveCoinSwap } from "./sidebar/swap/live-coin-swap";

export function LiveCoin({
  coinMetadata,
  livePoolData,
  tab,
}: {
  coinMetadata: SolanaToken;
  livePoolData: LivePoolData;
  tab: string;
}) {
  const { data: stakingPoolFromApi } = useStakingPoolFromApi(coinMetadata.address);
  const { data: seedPoolData } = useSeedPool(coinMetadata.address);
  const mediaQuery = useMedia();
  const router = useRouter();
  const [swapOpen, setSwapOpen] = useState(false);

  const onTabChange = (tab: string) => {
    track("Live_SetTab", { status: tab });
    router.push(
      {
        pathname: `/coin/[coinType]`,
        query: { coinType: coinMetadata.address, tab: tab },
      },
      undefined,
      { shallow: true },
    );
    if (mediaQuery.isSmallDevice) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  };

  return (
    <>
      <TopBar tokenAddress={coinMetadata.address} tokenSymbol={coinMetadata.symbol} rightIcon={coinMetadata.image} />
      {mediaQuery.isSmallDevice ? (
        <>
          {tab === "Info" && (
            <div className="w-full px-3">
              <InfoTab
                coinMetadata={coinMetadata}
                pool={livePoolData}
                stakingPoolFromApi={stakingPoolFromApi}
                seedPoolData={seedPoolData}
              />
            </div>
          )}
          {tab === "Comments" && (
            <div className="w-full px-3">
              <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />{" "}
            </div>
          )}
          {tab === "Chart" && (
            <div className="w-full">
              <ChartTab coinAddress={coinMetadata.address} livePoolDataId={livePoolData.id} />{" "}
            </div>
          )}
          <div className="pt-1 flex w-full">
            <div className="fixed w-[30%] h-12 bottom-[10.7%] right-[7%]">
              <Button
                className="custom-outer-shadow"
                variant="primary"
                onClick={() => {
                  setSwapOpen(true);
                }}
              >
                Buy / Claim
              </Button>
            </div>
          </div>
          <div className=" h-40 w-full ">
            <div className="relative bottom-[-15%] ml-6 w-[52%] h-12">
              <Button variant="contained">
                <img src="/memechan-button.png" alt="Memechan Button" className="w-full h-12" />
              </Button>
            </div>
            <div className="fixed bottom-0 bg-mono-200 border-t border-t-mono-400 h-15 w-screen px-3 justify-between z-50">
              <Tabs className="justify-between" tabs={mobileTabs} onTabChange={onTabChange} activeTab={tab} immovable />
            </div>
          </div>
          <Dialog
            isOpen={swapOpen}
            onDismiss={() => setSwapOpen(false)}
            className="fixed inset-0 flex items-center justify-center pb-20 bg-black bg-opacity-30 backdrop-blur-[0.8px] z-40"
          >
            <div className="w-full px-2 max-h-full overflow-auto shadow-light">
              <LiveCoinSwap
                pool={livePoolData}
                tokenSymbol={coinMetadata.symbol}
                memeImage={coinMetadata.image}
                stakingPoolFromApi={stakingPoolFromApi}
                seedPoolAddress={seedPoolData?.address}
                onClose={() => {
                  setSwapOpen(false);
                }}
              />
            </div>
          </Dialog>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-3 px-3 xl:px-0 w-full">
          <div className="col-span-2 flex flex-col gap-y-3">
            <div className="flex justify-start">
              <Tabs
                className="justify-start items-center gap-x-6"
                tabs={desktopTabs}
                onTabChange={onTabChange}
                activeTab={tab}
              />
            </div>
            {tab === "Comments" && (
              <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
            )}
            {tab === "Chart" && <ChartTab coinAddress={coinMetadata.address} livePoolDataId={livePoolData.id} />}
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <InfoTab
              coinMetadata={coinMetadata}
              pool={livePoolData}
              stakingPoolFromApi={stakingPoolFromApi}
              seedPoolData={seedPoolData}
            />
          </div>
        </div>
      )}
    </>
  );
}
