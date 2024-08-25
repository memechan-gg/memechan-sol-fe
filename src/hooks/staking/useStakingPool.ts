import { useConnection } from "@/context/ConnectionContext";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { MemechanClient, MemechanClientV2, getStakingPoolClientFromId } from "memechan-sol-sdk";

const fetchStakingPool = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const { stakingPoolClient } = await getStakingPoolClientFromId(new PublicKey(poolAddress), client, clientV2);

    return stakingPoolClient.poolObjectData;
  } catch (e) {
    console.log(e);
    console.error(`[fetchStakingPool] Failed to fetch staking pool ${poolAddress}:`, e);
  }
};

export function useStakingPool(poolAddress?: string) {
  const { memechanClient, memechanClientV2 } = useConnection();
  return useQuery({
    queryKey: ["staking-pool", poolAddress],
    queryFn: () => (poolAddress ? fetchStakingPool(poolAddress, memechanClient, memechanClientV2) : undefined),
    enabled: !!poolAddress,
    staleTime: Infinity,
  });
}
