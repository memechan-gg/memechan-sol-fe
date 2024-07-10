import { useConnection } from "@/context/ConnectionContext";
import {
  MemechanClient,
  MemechanClientV2,
  NoBoundPoolExist,
  getBoundPoolClientFromId,
} from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPoolClient = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const boundPoolClient = await getBoundPoolClientFromId(new PublicKey(poolAddress), client, clientV2);
    return boundPoolClient;
  } catch (e) {
    if (e instanceof NoBoundPoolExist) return null;
    console.error(`[fetchBoundPoolClient] Failed to get bound pool client ${poolAddress}:`, e);
  }
};

export function useBoundPoolClient(poolAddress?: string | null) {
  const { memechanClient, memechanClientV2 } = useConnection();

  const { data } = useSWR(
    poolAddress ? [`bound-pool-client-${poolAddress}`, poolAddress, memechanClient, memechanClientV2] : null,
    ([_, pool, memechanClient, memechanClientV2]) => fetchBoundPoolClient(pool, memechanClient, memechanClientV2),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
