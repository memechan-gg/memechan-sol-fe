import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getBoundPoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPoolClient = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const boundPoolClient = await getBoundPoolClientFromId(
      new PublicKey(poolAddress),
      client,
      clientV2,
    );
    return boundPoolClient;
  } catch (e) {
    console.error(`[fetchBoundPoolClient] Failed to get bound pool client ${poolAddress}:`, e);
  }
};

export function useBoundPoolClient(poolAddress: string) {
  const { memechanClient, memechanClientV2 } = useConnection();

  const { data } = useSWR(
    [`bound-pool-client-${poolAddress}`, poolAddress, memechanClient, memechanClientV2],
    ([_, pool, memechanClient, memechanClientV2]) => fetchBoundPoolClient(pool, memechanClient, memechanClientV2),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
