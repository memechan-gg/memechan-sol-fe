import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

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
  const { data: seedPool, isLoading } = useSWR(memeMint ? [`seed-pool-${memeMint}`, memeMint] : null, ([url, mint]) =>
    fetchSeedPoolByMeme(mint),
  );

  return { seedPool, isLoading };
}
