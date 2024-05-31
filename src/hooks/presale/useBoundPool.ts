import { loadBalancedConnection } from "@/common/solana";
import { BoundPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPool = async (poolAddress: string) => {
  try {
    const boundPool = await BoundPoolClient.fetch2(loadBalancedConnection, new PublicKey(poolAddress));

    return boundPool;
  } catch (e) {
    console.error(`[fetchBoundPool] Failed to fetch bound pool ${poolAddress}:`, e);
  }
};

export function useBoundPool(poolAddress: string) {
  const { data } = useSWR([`bound-pool-${poolAddress}`, poolAddress], ([url, pool]) => fetchBoundPool(pool), {
    refreshInterval: 5000,
  });

  return data;
}
