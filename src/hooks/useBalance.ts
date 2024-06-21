import { NATIVE_MINT_STRING } from "@/common/solana";
import { getMintBalanceFromTokenAccounts } from "@avernikoz/memechan-sol-sdk";
import { useSolanaBalance } from "./useSolanaBalance";
import { useTokenAccounts } from "./useTokenAccounts";

export const useBalance = (coin: string, decimals: number) => {
  const { tokenAccounts, refetch } = useTokenAccounts();
  const { balance: solanaBalance } = useSolanaBalance();
  const balance = tokenAccounts && getMintBalanceFromTokenAccounts({ mint: coin, tokenAccounts, decimals });

  return { balance: coin === NATIVE_MINT_STRING ? solanaBalance + "" : balance?.formattedBalance, refetch };
};
