import { PoolApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchSeedPoolByMeme = async (memeMint: string) => {
  try {
    const seedPoolData = await PoolApiInstance.getSeedPoolByTokenAddress(memeMint);

    return seedPoolData;
  } catch (e) {
    console.error(`[fetchSeedPoolByMeme] Failed to fetch seed pool data for meme mint ${memeMint}:`, e);
  }
};

export function useSeedPool(memeMint: string) {
  const { data } = useSWR([`seed-pool-${memeMint}`, memeMint], ([url, mint]) => fetchSeedPoolByMeme(mint));

  return data;
}
