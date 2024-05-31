import { loadBalancedConnection } from "@/common/solana";
import { BoundPoolClient, LivePoolClient } from "@avernikoz/memechan-sol-sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSlerfPrice } from "../useSlerfPrice";

const fetchLiveMemePrice = async (slerfPriceInUsd: number, livePoolAddress: string) => {
  try {
    const prices = await LivePoolClient.getMemePrice({
      connection: loadBalancedConnection,
      poolAddress: livePoolAddress,
      quotePriceInUsd: slerfPriceInUsd,
    });

    return prices;
  } catch (e) {
    console.error(`[fetchLiveMemePrice] Failed to fetch meme price for ${livePoolAddress}:`, e);
  }
};

export function useLiveMemePriceAndMCap(raydiumPoolAddress: string) {
  const slerfPrice = useSlerfPrice();
  const { data: memePrice } = useSWR(
    slerfPrice ? [`price-${raydiumPoolAddress}`, slerfPrice, raydiumPoolAddress] : null,
    ([url, price, poolAddress]) => fetchLiveMemePrice(price, poolAddress),
    { refreshInterval: 5000 },
  );

  const [priceData, setPriceData] = useState<{ priceInQuote: string; priceInUsd: string } | null>(null);
  const [marketCap, setMarketCap] = useState<string | null>(null);

  useEffect(() => {
    if (memePrice) {
      setPriceData(memePrice);

      const marketCap = (+BoundPoolClient.getMemeMarketCap({ memePriceInUsd: memePrice.priceInUsd })).toFixed(2);
      setMarketCap(marketCap);
    }
  }, [memePrice]);

  return { priceData, marketCap };
}
