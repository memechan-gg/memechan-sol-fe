import { connection } from "@/common/solana";
import { BoundPoolClient, NoBoundPoolExist } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { BOUND_POOL_DATA_INTERVAL } from "../refresh-intervals";

const fetchBoundPool = async (poolAddress: string) => {
  try {
    const boundPool = await BoundPoolClient.fetch2(connection, new PublicKey(poolAddress));

    return boundPool;
  } catch (e) {
    if (e instanceof NoBoundPoolExist) return null;
    console.error(`[fetchBoundPool] Failed to fetch bound pool ${poolAddress}:`, e);
  }
};

export function useBoundPool(poolAddress: string) {
  const { data } = useSWR([`bound-pool-${poolAddress}`, poolAddress], ([url, pool]) => fetchBoundPool(pool), {
    refreshInterval: BOUND_POOL_DATA_INTERVAL,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return data;
}
