import { useConnection } from "@/context/ConnectionContext";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { MemechanClient, MemechanClientV2, getLivePoolClientFromId } from "memechan-sol-sdk";

const fetchLivePoolClient = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const livePoolClient = await getLivePoolClientFromId(new PublicKey(poolAddress), client, clientV2);
    return livePoolClient;
  } catch (e) {
    console.error(`[fetchLivePoolClient] Failed to get live pool client ${poolAddress}:`, e);
  }
};

export function useLivePoolClient(poolAddress?: string | null) {
  const { memechanClient, memechanClientV2 } = useConnection();
  return useQuery({
    queryKey: ["live-pool-client", poolAddress],
    queryFn: () => (poolAddress ? fetchLivePoolClient(poolAddress, memechanClient, memechanClientV2) : undefined),
    enabled: !!poolAddress,
    staleTime: Infinity,
  });
}
