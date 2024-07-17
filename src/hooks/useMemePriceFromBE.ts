import { ChartApiInstance } from "@/common/solana";
import { POOL_PRICE_INTERVAL } from "@/config/config";
import { useQuery } from "@tanstack/react-query";

const fetchMemePriceFromBE = async (memeMint: string, poolType: "seedPool" | "livePool") => {
  try {
    const priceData = await ChartApiInstance.getPrice({ symbol: "USD", type: poolType, address: memeMint });

    return priceData.price;
  } catch (e) {
    console.error(`[fetchMemePriceFromBE] Failed to fetch meme price for pool ${poolType} ${memeMint}:`, e);
  }
};

export function useMemePriceFromBE({ memeMint, poolType }: { memeMint: string; poolType: "seedPool" | "livePool" }) {
  return useQuery({
    queryKey: [`price-${memeMint}`, memeMint, poolType],
    queryFn: () => fetchMemePriceFromBE(memeMint, poolType),
    refetchInterval: POOL_PRICE_INTERVAL,
    refetchOnWindowFocus: false,
  });
}
