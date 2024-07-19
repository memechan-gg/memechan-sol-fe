import { useEffect, useState } from "react";
import useSWR from "swr";

export type PriceData = {
  chainId: "solana";
  tokenAddress: "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3";
  timestamp: number;
  price: number;
  fecthedFrom: string;
};

const fetchSolanaPrice = async () => {
  try {
    const response = await fetch("https://price.jup.ag/v6/price?ids=SOL");
    const priceData = await response.json();

    return priceData.data.SOL.price as number;
  } catch (e) {
    console.error("[fetchSolanafPrice] Cannot fetch the SLERF price:", e);
  }
};

export function useSolanaPrice() {
  const [price, setPrice] = useState<number | null>(null);

  const { data: fetchedPrice } = useSWR("solana-price", fetchSolanaPrice, {
    refreshInterval: 15000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (fetchedPrice) setPrice(fetchedPrice);
  }, [fetchedPrice]);

  return price;
}
