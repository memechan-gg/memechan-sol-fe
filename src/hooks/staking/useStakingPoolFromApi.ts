import { PoolApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

const fetchStakingPoolFromApi = async (memeMint: string) => {
  try {
    const stakingPool = await PoolApiInstance.getStakingPoolByCoinType(memeMint);

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPoolFromApi] Failed to fetch staking pool for meme ${memeMint}:`, e);
  }
};

export function useStakingPoolFromApi(memeMint: string) {
  return useQuery({
    queryKey: ["staking-pool-from-api"],
    queryFn: () => (memeMint ? fetchStakingPoolFromApi(memeMint) : undefined),
    enabled: !!memeMint,
    staleTime: Infinity,
  });
}
