import { LIVE_POOL_PRICE_INTERVAL, STALE_TIME } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { MemechanClient, MemechanClientV2, getLivePoolClientFromId } from "@avernikoz/memechan-sol-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
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
  const { data: slerf } = useSlerfPrice();
  const { memechanClient, memechanClientV2, connection } = useConnection();

  return useQuery({
    queryKey: [`price`, raydiumPoolAddress],
    queryFn: () => {
      if (slerf?.price && raydiumPoolAddress)
        return fetchLiveMemePrice(slerf.price, raydiumPoolAddress, memechanClient, memechanClientV2, connection);
      return undefined;
    },
    enabled: !!slerf?.price && !!raydiumPoolAddress,
    refetchOnWindowFocus: false,
    staleTime: STALE_TIME,
    refetchInterval: LIVE_POOL_PRICE_INTERVAL,
  });
}
