import { useConnection } from "@/context/ConnectionContext";
import { BoundPoolClient, MemechanClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPoolClient = async (poolAddress: string, client: MemechanClient) => {
  try {
    const boundPool = await BoundPoolClient.fromBoundPoolId({
      client,
      poolAccountAddressId: new PublicKey(poolAddress),
    });

    return boundPool;
  } catch (e) {
    console.error(`[fetchBoundPoolClient] Failed to get bound pool client ${poolAddress}:`, e);
  }
};

export function useBoundPoolClient(poolAddress: string) {
  const { memechanClient } = useConnection();

  const { data } = useSWR(
    [`bound-pool-client-${poolAddress}`, poolAddress, memechanClient],
    ([url, pool, client]) => fetchBoundPoolClient(pool, client),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
