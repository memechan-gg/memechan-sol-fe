import { TICKETS_INTERVAL } from "@/config/config";
import { useTickets } from "@/hooks/useTickets";
import { StakingPool } from "@/views/coin/sidebar/staking-pool/staking-pool";
import { LiveClaimProps } from "./types";

export const LiveClaim = (props: LiveClaimProps) => {
  const { seedPoolAddress, livePoolId, stakingPoolFromApi, tokenSymbol } = props;
  const ticketsData = useTickets({
    poolAddress: seedPoolAddress,
    poolStatus: "LIVE",
    refreshInterval: TICKETS_INTERVAL,
    livePoolAddress: livePoolId,
  });
  return ticketsData.isLoading
    ? "Loading..."
    : ticketsData.tickets.length > 0 &&
        (ticketsData.stakedAmount !== "0.000001" || ticketsData.unavailableTicketsAmount !== "0") &&
        livePoolId && (
          <StakingPool
            tokenSymbol={tokenSymbol}
            livePoolAddress={livePoolId}
            ticketsData={ticketsData}
            stakingPoolFromApi={stakingPoolFromApi}
          />
        );
};
