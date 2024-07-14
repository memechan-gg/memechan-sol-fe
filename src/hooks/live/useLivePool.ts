import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchLivePool = async (memeMint: string) => {
  if (!memeMint) {
    return undefined;
  }
  try {
    const livePool = await PoolApiInstance.getLivePoolByTokenAddress(memeMint);

    if (Object.keys(livePool).length === 0) {
      return;
    }

    return livePool;
  } catch (e) {
    console.error(`[fetchLivePool] Failed to fetch the live pool for meme ${memeMint}:`, e);
  }
};

export function useLivePool(memeMint?: string) {
  const { data: livePool, isLoading } = useSWR(
    memeMint ? [`live-pool-${memeMint}`, memeMint] : null,
    ([url, meme]) => fetchLivePool(meme),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return { livePool, isLoading };
}
