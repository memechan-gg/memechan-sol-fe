import { connection } from "@/common/solana";
import { getWalletTokenAccount } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { TOKEN_ACCOUNTS_INTERVAL } from "./refresh-intervals";

const fetchTokenAccounts = async (publicKey: PublicKey) => {
  try {
    const walletTokenAccounts = await getWalletTokenAccount(connection, publicKey);

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
      refreshInterval: TOKEN_ACCOUNTS_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return { tokenAccounts, refetch: mutate };
}
