import { TokenApiInstance } from "@/common/solana";
import { useQuery } from "@tanstack/react-query";

const fetchAllTokens = async () => {
  try {
    const allPresaleTokens = (
      await TokenApiInstance.queryTokens({
        status: "PRESALE",
        sortBy: "creationTime",
        direction: "asc",
      })
    ).result;

    const allLiveTokens = (
      await TokenApiInstance.queryTokens({
        status: "LIVE",
        sortBy: "creationTime",
        direction: "asc",
      })
    ).result;

    return [...allLiveTokens, ...allPresaleTokens];
  } catch (e) {
    console.error("[fetchAllTokens] Failed to fetch all tokens:", e);
  }
};

export function useTokens() {
  return useQuery({ queryKey: ["all-tokens"], queryFn: fetchAllTokens });
}
