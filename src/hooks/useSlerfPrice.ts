import { SLERF_PRICE_INTERVAL } from "@/config/config";
import { useQuery } from "@tanstack/react-query";

export type PriceData = {
  chainId: "solana";
  tokenAddress: "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3";
  timestamp: number;
  price: number;
  fecthedFrom: string;
};

const fetchSlerfPrice = async () => {
  try {
    const response = await fetch("https://price-api-eight.vercel.app/api/slerf");
    const priceData: PriceData = await response.json();

    return priceData;
  } catch (e) {
    console.error("[fetchSlerfPrice] Cannot fetch the SLERF price:", e);
  }
};

export function useSlerfPrice() {
  return useQuery({
    queryKey: ["slerf-price"],
    queryFn: fetchSlerfPrice,
    refetchInterval: SLERF_PRICE_INTERVAL,
    refetchOnWindowFocus: false,
  });
}
