import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchAllLivePools = async () => {
  try {
    const allLivePools = (await PoolApiInstance.getLivePools()).result;

    return allLivePools;
  } catch (e) {
    console.error("[fetchAllLivePools] Failed to fetch all live pools:", e);
  }
};

export function useLivePools() {
  const { data: livePools } = useSWR("live-pools", fetchAllLivePools);

  return livePools;
}
