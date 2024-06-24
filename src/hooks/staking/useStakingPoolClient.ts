import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, StakingPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchStakingPoolClient = async (poolAddress: string, client: MemechanClient) => {
  try {
    const stakingPool = await StakingPoolClient.fromStakingPoolId({
      client,
      poolAccountAddressId: new PublicKey(poolAddress),
    });

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPoolClient] Failed to fetch staking pool client ${poolAddress}:`, e);
  }
};

export function useStakingPoolClient(poolAddress?: string) {
  const { memechanClient } = useConnection();

  return useSWR(
    poolAddress ? [`staking-pool-client-${poolAddress}`, poolAddress, memechanClient] : null,
    ([url, pool, client]) => fetchStakingPoolClient(pool, client),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );
}
