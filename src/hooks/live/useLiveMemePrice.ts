import { LIVE_POOL_PRICE_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { LivePoolClient } from "@avernikoz/memechan-sol-sdk";
import { Connection } from "@solana/web3.js";
import useSWR from "swr";
import { useSlerfPrice } from "../useSlerfPrice";

const fetchLiveMemePrice = async (slerfPriceInUsd: number, livePoolAddress: string, connection: Connection) => {
  try {
    const prices = await LivePoolClient.getMemePrice({
      connection,
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
  const { connection } = useConnection();

  const { data: memePrice } = useSWR(
    slerfPrice ? [`price-${raydiumPoolAddress}`, slerfPrice, raydiumPoolAddress, connection] : null,
    ([url, price, poolAddress, connection]) => fetchLiveMemePrice(price, poolAddress, connection),
    { refreshInterval: LIVE_POOL_PRICE_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return memePrice;
}
