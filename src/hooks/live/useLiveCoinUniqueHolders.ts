import { MemechanClientInstance } from "@/common/solana";
import { StakingPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { MAX_HOLDERS_COUNT } from "../config";
import { LIVE_POOL_HOLDERS_INTERVAL } from "../refresh-intervals";

const fetchLiveUniqueHolders = async (mint: string, boundPoolId: string) => {
  try {
    const [holders, stakingData] = await StakingPoolClient.getHoldersList(
      new PublicKey(boundPoolId),
      new PublicKey(mint),
      MemechanClientInstance,
    );

    const fullHolders = holders.slice();

    const sortedHolders = holders.sort(({ tokenAmount: amountA }, { tokenAmount: amountB }) =>
      amountB.minus(amountA).toNumber(),
    );

    const slicedHolders = sortedHolders.slice(0, MAX_HOLDERS_COUNT);

    return { holders: slicedHolders, stakingData, fullHolders };
  } catch (e) {
    console.error(
      `[fetchLiveUniqueHolders] Failed to fetch unique holders for bound pool ${boundPoolId} and meme mint ${mint}:`,
      e,
    );
  }
};

export function useLiveCoinUniqueHolders(mint: string, boundPoolId?: string) {
  const { data } = useSWR(
    boundPoolId ? [`unique-holders-${boundPoolId}-${mint}`, mint, boundPoolId] : null,
    ([url, meme, pool]) => fetchLiveUniqueHolders(meme, pool),
    { refreshInterval: LIVE_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
