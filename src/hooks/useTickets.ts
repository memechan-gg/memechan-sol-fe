import { useConnection } from "@/context/ConnectionContext";
import { MemeTicketClient, MemechanClient } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { getTicketsData } from "./utils";

export const fetchTickets = async (poolAddress: string, user: PublicKey, client: MemechanClient) => {
  try {
    const tickets = await MemeTicketClient.fetchTicketsByUser(new PublicKey(poolAddress), client, user);
    return tickets;
  } catch (e) {
    console.error(`[fetchTickets] Cannot fetch tickets for pool ${poolAddress}:`, e);
  }
};

export function useTickets(poolAddress?: string, options?: { refreshInterval: number }) {
  const { publicKey } = useWallet();
  const { memechanClient } = useConnection();

  const { data, mutate } = useSWR(
    publicKey && poolAddress ? [`tickets-${poolAddress}`, poolAddress, publicKey, memechanClient] : null,
    ([url, pool, user, client]) => fetchTickets(pool, user, client),
    { refreshInterval: options?.refreshInterval, revalidateIfStale: false, revalidateOnFocus: false },
  );

  const ticketsData = getTicketsData(data);

  return {
    ...ticketsData,
    refresh: mutate,
  };
}
