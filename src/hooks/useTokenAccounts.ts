import { loadBalancedConnection } from "@/common/solana";
import { getWalletTokenAccount } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchTokenAccounts = async (publicKey: PublicKey) => {
  try {
    const walletTokenAccounts = await getWalletTokenAccount(loadBalancedConnection, publicKey);

    return walletTokenAccounts;
  } catch (e) {
    console.error(`[fetchTokenAccounts] Cannot fetch token accounts of ${publicKey.toString()}:`, e);
  }
};

export function useTokenAccounts() {
  const { publicKey } = useWallet();
  const { data: tokenAccounts, mutate } = useSWR(
    publicKey ? [`token-accounts`, publicKey] : null,
    ([url, pubKey]) => fetchTokenAccounts(pubKey),
    {
      refreshInterval: 10_000,
    },
  );

  return { tokenAccounts, refetch: mutate };
}
