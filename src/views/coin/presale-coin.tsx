import { TICKETS_INTERVAL } from "@/config/config";
import { useReferrerContext } from "@/context/ReferrerContext";
import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { useMedia } from "@/hooks/useMedia";
import { useTickets } from "@/hooks/useTickets";
import { Button } from "@/memechan-ui/Atoms";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { SeedPoolData } from "@/types/pool";
import { headingVariants } from "@/utils/motionVariants";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { CommentsTab } from "./common-tabs/comments-tab/comments-tab";
import { ChartTab } from "./presale-coin-tabs/chart-tab/chart-tab";
import { InfoTab } from "./presale-coin-tabs/info-tab/info-tab";
import { PresaleCoinSwap } from "./sidebar/swap/presale-coin-swap";

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
  const referrer = useReferrerContext();
  const mediaQuery = useMedia();
  const router = useRouter();
  const { data: boundPoolClient, isFetching, isError, isLoading } = useBoundPoolClient(seedPoolData.address);
  const ticketsData = useTickets({
    poolAddress: seedPoolData.address,
    poolStatus: "PRESALE",
    refreshInterval: TICKETS_INTERVAL,
  });

  const [swapOpen, setSwapOpen] = useState(false);

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
    if (referrer.referrer) {
      router.push(
        {
          pathname: `/coin/[coinType]`,
          query: { coinType: coinMetadata.address, tab: tab, referrer: referrer.referrer },
        },
        undefined,
        { shallow: true },
      );
    } else {
      router.push(
        {
          pathname: `/coin/[coinType]`,
          query: { coinType: coinMetadata.address, tab: tab },
        },
        undefined,
        { shallow: true },
      );
    }
    if (mediaQuery.isSmallDevice) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  };

  if (!isFetching && isError && (boundPoolClient === null || boundPoolClient === undefined)) {
    return (
      <div className="absolute rounded-xl top-0 left-0 w-full h-full bg-regular bg-opacity-70 flex items-center justify-center">
        <div className="text-white text-center text-balance font-bold text-lg tracking-wide">
          Pool is currently migrating to the Live Phase. Please wait.
        </div>
      </div>
    );
  }

  if (isLoading || boundPoolClient === null || boundPoolClient === undefined)
    return (
      <div className="mt-2">
        <Oval visible={true} color="#3e3e3e" secondaryColor="#979797" />
      </div>
    );

  return (
    <>
      <TopBar tokenAddress={coinMetadata.address} tokenSymbol={coinMetadata.symbol} rightIcon={coinMetadata.image} />
      {mediaQuery.isSmallDevice ? (
        <>
          {tab === "Info" && (
            <div className="w-full px-3">
              <InfoTab
                coinMetadata={coinMetadata}
                pool={seedPoolData}
                boundPoolClient={boundPoolClient}
                ticketsData={ticketsData}
              />
            </div>
          )}
          {tab === "Comments" && (
            <div className="w-full px-3">
              <CommentsTab coinAddress={coinMetadata.address} coinCreator={coinMetadata.creator} />
            </div>
          )}
          {tab === "Chart" && (
            <div className="w-full">
              <ChartTab seedPoolDataAddress={seedPoolData.address} tokenSymbol={coinMetadata.symbol} />
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
              <PresaleCoinSwap
                pool={seedPoolData}
                tokenSymbol={coinMetadata.symbol}
                boundPool={boundPoolClient.boundPoolInstance.poolObjectData}
                ticketsData={ticketsData}
                memeImage={coinMetadata.image}
                onClose={() => {
                  setSwapOpen(false);
                }}
              />
            </div>
          </Dialog>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-3 px-3 xl:px-0 w-full">
          <div className="col-span-2 flex flex-col gap-y-2">
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
            {tab === "Chart" && (
              <ChartTab seedPoolDataAddress={seedPoolData.address} tokenSymbol={coinMetadata.symbol} />
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <motion.div variants={headingVariants} initial="hidden" animate="visible">
              <InfoTab
                coinMetadata={coinMetadata}
                ticketsData={ticketsData}
                pool={seedPoolData}
                boundPoolClient={boundPoolClient}
              />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
