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

export function useMemePrice(
  args: { status: "PRESALE"; boundPoolInfo: BoundPool } | { status: "LIVE"; raydiumPoolAddress: string },
) {
  const { status } = args;
  const poolAddress = status === "PRESALE" ? args.boundPoolInfo.memeReserve.toJSON().mint : args.raydiumPoolAddress;
  const methodArgs = { status, poolData: status === "PRESALE" ? args.boundPoolInfo : args.raydiumPoolAddress } as
    | { status: "PRESALE"; poolData: BoundPool }
    | { status: "LIVE"; poolData: string };

  const slerfPrice = useSlerfPrice();
  const { data: memePrice } = useSWR(
    [
      `price-${poolAddress}`,
      {
        slerfPriceInUsd: slerfPrice,
        ...methodArgs,
      },
    ],
    ([url, args]) => fetchMemePrice(args),
  );

  const [priceData, setPriceData] = useState<{ priceInQuote: string; priceInUsd: string }>({
    priceInQuote: "0",
    priceInUsd: "0",
  });

  useEffect(() => {
    if (memePrice) setPriceData(memePrice);
  }, [memePrice]);

  return priceData;
}
