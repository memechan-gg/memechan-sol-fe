import { useQuery } from "@tanstack/react-query";

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

    return priceData.data.SOL as PriceData;
  } catch (e) {
    console.error("[fetchSolanafPrice] Cannot fetch the SLERF price:", e);
  }
};

export function useSolanaPrice() {
  return useQuery({ queryKey: ["solana-price"], queryFn: fetchSolanaPrice });
}
