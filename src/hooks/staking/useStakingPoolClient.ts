import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getStakingPoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchStakingPoolClient = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const stakingPool = await getStakingPoolClientFromId(new PublicKey(poolAddress), client, clientV2);

    return stakingPool;
  } catch (e) {
    console.error(`[fetchStakingPoolClient] Failed to fetch staking pool client ${poolAddress}:`, e);
  }
};

export function useStakingPoolClient(poolAddress?: string) {
  const { memechanClient, memechanClientV2 } = useConnection();

  return useSWR(
    poolAddress ? [`staking-pool-client-${poolAddress}`, poolAddress, memechanClient, memechanClientV2] : null,
    ([url, pool, client, clinetV2]) => fetchStakingPoolClient(pool, client, clinetV2),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );
}
