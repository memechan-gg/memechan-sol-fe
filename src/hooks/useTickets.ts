import { useConnection } from "@/context/ConnectionContext";
import { PoolStatus } from "@/types/pool";
import { MemechanClient, MemechanClientV2, MemeTicketClient, MemeTicketClientV2 } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import useSWR from "swr";
import { usePoolVersion, PoolVersion } from "./usePoolVersion";
import { getTicketsData } from "./utils";

const fetchTickets = async (
  poolAddress: string | null,
  user: PublicKey | null,
  client: MemechanClient,
  clientV2: MemechanClientV2,
  poolStatus: PoolStatus,
  version: PoolVersion,
) => {
  try {
    if (!poolAddress || !user || !poolStatus || !version) return;

    if (version === "V2") {
      const ticketsData = await MemeTicketClientV2.fetchTicketsByUser2(new PublicKey(poolAddress), clientV2, user);
      return ticketsData;
    }
    const ticketsData = await MemeTicketClient.fetchTicketsByUser2(new PublicKey(poolAddress), client, user);
    return ticketsData;
  } catch (e) {
    console.error(`[fetchTickets] Cannot fetch tickets for ${user} pool ${poolAddress}:`, e);

    const ticketsValue = poolStatus === "PRESALE" ? "available tickets" : "staked memecoins";
    toast.error(`Failed to get your ${ticketsValue}. Please, try to refresh the page`);
    return { tickets: [], freeIndexes: [], lockedIndexes: [] };
  }
};

export function useTickets({
  poolAddress,
  refreshInterval,
  poolStatus,
  livePoolAddress,
}: {
  poolAddress?: string;
  refreshInterval?: number;
  poolStatus: PoolStatus;
  livePoolAddress?: string;
}) {
  const { publicKey } = useWallet();
  const { memechanClient, memechanClientV2 } = useConnection();
  const version = usePoolVersion(poolStatus, poolAddress, livePoolAddress);
  const shouldFetch = !poolAddress || !publicKey || !poolStatus || !version;

  const { data, mutate, isLoading } = useSWR(
    shouldFetch
      ? [`tickets-${poolAddress}`, poolAddress, publicKey, memechanClient, memechanClientV2, poolStatus, version]
      : null,
    ([_, pool, user, client, clientV2, status, version]) =>
      fetchTickets(pool || null, user || null, client, clientV2, status, version),
    {
      refreshInterval,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const ticketsData = getTicketsData(data?.tickets);

  return {
    ...ticketsData,
    isLoading: isLoading,
    freeIndexes: data?.freeIndexes,
    lockedIndexes: data?.lockedIndexes,
    refresh: mutate,
  };
}
