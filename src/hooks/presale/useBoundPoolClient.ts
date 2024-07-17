import { useConnection } from "@/context/ConnectionContext";
import {
  MemechanClient,
  MemechanClientV2,
  NoBoundPoolExist,
  getBoundPoolClientFromId,
} from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const fetchBoundPoolClient = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const boundPoolClient = await getBoundPoolClientFromId(new PublicKey(poolAddress), client, clientV2);
    return boundPoolClient;
  } catch (e) {
    if (e instanceof NoBoundPoolExist) return null;
    return null;
    // console.error(`[fetchBoundPoolClient] Failed to get bound pool client ${poolAddress}:`, e);
  }
};

export function useBoundPoolClient(poolAddress?: string | null) {
  const { memechanClient, memechanClientV2 } = useConnection();
  return useQuery({
    queryKey: ["bound-pool-client", poolAddress],
    queryFn: () => (poolAddress ? fetchBoundPoolClient(poolAddress, memechanClient, memechanClientV2) : undefined),
    enabled: !!poolAddress,
    staleTime: Infinity,
  });
}
