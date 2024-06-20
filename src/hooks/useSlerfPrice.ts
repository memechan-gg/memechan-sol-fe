import { MAIN_TOKEN_PRICE_INTERVAL } from "@/config/config";
import { useEffect, useState } from "react";
import useSWR from "swr";

export type PriceData = {
  chainId: "solana";
  tokenAddress: "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3";
  timestamp: number;
  price: number;
  fecthedFrom: string;
};

const fetchSlerfPrice = async () => {
  try {
    const response = await fetch("https://price-api-eight.vercel.app/api/sol");
    const priceData: PriceData = await response.json();

    return priceData;
  } catch (e) {
    console.error("[fetchSlerfPrice] Cannot fetch the SLERF price:", e);
  }
};

export function useSlerfPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const { data: fetchedPrice } = useSWR("slerf-price", fetchSlerfPrice, {
    refreshInterval: MAIN_TOKEN_PRICE_INTERVAL,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (fetchedPrice) setPrice(fetchedPrice.price);
  }, [fetchedPrice]);

  return price;
}
