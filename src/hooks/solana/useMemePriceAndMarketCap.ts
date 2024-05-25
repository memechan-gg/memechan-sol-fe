import { MemechanClientInstance } from "@/common/solana";
import { BoundPool, BoundPoolClient, LivePoolClient } from "@avernikoz/memechan-sol-sdk";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSlerfPrice } from "./useSlerfPrice";

const fetchMemePrice = async ({
  slerfPriceInUsd,
  status,
  poolData,
}: { slerfPriceInUsd: number | null } & (
  | { status: "PRESALE"; poolData: BoundPool }
  | { status: "LIVE"; poolData: string }
)) => {
  if (slerfPriceInUsd === null) return;

  try {
    if (status === "PRESALE") {
      const prices = await BoundPoolClient.getMemePrice({ boundPoolInfo: poolData, quotePriceInUsd: slerfPriceInUsd });

      return prices;
    } else {
      const prices = await LivePoolClient.getMemePrice({
        connection: MemechanClientInstance.connection,
        poolAddress: poolData,
        quotePriceInUsd: slerfPriceInUsd,
      });

      return prices;
    }
  } catch (e) {
    const tokenMint = status === "PRESALE" ? poolData.memeReserve.toJSON().mint : poolData;
    console.error(`[fetchMemePrice] Failed to fetch meme price for ${status} ${tokenMint}:`, e);
  }
};

export function useMemePriceAndMarketCap(
  args: { status: "PRESALE"; boundPoolInfo: BoundPool | undefined } | { status: "LIVE"; raydiumPoolAddress: string },
) {
  const { status } = args;

  let poolAddress: string | undefined;
  let methodArgs: { status: "PRESALE"; poolData: BoundPool } | { status: "LIVE"; poolData: string } | undefined;

  if (status === "PRESALE" && args.boundPoolInfo) {
    poolAddress = args.boundPoolInfo.memeReserve.toJSON().mint;
    methodArgs = { status: "PRESALE", poolData: args.boundPoolInfo };
  } else if (status === "LIVE") {
    poolAddress = args.raydiumPoolAddress;
    methodArgs = { status: "LIVE", poolData: args.raydiumPoolAddress };
  }

  const slerfPrice = useSlerfPrice();
  const { data: memePrice } = useSWR(
    poolAddress && methodArgs
      ? [
          `price-${poolAddress}`,
          {
            slerfPriceInUsd: slerfPrice,
            ...methodArgs,
          },
        ]
      : null,
    ([url, args]) => fetchMemePrice(args),
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
