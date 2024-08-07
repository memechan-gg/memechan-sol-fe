import { TICKETS_INTERVAL } from "@/config/config";
import { useMedia } from "@/hooks/useMedia";
import { useTickets } from "@/hooks/useTickets";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { StakingPool } from "@/views/coin/sidebar/staking-pool/staking-pool";
import { LiveClaimProps } from "./types";

export const LiveClaim = (props: LiveClaimProps) => {
  const media = useMedia();
  const { seedPoolAddress, livePoolId, stakingPoolFromApi, tokenSymbol } = props;
  const ticketsData = useTickets({
    poolAddress: seedPoolAddress,
    poolStatus: "LIVE",
    refreshInterval: TICKETS_INTERVAL,
    livePoolAddress: livePoolId,
  });
  return ticketsData.isLoading ? (
    "Loading..."
  ) : ticketsData.tickets.length > 0 &&
    (ticketsData.stakedAmount !== "0.000001" || ticketsData.unavailableTicketsAmount !== "0") &&
    livePoolId ? (
    <div>
      <StakingPool
        tokenSymbol={tokenSymbol}
        livePoolAddress={livePoolId}
        ticketsData={ticketsData}
        stakingPoolFromApi={stakingPoolFromApi}
      />
    </div>
  ) : (
    <div>
      <div>
        <Typography variant="body" color="mono-600">
          You claimed all your presale funds, dumbass
        </Typography>
      </div>
      <img className="mt-2" src="/NoClaimImage.png" alt="Nothing to claim"></img>
      <div className="mt-4">
        <Typography variant="h4" color="mono-600">
          But here’s what you could earn if you did:
        </Typography>
      </div>
      <div>
        <div className="flex justify-between mt-4">
          <Typography variant="body" color="mono-500">
            {tokenSymbol} Fees Distributed
          </Typography>
          <div className={`${media.isExstraSmallDevice ? "grid" : ""}`}>
            <Typography variant="body" color="mono-600">
              420,000 {tokenSymbol}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $2000.00
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Typography variant="body" color="mono-500">
            SOL Fees Distributed
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              26.32 SOL
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $3400.00
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Typography variant="body" color="mono-500">
            CHAN Fees Distributed
          </Typography>
          <div>
            <Typography variant="body" color="mono-600">
              69,000 CHAN
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $255.22
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
