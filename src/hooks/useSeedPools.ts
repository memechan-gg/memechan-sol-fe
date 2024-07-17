import { PoolApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

const SEED_POOL_REFRESH_INTERVAL = 5000;

const fetchAllSeedPools = async () => {
  try {
    const allSeedPools = (await PoolApiInstance.getAllSeedPools()).result;

    return allSeedPools;
  } catch (e) {
    console.error("[fetchAllSeedPools] Failed to fetch all seed pools:", e);
  }
};

export function useSeedPools() {
  return useQuery({
    queryKey: ["seed-pools"],
    queryFn: fetchAllSeedPools,
    refetchInterval: SEED_POOL_REFRESH_INTERVAL,
  });
}
