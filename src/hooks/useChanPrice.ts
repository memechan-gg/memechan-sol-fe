import { useQuery } from "@tanstack/react-query";

export type PriceData = {
  id: string;
  vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  timestamp: number;
  price: number;
  fecthedFrom: string;
  mintSymbol: string;
};

const fetchChanPrice = async () => {
  try {
    const response = await fetch("https://price.jup.ag/v6/price?ids=CHAN");
    const priceData = await response.json();

    return priceData.data.CHAN as PriceData;
  } catch (e) {
    console.error("[fetchChanPrice] Cannot fetch the CHAN price:", e);
  }
};

export function useChanPrice() {
  return useQuery({ queryKey: ["solana-price"], queryFn: fetchChanPrice, staleTime: Infinity });
}
