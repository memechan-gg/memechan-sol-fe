import { LIVE_POOL_PRICE_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getLivePoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { useSlerfPrice } from "../useSlerfPrice";
import { useSolanaPrice } from "../useSolanaPrice";

const fetchLiveMemePrice = async (
  slerfPriceInUsd: number,
  livePoolAddress: string,
  client: MemechanClient,
  clientV2: MemechanClientV2,
  connection: Connection,
  solPrice: number,
) => {
  try {
    const pool = await getLivePoolClientFromId(new PublicKey(livePoolAddress), client, clientV2);

    const prices = await pool.livePool.getMemePrice({
      connection,
      poolAddress: livePoolAddress,
      quotePriceInUsd: pool.version === "V2" ? solPrice : slerfPriceInUsd,
    });

    if (pool.version === "V2") {
      prices.priceInUsd = (+prices.priceInUsd / 10_000).toString();
    }

    return prices;
  } catch (e) {
    console.error(`[fetchLiveMemePrice] Failed to fetch meme price for ${livePoolAddress}:`, e);
  }
};

export function useLiveMemePrice(poolAddress?: string, enabled: boolean = true) {
  const slerfPrice = useSlerfPrice();
  const solanaPrice = useSolanaPrice();

  const { memechanClient, memechanClientV2, connection } = useConnection();

  return useSWR(
    slerfPrice && solanaPrice && poolAddress && enabled
      ? [`price-${poolAddress}`, slerfPrice, poolAddress, memechanClient, memechanClientV2, connection, solanaPrice]
      : null,
    ([url, price, poolAddress, memechanClient, memechanClientV2, connection, solPrice]) =>
      fetchLiveMemePrice(price, poolAddress, memechanClient, memechanClientV2, connection, solPrice),
    { refreshInterval: LIVE_POOL_PRICE_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );
}
