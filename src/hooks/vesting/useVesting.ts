import { VESTING_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { VestingClient } from "memechan-sol-sdk";

const fetchVesting = async (user: PublicKey, connection: Connection) => {
  try {
    const vesting = await VestingClient.fetchVestingByUser({ user, connection });

    return vesting;
  } catch (e) {
    console.error(`[fetchVesting] Failed to fetch vesting for user ${user.toString()}:`, e);
  }
};

export const useVesting = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const data = useQuery({
    queryKey: [`vesting`, publicKey],
    queryFn: () => (publicKey ? fetchVesting(publicKey, connection) : undefined),
    enabled: !!publicKey,
    staleTime: Infinity,
    refetchInterval: VESTING_INTERVAL,
  });

  return { ...data, vesting: data.data, connected };
};
