import { TOKEN_ACCOUNTS_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { getWalletTokenAccount } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchTokenAccounts = async (publicKey: PublicKey, connection: Connection) => {
  try {
    const walletTokenAccounts = await getWalletTokenAccount(connection, publicKey);

    return walletTokenAccounts;
  } catch (e) {
    console.error(`[fetchTokenAccounts] Cannot fetch token accounts of ${publicKey.toString()}:`, e);
  }
};

export function useTokenAccounts() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const { data: tokenAccounts, mutate } = useSWR(
    publicKey ? [`token-accounts`, publicKey, connection] : null,
    ([url, pubKey, connection]) => fetchTokenAccounts(pubKey, connection),
    {
      refreshInterval: TOKEN_ACCOUNTS_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return { tokenAccounts, refetch: mutate };
}
