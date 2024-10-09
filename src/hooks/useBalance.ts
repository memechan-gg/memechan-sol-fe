import { NATIVE_MINT_STRING } from "@/common/solana";
import { getMintBalanceFromTokenAccounts } from "@rinegade/memechan-sol-sdk";
import { useSolanaBalance } from "./useSolanaBalance";
import { useTokenAccounts } from "./useTokenAccounts";

export const useBalance = (coin: string, decimals: number) => {
  const tokenData = useTokenAccounts();

  const { data: solanaBalance, isLoading: isSolanaBalanceLoading, isRefetching } = useSolanaBalance();

  const balance =
    tokenData.data && getMintBalanceFromTokenAccounts({ mint: coin, tokenAccounts: tokenData.data, decimals });

  return {
    balance: coin === NATIVE_MINT_STRING ? solanaBalance + "" : balance?.formattedBalance,
    refetch: tokenData.refetch,
    isLoading: tokenData.isLoading || isSolanaBalanceLoading,
    isRefetching: tokenData.isRefetching || isRefetching,
  };
};
