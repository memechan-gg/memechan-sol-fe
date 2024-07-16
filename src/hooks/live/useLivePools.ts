import { PoolApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

const fetchAllLivePools = async () => {
  try {
    const allLivePools = (await PoolApiInstance.getLivePools()).result;

    return allLivePools;
  } catch (e) {
    console.error("[fetchAllLivePools] Failed to fetch all live pools:", e);
  }
};

export function useLivePools() {
  return useQuery({ queryKey: ["live-pools"], queryFn: fetchAllLivePools, refetchInterval: 5000 });
}
