import { TokenCard } from "@/components/TokenCard";
import { TICKETS_INTERVAL } from "@/config/config";
import { useLivePoolClient } from "@/hooks/live/useLivePoolClient";
import { useMedia } from "@/hooks/useMedia";
import { useTickets } from "@/hooks/useTickets";
import { LiveCoinSidebarProps } from "../coin.types";
import { LiveCoinHolders } from "./holders/live-coin-holders";
import { LiveCoinInfo } from "./info/live-coin-info";
import { SidebarItem } from "./sidebar-item";
import { LiveCoinSwap } from "./swap/live-coin-swap";
export function LiveCoinSidebar({
  coinMetadata,
  pool,
  seedPoolData,
  uniqueHoldersData,
  stakingPoolFromApi,
}: LiveCoinSidebarProps) {
  const ticketsData = useTickets({
    poolAddress: seedPoolData?.address,
    poolStatus: "LIVE",
    refreshInterval: TICKETS_INTERVAL,
    livePoolAddress: pool.id,
  });
  const media = useMedia();
  const { data: livePoolClient } = useLivePoolClient(pool.id);

  return (
    <div className="flex flex-col gap-y-3">
      <SidebarItem>
        <TokenCard key={coinMetadata.address} token={coinMetadata} showLinks showCheckmark />
      </SidebarItem>
      {!media.isSmallDevice && (
        <SidebarItem>
          <LiveCoinSwap
            pool={pool}
            tokenSymbol={coinMetadata.symbol}
            memeImage={coinMetadata.image}
            stakingPoolFromApi={stakingPoolFromApi}
            seedPoolAddress={seedPoolData?.address}
            livePoolClient={livePoolClient}
          />
        </SidebarItem>
      )}
      {/* {ticketsData.isLoading
        ? "Loading..."
        : ticketsData.tickets.length > 0 &&
          (ticketsData.stakedAmount !== "0.000001" || ticketsData.unavailableTicketsAmount !== "0") && (
            <SidebarItem>
              {
                <StakingPool
                  tokenSymbol={coinMetadata.symbol}
                  livePoolAddress={pool.id}
                  ticketsData={ticketsData}
                  stakingPoolFromApi={stakingPoolFromApi}
                />
              }
            </SidebarItem>
          )} */}
      <SidebarItem>
        <LiveCoinInfo
          metadata={coinMetadata}
          stakingPoolFromApi={stakingPoolFromApi}
          livePool={pool}
          livePoolClient={livePoolClient}
        />
      </SidebarItem>
      <SidebarItem>
        <LiveCoinHolders coinMetadata={coinMetadata} uniqueHoldersData={uniqueHoldersData} livePool={pool} />
      </SidebarItem>
    </div>
  );
}
