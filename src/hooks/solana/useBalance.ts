import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

export const useBalance = (coin: string) => {
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const publicKeyString = "5W22DiXpW1x4s2FKQpDpiai7BfCHzywcyiKWeYJjmwSx"; // Replace with your actual public key
  const publicKey = new PublicKey(publicKeyString);
  const connection = new Connection("https://api.devnet.solana.com/");

  const fetchBalanceData = useCallback(async () => {
    try {
      const balance = await connection.getBalance(publicKey);
      setBalance((balance / 1e9).toString()); // Convert lamports to SOL
    } catch (err) {
      setError("Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalanceData();
  }, [fetchBalanceData]);

  useInterval(fetchBalanceData, 5000);

  return {
    balance,
    refetch: fetchBalanceData,
  };
};
