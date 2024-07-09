import { LIVE_POOL_PRICE_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getLivePoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { useSlerfPrice } from "../useSlerfPrice";

const fetchLiveMemePrice = async (
  slerfPriceInUsd: number,
  livePoolAddress: string,
  client: MemechanClient,
  clientV2: MemechanClientV2,
  connection: Connection,
) => {
  try {
    const prices = (
      await getLivePoolClientFromId(new PublicKey(livePoolAddress), client, clientV2)
    ).livePool.getMemePrice({ connection, poolAddress: livePoolAddress, quotePriceInUsd: slerfPriceInUsd });

    return prices;
  } catch (e) {
    console.error(`[fetchLiveMemePrice] Failed to fetch meme price for ${livePoolAddress}:`, e);
  }
};

export function useLiveMemePrice(raydiumPoolAddress: string) {
  const slerfPrice = useSlerfPrice();
  const { memechanClient, memechanClientV2, connection } = useConnection();

  const { data: memePrice } = useSWR(
    slerfPrice
      ? [`price-${raydiumPoolAddress}`, slerfPrice, raydiumPoolAddress, memechanClient, memechanClientV2, connection]
      : null,
    ([url, price, poolAddress, memechanClient, memechanClientV2]) =>
      fetchLiveMemePrice(price, poolAddress, memechanClient, memechanClientV2, connection),
    { refreshInterval: LIVE_POOL_PRICE_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return memePrice;
}
