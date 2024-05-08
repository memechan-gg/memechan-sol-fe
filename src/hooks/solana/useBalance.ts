import { MEME_COIN_DECIMALS } from "@/constants/coin";
import { getCoinsAndNormalizeWithDecimals } from "@/utils";
import { useCallback, useState } from "react";
import { useInterval } from "usehooks-ts";

export const useBalance = (coin: string) => {
  const [balance, setBalance] = useState("0");
  const account = useCurrentAccount();
  const provider = useSuiClient();

  const fetchBalanceData = useCallback(() => {
    if (!account || !provider) return;

    getCoinsAndNormalizeWithDecimals({
      address: account.address,
      provider,
      coin,
      decimals: MEME_COIN_DECIMALS,
    })
      .then((data) => {
        setBalance(data.formatted);
      })
      .catch((error) => {
        console.error("Failed to fetch balance data:", error);
      });
  }, [account, provider, coin]);

  useInterval(fetchBalanceData, 5000);

  return {
    balance,
    refetch: fetchBalanceData,
  };
};
