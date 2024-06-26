import { LIVE_POOL_HOLDERS_INTERVAL, MAX_HOLDERS_COUNT } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getStakingPoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchLiveUniqueHolders = async (
  mint: string,
  boundPoolId: string,
  client: MemechanClient,
  clientV2: MemechanClientV2,
) => {
  try {
    const stakingPool = await getStakingPoolClientFromId(new PublicKey(boundPoolId), client, clientV2);
    const [holders, stakingData] = await stakingPool.getHoldersList();

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

  const { data } = useSWR(
    boundPoolId ? [`unique-holders-${boundPoolId}-${mint}`, mint, boundPoolId, memechanClient, memechanClientV2] : null,
    ([_, meme, pool, client, clientV2]) => fetchLiveUniqueHolders(meme, pool, client, clientV2),
    { refreshInterval: LIVE_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
}
