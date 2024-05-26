import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchAllSeedPools = async () => {
  try {
    const allSeedPools = (await PoolApiInstance.getAllSeedPools()).result;

    return allSeedPools;
  } catch (e) {
    console.error("[fetchAllSeedPools] Failed to fetch all seed pools:", e);
  }
};

export function useSeedPools() {
  const { data: seedPools } = useSWR("seed-pools", fetchAllSeedPools, { refreshInterval: 5000 });

  return seedPools;
}
