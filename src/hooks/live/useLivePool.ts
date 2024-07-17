import { PoolApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

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
  return useQuery({
    queryKey: ["live-pool", memeMint],
    queryFn: () => (memeMint ? fetchLivePool(memeMint) : undefined),
    enabled: !!memeMint,
    staleTime: Infinity,
  });
}
