import { TokenCard } from "@/components/TokenCard";
import { TICKETS_INTERVAL } from "@/config/config";
import { useTickets } from "@/hooks/useTickets";
import { LiveCoinSidebarProps } from "../coin.types";
import { LiveCoinHolders } from "./holders/live-coin-holders";
import { SidebarItem } from "./sidebar-item";
import { StakingPool } from "./staking-pool/staking-pool";

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

  return (
    <div className="flex flex-col gap-y-3">
      <SidebarItem>
        <TokenCard key={coinMetadata.address} token={coinMetadata} />
      </SidebarItem>
      {ticketsData.isLoading
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
          )}
      <SidebarItem>
        <LiveCoinHolders coinMetadata={coinMetadata} uniqueHoldersData={uniqueHoldersData} livePool={pool} />
      </SidebarItem>
    </div>
  );
}
