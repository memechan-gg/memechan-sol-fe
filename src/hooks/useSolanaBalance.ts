import { BALANCE_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

export const useSolanaBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: [[`solana-balance`, publicKey]],
    queryFn: async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Convert lamports to SOL
      }
    },
    enabled: !!publicKey,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchInterval: BALANCE_INTERVAL,
  });
};
