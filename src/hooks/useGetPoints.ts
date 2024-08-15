import { useConnection } from "@/context/ConnectionContext";
import { getFormattedPointsBalance } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const fetchPointsBalance = async (walletAddress: PublicKey, connection: Connection) => {
  try {
    const formattedPointsBalance = await getFormattedPointsBalance(connection, walletAddress);

    return formattedPointsBalance;
  } catch (e) {
    console.error(`[fetchTokenAccounts] Cannot fetch points balance of ${walletAddress.toString()}:`, e);
  }
};

export function usePointsBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  return useQuery({
    queryKey: [`points-balance`, publicKey],
    queryFn: () => {
      if (publicKey) return fetchPointsBalance(publicKey, connection);
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
