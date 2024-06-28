import { TokenApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchAllTokens = async () => {
  try {
    const allPresaleTokens: any = (
      await TokenApiInstance.queryTokens({
        status: "PRESALE",
        sortBy: "creationTime",
        direction: "asc",
      })
    ).result;

    const allLiveTokens: any = (
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
  const { data: tokens } = useSWR("all-tokens", fetchAllTokens);

  return tokens;
}
