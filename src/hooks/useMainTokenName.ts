import { useConnection } from "@/context/ConnectionContext";
import { LivePoolClient } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";

export const useMainTokenName = () => {
  const { publicKey } = useWallet();
  const { connection, memechanClient } = useConnection();

  const mainTokenName = publicKey ? LivePoolClient.getQuoteTokenDisplayName(publicKey, memechanClient) : "";

  return mainTokenName;
};
