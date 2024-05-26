import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchLivePool = async (memeMint: string) => {
  try {
    const livePool = await PoolApiInstance.getLivePoolByTokenAddress(memeMint);

    return livePool;
  } catch (e) {
    console.error(`[fetchLivePool] Failed to fetch the live pool for meme ${memeMint}:`, e);
  }
};

export function useLivePool(memeMint: string) {
  const { data: livePools } = useSWR([`live-pool-${memeMint}`, memeMint], ([url, meme]) => fetchLivePool(meme));

  return livePools;
}
