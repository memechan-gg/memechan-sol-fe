import { MemechanClientInstance } from "@/common/solana";
import { BoundPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

export const fetchPresaleCoinUniqueHolders = async (poolAddress: string) => {
  try {
    const map = await BoundPoolClient.getHoldersMap(new PublicKey(poolAddress), MemechanClientInstance);

    return map;
  } catch (e) {
    console.error(`[fetchPresaleCoinUniqueHolders] Cannot fetch unique holders for pool ${poolAddress}:`, e);
  }
};

export function usePresaleCoinUniqueHolders(poolAddress: string) {
  const { data: uniqueHolders } = useSWR(
    [`unique-holders-${poolAddress}`, poolAddress],
    ([url, pool]) => fetchPresaleCoinUniqueHolders(pool),
    { refreshInterval: 5000 },
  );

  return uniqueHolders;
}
