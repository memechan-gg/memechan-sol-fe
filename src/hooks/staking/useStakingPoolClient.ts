import { MemechanClientInstance } from "@/common/solana";
import { StakingPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchStakingPoolClient = async (poolAddress: string) => {
  try {
    const stakingPool = await StakingPoolClient.fromStakingPoolId({
      client: MemechanClientInstance,
      poolAccountAddressId: new PublicKey(poolAddress),
    });

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPoolClient] Failed to fetch staking pool client ${poolAddress}:`, e);
  }
};

export function useStakingPoolClient(poolAddress?: string) {
  const { data } = useSWR(poolAddress ? [`staking-pool-client-${poolAddress}`, poolAddress] : null, ([url, pool]) =>
    fetchStakingPoolClient(pool),
  );

  return data;
}
