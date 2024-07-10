import { TICKETS_INTERVAL } from "@/config/config";
import { useTickets } from "@/hooks/useTickets";
import { LiveCoinSidebarProps } from "../coin.types";
import { LiveCoinHolders } from "./holders/live-coin-holders";
import { LiveCoinInfo } from "./info/live-coin-info";
import { SidebarItem } from "./sidebar-item";
import { StakingPool } from "./staking-pool/staking-pool";
import { LiveCoinSwap } from "./swap/live-coin-swap";

export function LiveCoinSidebar({
  coinMetadata,
  pool,
  seedPoolData,
  uniqueHoldersData,
  stakingPoolFromApi,
}: LiveCoinSidebarProps) {
  const ticketsData = useTickets({
    poolAddress: seedPoolData.seedPool?.address,
    poolStatus: "LIVE",
    refreshInterval: TICKETS_INTERVAL,
    livePoolAddress: pool.id,
  });

  return (
    <>
      <SidebarItem>
        <LiveCoinSwap pool={pool} tokenSymbol={coinMetadata.symbol} />
      </SidebarItem>
      {ticketsData.isLoading
        ? "Loading..."
        : ticketsData.tickets.length > 0 &&
          (ticketsData.stakedAmount !== "0" || ticketsData.unavailableTicketsAmount != "0") && (
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
          )}
      <SidebarItem>
        <LiveCoinInfo metadata={coinMetadata} livePoolAddress={pool.id} quoteMint={pool.quoteMint} />
      </SidebarItem>
      <SidebarItem>
        <LiveCoinHolders coinMetadata={coinMetadata} uniqueHoldersData={uniqueHoldersData} livePool={pool} />
      </SidebarItem>
    </>
  );
}
