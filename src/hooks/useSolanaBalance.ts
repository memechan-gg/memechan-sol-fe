import { useConnection } from "@/context/ConnectionContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";

export const useSolanaBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = useCallback(
    () => async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    },
    [connection, publicKey],
  );
  useEffect(() => {
    fetchBalance();
  }, [connection, fetchBalance, publicKey]);

  return { balance, refetch: fetchBalance };
};
