import { ChartApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

const fetchPresaleMemePrice = async (poolAddress: string) => {
  try {
    const priceData = await ChartApiInstance.getPrice({ symbol: "USD", type: "seedPool", address: poolAddress });

    return priceData.price;
  } catch (e) {
    console.error(`[fetchPresaleMemePrice] Failed to fetch meme price for bound pool ${poolAddress}:`, e);
  }
};

export function usePresaleMemePrice(boundPoolAddress?: string) {
  return useQuery({
    queryKey: ["price", "presale", boundPoolAddress],
    queryFn: () => (boundPoolAddress ? fetchPresaleMemePrice(boundPoolAddress) : undefined),
    enabled: !!boundPoolAddress,
    staleTime: Infinity,
  });
}
