import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { TokenInfo } from "@avernikoz/memechan-sol-sdk";

export interface LiveClaimProps {
  seedPoolAddress?: string;
  livePoolId?: string;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
  tokenSymbol: string;
  quoteTokenInfo?: TokenInfo | null;
}

export interface PresaleClaimProps {
  tokenSymbol: string;
  quoteTokenInfo?: TokenInfo | null;
}

export interface ClaimProps extends LiveClaimProps {
  variant: "LIVE" | "PRESALE";
}
