import { PoolApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

const fetchSeedPoolByMeme = async (memeMint: string) => {
  try {
    const seedPoolData = await PoolApiInstance.getSeedPoolByTokenAddress(memeMint);

    if (Object.keys(seedPoolData).length === 0) {
      return;
    }

    return seedPoolData;
  } catch (e) {
    console.error(`[fetchSeedPoolByMeme] Failed to fetch seed pool data for meme mint ${memeMint}:`, e);
  }
};

export function useSeedPool(memeMint?: string) {
  return useQuery({
    queryKey: ["seed-pool", memeMint],
    queryFn: () => (memeMint ? fetchSeedPoolByMeme(memeMint) : undefined),
    enabled: !!memeMint,
    staleTime: Infinity,
  });
}
