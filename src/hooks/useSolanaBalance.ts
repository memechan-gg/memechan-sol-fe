import { useConnection } from "@/context/ConnectionContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export const useSolanaBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    };

    fetchBalance();
  }, [connection, publicKey]);

  return balance;
};
