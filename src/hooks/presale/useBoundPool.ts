import { BOUND_POOL_DATA_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import {
  MemechanClient,
  MemechanClientV2,
  NoBoundPoolExist,
  getBoundPoolClientFromId,
} from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPool = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const boundPool = (await getBoundPoolClientFromId(new PublicKey(poolAddress), client, clientV2)).poolObjectData;
    return boundPool;
  } catch (e) {
    if (e instanceof NoBoundPoolExist) return null;
    console.error(`[fetchBoundPool] Failed to fetch bound pool ${poolAddress}:`, e);
  }
};

export function useBoundPool(poolAddress: string) {
  const { memechanClient, memechanClientV2 } = useConnection();

  const { data } = useSWR(
    [`bound-pool-${poolAddress}`, poolAddress],
    ([url, pool]) => fetchBoundPool(pool, memechanClient, memechanClientV2),
    {
      refreshInterval: BOUND_POOL_DATA_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return data;
}
