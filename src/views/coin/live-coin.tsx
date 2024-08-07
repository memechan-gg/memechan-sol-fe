import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useMedia } from "@/hooks/useMedia";
import { Button } from "@/memechan-ui/Atoms";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { LivePoolData } from "@/types/pool";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
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
            className="fixed inset-0 flex items-end justify-end pb-20 bg-black bg-opacity-30 backdrop-blur-[0.8px] z-40"
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
    // <>
    //   <div className="flex justify-center">
    //     <div className="inline-flex justify-center items-center p-2 border border-black shadow-sm w-full max-w-sm sm:max-w-md">
    //       <div className="flex flex-col items-center text-center">
    //         <div className="font-bold text-regular">{coinMetadata.name}</div>
    //         <div>
    //           <Link
    //             href={`/profile/${coinMetadata.address}/${coinMetadata.creator}`}
    //             className="text-[11px] md:text-xs text-link sm:hover:underline text-ellipsis"
    //           >
    //             {coinMetadata.creator}
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // <div className="flex flex-col gap-3 lg:hidden">
    //     <LiveCoinSidebar
    //       pool={livePoolData}
    //       coinMetadata={coinMetadata}
    //       uniqueHoldersData={uniqueHoldersData}
    //       seedPoolData={seedPoolData}
    //       stakingPoolFromApi={stakingPoolFromApi}
    //     />
    //   </div>
    //   <ThreadBoard title={coinMetadata.name} showNavigateBtn>
    //     <div className="flex flex-col gap-2">
    //       <div className="flex flex-wrap flex-row gap-3 gap-x-10">
    //         <div className="flex flex-col gap-1">
    //           <div className="text-sm font-bold text-regular">Token Name</div>
    //           <div className="text-xs font-bold text-regular">{coinMetadata.name}</div>
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <div className="text-sm font-bold text-regular">Token Ticker</div>
    //           <div className="text-xs font-bold text-regular">{coinMetadata.symbol}</div>
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <div className="text-sm font-bold text-regular">Market Cap</div>
    //           <div className="text-xs font-bold text-regular">
    //             {" "}
    //             {prices ? `$${formatNumber(+prices.priceInUsd * 1_000_000_000, 2)}` : "-"}
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <div className="text-sm font-bold !normal-case text-regular">USD price</div>
    //           <div className="text-xs font-bold !normal-case text-regular">
    //             {prices ? `$${(+prices.priceInUsd).toFixed(10)}` : "-"}
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <div className="text-sm font-bold text-regular">Unique holders</div>
    //           <div className="text-xs font-bold text-regular">
    //             {uniqueHoldersData ? uniqueHoldersData.fullHolders.length : <Skeleton />}
    //           </div>
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <div className="text-sm font-bold text-link">Created By</div>
    //           <Link
    //             href={`/profile/${coinMetadata.address}/${coinMetadata.creator}`}
    //             className="text-xs font-bold text-link"
    //           >
    //             {coinMetadata.creator.slice(0, 5)}...
    //             {coinMetadata.creator.slice(-3)}
    //           </Link>
    //         </div>
    //       </div>
    //       <div className="flex w-full flex-col lg:flex-row gap-6">
    //         <div className="flex flex-col gap-3 w-full">
    //
    //           <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
    //         </div>
    //         <div className="lg:flex hidden w-1/3 flex-col gap-4">
    //           <LiveCoinSidebar
    //             pool={livePoolData}
    //             coinMetadata={coinMetadata}
    //             uniqueHoldersData={uniqueHoldersData}
    //             seedPoolData={seedPoolData}
    //             stakingPoolFromApi={stakingPoolFromApi}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </ThreadBoard>
    // </>
  );
}
