import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchStakingPoolFromApi = async (memeMint: string) => {
  try {
    const stakingPool = await PoolApiInstance.getStakingPoolByCoinType(memeMint);

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPoolFromApi] Failed to fetch staking pool for meme ${memeMint}:`, e);
  }
};

export function useStakingPoolFromApi(memeMint: string) {
  const { data } = useSWR(
    [`staking-pool-from-api-${memeMint}`, memeMint],
    ([url, meme]) => fetchStakingPoolFromApi(meme),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
