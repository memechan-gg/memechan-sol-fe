import { useConnection } from "@/context/ConnectionContext";
import { PoolStatus } from "@/types/pool";
import { MemeTicketClient, MemechanClient } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import useSWR from "swr";
import { getTicketsData } from "./utils";

export const fetchTickets = async (
  poolAddress: string,
  user: PublicKey,
  client: MemechanClient,
  poolStatus: PoolStatus,
) => {
  try {
    const tickets = await MemeTicketClient.fetchTicketsByUser2(new PublicKey(poolAddress), client, user);
    return tickets;
  } catch (e) {
    console.error(`[fetchTickets] Cannot fetch tickets for ${poolAddress} pool ${poolAddress}:`, e);

    const ticketsValue = poolStatus === "PRESALE" ? "available tickets" : "staked meme coins";
    toast.error(`Failed to get your ${ticketsValue}. Please, try to refresh the page`);
    return [];
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
  const { memechanClient } = useConnection();

  const { data, mutate } = useSWR(
    publicKey && poolAddress ? [`tickets-${poolAddress}`, poolAddress, publicKey, memechanClient, poolStatus] : null,
    ([url, pool, user, client, status]) => fetchTickets(pool, user, client, status),
    {
      refreshInterval,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const ticketsData = getTicketsData(data);

  return {
    ...ticketsData,
    refresh: mutate,
  };
}
