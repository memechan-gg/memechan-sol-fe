import { BOUND_POOL_HOLDERS_INTERVAL, MAX_HOLDERS_COUNT } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { getBoundPoolHolderPercentage } from "@/views/coin/sidebar/holders/utils";
import { BoundPoolClient, MemechanClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import useSWR from "swr";

export const fetchPresaleCoinUniqueHolders = async (poolAddress: string, client: MemechanClient) => {
  try {
    const map = await BoundPoolClient.getHoldersMap(new PublicKey(poolAddress), client);

    const holders: { address: string; tokenAmountInPercentage: BigNumber }[] = [];

    Array.from(map.entries()).forEach(([holder, tickets]) => {
      const percentage = getBoundPoolHolderPercentage(tickets);
      holders.push({ address: holder, tokenAmountInPercentage: new BigNumber(percentage) });
    });

    const sortedHolders = holders.sort(({ tokenAmountInPercentage: percentA }, { tokenAmountInPercentage: percentB }) =>
      percentB.minus(percentA).toNumber(),
    );

    const slicedHolders = sortedHolders.slice(0, MAX_HOLDERS_COUNT);

    return { slicedHolders, map };
  } catch (e) {
    console.error(`[fetchPresaleCoinUniqueHolders] Cannot fetch unique holders for pool ${poolAddress}:`, e);
  }
};

export function usePresaleCoinUniqueHolders(poolAddress: string) {
  const { memechanClient } = useConnection();

  const { data: uniqueHolders } = useSWR(
    [`unique-holders-${poolAddress}`, poolAddress, memechanClient],
    ([url, pool, client]) => fetchPresaleCoinUniqueHolders(pool, client),
    { refreshInterval: BOUND_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return { holders: uniqueHolders?.slicedHolders, map: uniqueHolders?.map };
}
