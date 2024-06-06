import { ChartApiInstance } from "@/common/solana";
import { BOUND_POOL_PRICE_INTERVAL } from "@/config/config";
import useSWR from "swr";

const fetchPresaleMemePrice = async (poolAddress: string) => {
  try {
    const priceData = await ChartApiInstance.getPrice({ symbol: "USD", type: "seedPool", address: poolAddress });

    return priceData.price;
  } catch (e) {
    console.error(`[fetchPresaleMemePrice] Failed to fetch meme price for bound pool ${poolAddress}:`, e);
  }
};

export function usePresaleMemePrice(boundPoolAddress?: string) {
  const { data: memePrice } = useSWR(
    boundPoolAddress ? [`price-${boundPoolAddress}`, boundPoolAddress] : null,
    ([url, pool]) => fetchPresaleMemePrice(pool),
    { refreshInterval: BOUND_POOL_PRICE_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return memePrice;
}
