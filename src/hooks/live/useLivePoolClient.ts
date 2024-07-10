import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getLivePoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

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

  const { data } = useSWR(
    poolAddress ? [`live-pool-client-${poolAddress}`, poolAddress, memechanClient, memechanClientV2] : null,
    ([_, pool, memechanClient, memechanClientV2]) => fetchLivePoolClient(pool, memechanClient, memechanClientV2),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
