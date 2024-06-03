import { BE_URL, TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import useSWR from "swr";
import { MAX_HOLDERS_COUNT } from "./config";
import { HOLDERS_INTERVAL } from "./refresh-intervals";

export const fetchUniqueHolders = async (memeMint: string) => {
  try {
    const map = await TokenApiHelper.getHoldersMapFromBackend(new PublicKey(memeMint), BE_URL);

    const holders: { address: string; tokenAmountInPercentage: BigNumber }[] = [];

    // TODO: Adjust after release
    // Array.from(map.entries()).forEach(([holder, tickets]) => {
    //   const percentage = getBoundPoolHolderPercentage(tickets);
    //   holders.push({ address: holder, tokenAmountInPercentage: new BigNumber(percentage) });
    // });

    const sortedHolders = holders.sort(({ tokenAmountInPercentage: percentA }, { tokenAmountInPercentage: percentB }) =>
      percentB.minus(percentA).toNumber(),
    );

    const slicedHolders = sortedHolders.slice(0, MAX_HOLDERS_COUNT);

    return { slicedHolders, map };
  } catch (e) {
    console.error(`[fetchUniqueHolders] Cannot fetch unique holders for meme ${memeMint}:`, e);
  }
};

export function useUniqueHolders(memeMint: string) {
  const { data: uniqueHolders } = useSWR(
    [`unique-holders-${memeMint}`, memeMint],
    ([url, pool]) => fetchUniqueHolders(pool),
    { refreshInterval: HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return { holders: uniqueHolders?.slicedHolders, map: uniqueHolders?.map };
}
