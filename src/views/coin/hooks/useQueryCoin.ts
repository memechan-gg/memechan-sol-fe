import { COIN_METADATA } from "@/types/coin";
import { PoolResponse } from "@/types/pool";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInterval } from "usehooks-ts";
import { UseQueryCoinParams } from "../coin.types";

export function useQueryCoin({ coinType }: UseQueryCoinParams) {
  const [coinMetadata, setCoinMetadata] = useState<COIN_METADATA | null>(null);
  const [poolData, setPoolData] = useState<PoolResponse | null>(null);
  const router = useRouter();

  async function fetchCoinMetadata() {
    {
      if (!coinType && router.isReady) {
        toast.error("Coin Type not found");
        router.push("/");
        return;
      }

      if (!coinType) return;

      let presaleRes: COIN_METADATA | null = null;
      let liveRes: COIN_METADATA | null = null;

      try {
        //presaleRes = await CoinAPIInstance.getCoin("PRESALE", coinType);
      } catch (presaleError) {}

      try {
        //liveRes = await CoinAPIInstance.getCoin("LIVE", coinType);
      } catch (liveError) {}

      if (!presaleRes && !liveRes) {
        console.error("Failed to fetch coin metadata");
        // Redirect to home page if coin not found, or if there was an error fetching the coin
        toast.error(`Coin Metadata not found`);
        router.push("/");
      }

      if (liveRes && coinMetadata !== null && liveRes === coinMetadata) {
        return;
      }

      if (presaleRes && coinMetadata !== null && presaleRes === coinMetadata) {
        return;
      }

      if (liveRes) {
        setCoinMetadata(liveRes);
      } else {
        setCoinMetadata(presaleRes);
      }
    }
  }

  async function fetchPoolData() {
    if (!coinMetadata) return;

    try {
      /*
      const pool = await PoolAPIInstance.getSeedPoolByCoinType(coinMetadata.type);
      setPoolData(pool);*/
    } catch (error) {
      console.error("Failed to fetch pool data:", error);
      // Redirect to home page if pool not found, or if there was an error fetching the pool
      toast.error(`Coin Pool Data not found: ${coinMetadata.symbol}`);
      router.push("/");
    }
  }

  useEffect(() => {
    fetchCoinMetadata();
  }, [router, coinType]);

  useEffect(() => {
    fetchPoolData();
  }, [coinMetadata]);

  useInterval(() => {
    fetchCoinMetadata();
  }, 2000);

  return {
    coinMetadata,
    poolData,
  };
}
