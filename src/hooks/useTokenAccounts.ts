import { TOKEN_ACCOUNTS_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { getWalletTokenAccount } from "memechan-sol-sdk";

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

  return useQuery({
    queryKey: [`token-accounts`, publicKey],
    queryFn: () => {
      if (publicKey) return fetchTokenAccounts(publicKey, connection);
    },
    refetchInterval: TOKEN_ACCOUNTS_INTERVAL,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
