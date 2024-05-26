import { BoundPool, BoundPoolClient } from "@avernikoz/memechan-sol-sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSlerfPrice } from "../useSlerfPrice";

const fetchPresaleMemePrice = async (slerfPriceInUsd: number, boundPoolInfo: BoundPool) => {
  try {
    const prices = await BoundPoolClient.getMemePrice({ boundPoolInfo, quotePriceInUsd: slerfPriceInUsd });

    return prices;
  } catch (e) {
    const tokenMint = boundPoolInfo.memeReserve.toJSON().mint;
    console.error(`[fetchPresaleMemePrice] Failed to fetch meme price for ${tokenMint}:`, e);
  }
};

export function usePresaleMemePriceAndMCap(boundPoolInfo: BoundPool | undefined) {
  const poolAddress: string | undefined = boundPoolInfo?.memeReserve.toJSON().mint;

  const slerfPrice = useSlerfPrice();
  const { data: memePrice } = useSWR(
    poolAddress && boundPoolInfo && slerfPrice ? [`price-${poolAddress}`, slerfPrice, boundPoolInfo] : null,
    ([url, price, pool]) => fetchPresaleMemePrice(price, pool),
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
