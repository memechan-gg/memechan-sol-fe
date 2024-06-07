import { BOUND_POOL_DATA_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { BoundPoolClient, NoBoundPoolExist } from "@avernikoz/memechan-sol-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPool = async (poolAddress: string, connection: Connection) => {
  try {
    const boundPool = await BoundPoolClient.fetch2(connection, new PublicKey(poolAddress));

    return boundPool;
  } catch (e) {
    if (e instanceof NoBoundPoolExist) return null;
    console.error(`[fetchBoundPool] Failed to fetch bound pool ${poolAddress}:`, e);
  }
};

export function useBoundPool(poolAddress: string) {
  const { connection } = useConnection();

  const { data } = useSWR(
    [`bound-pool-${poolAddress}`, poolAddress, connection],
    ([url, pool, connection]) => fetchBoundPool(pool, connection),
    {
      refreshInterval: BOUND_POOL_DATA_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return data;
}
