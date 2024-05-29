import { TokenApiInstance } from "@/common/solana";
import useSWR from "swr";

const fetchToken = async (tokenAddress: string) => {
  try {
    const presaleToken = await TokenApiInstance.getToken("PRESALE", tokenAddress);

    if (presaleToken && Object.keys(presaleToken).length > 0) {
      return presaleToken;
    }

    const liveToken = await TokenApiInstance.getToken("LIVE", tokenAddress);

    if (liveToken && Object.keys(liveToken).length > 0) {
      return liveToken;
    }

    return null;
  } catch (e) {
    console.error(`[fetchToken] Failed to fetch token ${tokenAddress}:`, e);
  }
};

export function useToken(tokenAddress: string) {
  const { data: token, isLoading } = useSWR([`token-${tokenAddress}`, tokenAddress], ([url, token]) =>
    fetchToken(token),
  );

  return { token, isLoading };
}
