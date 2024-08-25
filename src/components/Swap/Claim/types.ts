import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { TokenInfo } from "memechan-sol-sdk";

export interface LiveClaimProps {
  seedPoolAddress?: string;
  livePoolId?: string;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
  tokenSymbol: string;
  quoteTokenInfo?: TokenInfo | null;
  memePrice?: string;
}

export interface PresaleClaimProps {
  tokenSymbol: string;
  quoteTokenInfo?: TokenInfo | null;
  seedPoolAddress?: string;
  memePrice?: string;
}

export interface ClaimProps extends LiveClaimProps {
  variant: "LIVE" | "PRESALE";
}
