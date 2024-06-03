import { MemechanClientInstance } from "@/common/solana";
import { MemeTicketClient } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { TICKETS_INTERVAL } from "./refresh-intervals";
import { getTicketsData } from "./utils";

export const fetchTickets = async (poolAddress: string, user: PublicKey) => {
  try {
    const tickets = await MemeTicketClient.fetchTicketsByUser(new PublicKey(poolAddress), MemechanClientInstance, user);
    return tickets;
  } catch (e) {
    console.error(`[fetchTickets] Cannot fetch tickets for pool ${poolAddress}:`, e);
  }
};

export function useTickets(poolAddress?: string) {
  const { publicKey } = useWallet();
  const { data, mutate } = useSWR(
    publicKey && poolAddress ? [`tickets-${poolAddress}`, poolAddress, publicKey] : null,
    ([url, pool, user]) => fetchTickets(pool, user),
    { refreshInterval: TICKETS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  const ticketsData = getTicketsData(data);

  return {
    ...ticketsData,
    refresh: mutate,
  };
}
