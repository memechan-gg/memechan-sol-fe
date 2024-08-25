import { LIVE_POOL_HOLDERS_INTERVAL, MAX_HOLDERS_COUNT } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { MemechanClient, MemechanClientV2, getStakingPoolClientFromId } from "memechan-sol-sdk";

const fetchLiveUniqueHolders = async (
  mint: string,
  boundPoolId: string,
  client: MemechanClient,
  clientV2: MemechanClientV2,
) => {
  try {
    const { stakingPoolClient } = await getStakingPoolClientFromId(new PublicKey(boundPoolId), client, clientV2);
    const [holders, stakingData] = await stakingPoolClient.getHoldersList();

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
  const { memechanClient, memechanClientV2 } = useConnection();
  return useQuery({
    queryKey: ["unique-holders", mint, boundPoolId],
    queryFn: () => {
      if (boundPoolId) return fetchLiveUniqueHolders(mint, boundPoolId, memechanClient, memechanClientV2);
    },
    refetchInterval: LIVE_POOL_HOLDERS_INTERVAL,
    staleTime: Infinity,
  });
}
