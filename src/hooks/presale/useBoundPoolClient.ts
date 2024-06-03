import { MemechanClientInstance } from "@/common/solana";
import { BoundPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchBoundPoolClient = async (poolAddress: string) => {
  try {
    const boundPool = await BoundPoolClient.fromBoundPoolId({
      client: MemechanClientInstance,
      poolAccountAddressId: new PublicKey(poolAddress),
    });

    return boundPool;
  } catch (e) {
    console.error(`[fetchBoundPoolClient] Failed to get bound pool client ${poolAddress}:`, e);
  }
};

export function useBoundPoolClient(poolAddress: string) {
  const { data } = useSWR(
    [`bound-pool-client-${poolAddress}`, poolAddress],
    ([url, pool]) => fetchBoundPoolClient(pool),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
