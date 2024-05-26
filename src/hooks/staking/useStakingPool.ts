import { MemechanClientInstance } from "@/common/solana";
import { StakingPool } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchStakingPool = async (poolAddress: string) => {
  try {
    const stakingPool = await StakingPool.fetch(MemechanClientInstance.connection, new PublicKey(poolAddress));

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPool] Failed to fetch staking pool ${poolAddress}:`, e);
  }
};

export function useStakingPool(poolAddress: string) {
  const { data } = useSWR([`staking-pool-${poolAddress}`, poolAddress], ([url, pool]) => fetchStakingPool(pool));

  return data;
}
