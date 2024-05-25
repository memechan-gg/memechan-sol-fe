import { MemechanClientInstance } from "@/common/solana";
import { BoundPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

export const fetchUniqueHolders = async (poolAddress: string) => {
  try {
    const map = await BoundPoolClient.getHoldersMap(new PublicKey(poolAddress), MemechanClientInstance);

    return map;
  } catch (e) {
    console.error(`[fetchUniqueHolders] Cannot fetch unique holders for pool ${poolAddress}:`, e);
  }
};

export function useUniqueHolders(poolAddress: string) {
  const { data: uniqueHolders } = useSWR(
    [`unique-holders-${poolAddress}`, poolAddress],
    ([url, pool]) => fetchUniqueHolders(pool),
    { refreshInterval: 5000 },
  );

  return uniqueHolders;
}
