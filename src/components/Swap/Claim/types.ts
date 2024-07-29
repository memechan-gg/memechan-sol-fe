import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";

export interface LiveClaimProps {
  seedPoolAddress?: string;
  livePoolId?: string;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
  tokenSymbol: string;
}

export interface ClaimProps extends LiveClaimProps {
  variant: "LIVE" | "PRESALE";
}
