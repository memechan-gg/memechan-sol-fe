import { TICKETS_INTERVAL } from "@/config/config";
import { useMedia } from "@/hooks/useMedia";
import { useTickets } from "@/hooks/useTickets";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { StakingPool } from "@/views/coin/sidebar/staking-pool/staking-pool";
import { Oval } from "react-loader-spinner";
import { LiveClaimProps } from "./types";

export const LiveClaim = (props: LiveClaimProps) => {
  const media = useMedia();
  const { seedPoolAddress, livePoolId, stakingPoolFromApi, tokenSymbol, quoteTokenInfo } = props;
  const ticketsData = useTickets({
    poolAddress: seedPoolAddress,
    poolStatus: "LIVE",
    refreshInterval: TICKETS_INTERVAL,
    livePoolAddress: livePoolId,
  });
  return ticketsData.isLoading ? (
    <div className="flex justify-center items-center min-h-[325px]">
      <Oval
        visible={true}
        height="50px"
        width="50px"
        color="#3e3e3e"
        ariaLabel="oval-loading"
        secondaryColor="#979797"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  ) : ticketsData.tickets.length > 0 &&
    (ticketsData.stakedAmount !== "0.000001" || ticketsData.unavailableTicketsAmount !== "0") &&
    livePoolId ? (
    <div>
      <StakingPool
        tokenSymbol={tokenSymbol}
        livePoolAddress={livePoolId}
        ticketsData={ticketsData}
        stakingPoolFromApi={stakingPoolFromApi}
        quoteTokenInfo={quoteTokenInfo}
      />
    </div>
  ) : (
    <div className="min-h-[325px]">
      <div>
        <Typography variant="body" color="mono-600">
          {ticketsData.stakedAmount === "0.000001"
            ? "You claimed all your presale funds, dumbass"
            : "You haven’t participated in presale, dummy"}
        </Typography>
      </div>
      <img className="mt-4" src="/NoClaimImage.png" alt="Nothing to claim"></img>
      {/* <div className="mt-4">
        <Typography variant="h4" color="mono-600">
          But here’s what you could earn if you did:
        </Typography>
      </div> */}
      {/* <div>
        <div className="flex justify-between mt-4 items-center text-end">
          <Typography variant="body" color="mono-500">
            {tokenSymbol} Fees Distributed
          </Typography>
          <div className={`${media.isExtraSmallDevice ? "grid" : ""}`}>
            <Typography variant="body" color="mono-600">
              420,000 {tokenSymbol}
            </Typography>{" "}
            <Typography variant="body" color="mono-500">
              / $2000.00
            </Typography>
          </div>
        </div>
        <div className="flex justify-between mt-2 items-center text-end">
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
        <div className="flex justify-between mt-2 items-center text-end">
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
      </div> */}
    </div>
  );
};
