import { useConnection } from "@/context/ConnectionContext";
import { PoolStatus } from "@/types/pool";
import {
  MemeTicketClient,
  MemeTicketClientV2,
  MemechanClient,
  MemechanClientV2,
  getBoundPoolClientFromId,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import useSWR from "swr";
import { getTicketsData } from "./utils";

export const fetchTickets = async (
  poolAddress: string,
  user: PublicKey,
  client: MemechanClient,
  clientV2: MemechanClientV2,
  poolStatus: PoolStatus,
) => {
  try {
    const boundPool = await getBoundPoolClientFromId(new PublicKey(poolAddress), client, clientV2);
    
    const ticketsData = await (boundPool.version === 'V1' ? MemeTicketClient : MemeTicketClientV2).fetchTicketsByUser2(new PublicKey(poolAddress), (boundPool.version === 'V1' ? client : clientV2) as any, user);
    return ticketsData;
  } catch (e) {
    console.error(`[fetchTickets] Cannot fetch tickets for ${poolAddress} pool ${poolAddress}:`, e);

    const ticketsValue = poolStatus === "PRESALE" ? "available tickets" : "staked memecoins";
    toast.error(`Failed to get your ${ticketsValue}. Please, try to refresh the page`);
    return { tickets: [], freeIndexes: [], lockedIndexes: [] };
  }
};

export function useTickets({
  poolAddress,
  refreshInterval,
  poolStatus,
}: {
  poolAddress?: string;
  refreshInterval?: number;
  poolStatus: PoolStatus;
}) {
  const { publicKey } = useWallet();
  const { memechanClient, memechanClientV2 } = useConnection();

  const { data, mutate } = useSWR(
    publicKey && poolAddress
      ? [`tickets-${poolAddress}`, poolAddress, publicKey, memechanClient, memechanClientV2, poolStatus]
      : null,
    ([url, pool, user, client, clientV2, status]) => fetchTickets(pool, user, client, clientV2, status),
    {
      refreshInterval,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const ticketsData = getTicketsData(data?.tickets);

  return {
    ...ticketsData,
    freeIndexes: data?.freeIndexes,
    lockedIndexes: data?.lockedIndexes,
    refresh: mutate,
  };
}
