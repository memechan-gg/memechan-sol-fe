import { BALANCE_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";

export const useSolanaBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const { data: balance } = useSWR(
    publicKey ? [`solana-balance/${publicKey}`, publicKey, connection] : null,
    async ([_, publicKey, connection]) => {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    },
    {
      refreshInterval: BALANCE_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  return balance;
};
