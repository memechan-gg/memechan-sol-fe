import { BoundPool, BoundPoolClient } from "@avernikoz/memechan-sol-sdk";
import { useEffect, useState } from "react";
import { useMemePrice } from "./useMemePrice";

export function useMarketCap(
  args: { status: "PRESALE"; boundPoolInfo: BoundPool } | { status: "LIVE"; raydiumPoolAddress: string },
) {
  const { priceInQuote, priceInUsd } = useMemePrice(args);
  const [marketCap, setMarketCap] = useState<string | null>(null);

  useEffect(() => {
    const marketCap = BoundPoolClient.getMemeMarketCap({ memePriceInUsd: priceInUsd });
    setMarketCap(priceInUsd);
  }, [priceInUsd]);

  return marketCap;
}
