"use client";
import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getStakingPoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchStakingPool = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const stakingPool = await getStakingPoolClientFromId(new PublicKey(poolAddress), client, clientV2);

    return stakingPool.poolObjectData;
  } catch (e) {
    console.log(e);
    console.error(`[fetchStakingPool] Failed to fetch staking pool ${poolAddress}:`, e);
  }
};

export function useStakingPool(poolAddress?: string) {
  const { memechanClient, memechanClientV2 } = useConnection();

  const { data } = useSWR(
    poolAddress ? [`staking-pool-${poolAddress}`, poolAddress, memechanClient, memechanClientV2] : null,
    ([url, pool, memechanClient, memechanClientV2]) => fetchStakingPool(pool, memechanClient, memechanClientV2),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
