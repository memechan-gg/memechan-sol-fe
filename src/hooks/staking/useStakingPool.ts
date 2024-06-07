import { useConnection } from "@/context/ConnectionContext";
import { StakingPool } from "@avernikoz/memechan-sol-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchStakingPool = async (poolAddress: string, connection: Connection) => {
  try {
    const stakingPool = await StakingPool.fetch(connection, new PublicKey(poolAddress));

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPool] Failed to fetch staking pool ${poolAddress}:`, e);
  }
};

export function useStakingPool(poolAddress?: string) {
  const { connection } = useConnection();

  const { data } = useSWR(
    poolAddress ? [`staking-pool-${poolAddress}`, poolAddress, connection] : null,
    ([url, pool, connection]) => fetchStakingPool(pool, connection),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
