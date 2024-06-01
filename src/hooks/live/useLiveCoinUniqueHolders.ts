import { MemechanClientInstance } from "@/common/solana";
import { StakingPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { LIVE_POOL_HOLDERS_INTERVAL } from "../refresh-intervals";

const fetchLiveUniqueHolders = async (mint: string, boundPoolId: string) => {
  try {
    const [holders, stakingData] = await StakingPoolClient.getHoldersList(
      new PublicKey(boundPoolId),
      new PublicKey(mint),
      MemechanClientInstance,
    );

    return { holders, stakingData };
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
    { refreshInterval: LIVE_POOL_HOLDERS_INTERVAL },
  );

  return data;
}
