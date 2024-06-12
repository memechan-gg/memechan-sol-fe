import { VESTING_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { VestingClient } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";

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

  const { data, mutate, isLoading } = useSWR(
    publicKey ? [`vesting`, publicKey, connection] : null,
    ([url, pubkey, connection]) => fetchVesting(pubkey, connection),
    { revalidateIfStale: false, revalidateOnFocus: false, refreshInterval: VESTING_INTERVAL },
  );

  return { vesting: data, refresh: mutate, connected, isLoading };
};
