import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getStakingPoolClientFromId } from "@rinegade/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const fetchStakingPoolClient = async (poolAddress: string, client: MemechanClient, clientV2: MemechanClientV2) => {
  try {
    const { stakingPoolClient } = await getStakingPoolClientFromId(new PublicKey(poolAddress), client, clientV2);

    return stakingPoolClient;
  } catch (e) {
    console.error(`[fetchStakingPoolClient] Failed to fetch staking pool client ${poolAddress}:`, e);
  }
};

export function useStakingPoolClient(poolAddress?: string) {
  const { memechanClient, memechanClientV2 } = useConnection();
  return useQuery({
    queryKey: ["staking-pool-client", poolAddress],
    queryFn: () => (poolAddress ? fetchStakingPoolClient(poolAddress, memechanClient, memechanClientV2) : undefined),
    enabled: !!poolAddress,
  });
}
