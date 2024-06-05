import { getMintBalanceFromTokenAccounts } from "@avernikoz/memechan-sol-sdk";
import { useTokenAccounts } from "./useTokenAccounts";

export const useBalance = (coin: string, decimals: number) => {
  const { tokenAccounts, refetch } = useTokenAccounts();

  const balance = tokenAccounts && getMintBalanceFromTokenAccounts({ mint: coin, tokenAccounts, decimals });

  return { balance: balance?.formattedBalance, refetch };
};
