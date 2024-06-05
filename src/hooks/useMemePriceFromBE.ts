import { ChartApiInstance } from "@/common/solana";
import useSWR from "swr";
import { POOL_PRICE_INTERVAL } from "./refresh-intervals";

const fetchMemePriceFromBE = async (memeMint: string, poolType: "seedPool" | "livePool") => {
  try {
    const priceData = await ChartApiInstance.getPrice({ symbol: "USD", type: poolType, address: memeMint });

    return priceData.price;
  } catch (e) {
    console.error(`[fetchMemePriceFromBE] Failed to fetch meme price for pool ${poolType} ${memeMint}:`, e);
  }
};

export function useMemePriceFromBE({ memeMint, poolType }: { memeMint: string; poolType: "seedPool" | "livePool" }) {
  const { data: memePrice } = useSWR(
    [`price-${memeMint}`, memeMint, poolType],
    ([url, meme, type]) => fetchMemePriceFromBE(meme, type),
    { refreshInterval: POOL_PRICE_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return memePrice;
}
