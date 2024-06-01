import { MemechanClientInstance } from "@/common/solana";
import { LivePoolClient } from "@avernikoz/memechan-sol-sdk";
import useSWR from "swr";
import { LIVE_POOL_PRICE_INTERVAL } from "../refresh-intervals";
import { useSlerfPrice } from "../useSlerfPrice";

const fetchLiveMemePrice = async (slerfPriceInUsd: number, livePoolAddress: string) => {
  try {
    const prices = await LivePoolClient.getMemePrice({
      connection: MemechanClientInstance.connection,
      poolAddress: livePoolAddress,
      quotePriceInUsd: slerfPriceInUsd,
    });

    return prices;
  } catch (e) {
    console.error(`[fetchLiveMemePrice] Failed to fetch meme price for ${livePoolAddress}:`, e);
  }
};

export function useLiveMemePrice(raydiumPoolAddress: string) {
  const slerfPrice = useSlerfPrice();

  const { data: memePrice } = useSWR(
    slerfPrice ? [`price-${raydiumPoolAddress}`, slerfPrice, raydiumPoolAddress] : null,
    ([url, price, poolAddress]) => fetchLiveMemePrice(price, poolAddress),
    { refreshInterval: LIVE_POOL_PRICE_INTERVAL },
  );

  return memePrice;
}
