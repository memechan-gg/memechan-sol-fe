import { MemechanClientInstance } from "@/common/solana";
import { MEMECHAN_MEME_TOKEN_DECIMALS, MemeTicketClient, ParsedMemeTicket } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const fetchAvailableTickets = async (poolAddress: string, user: PublicKey) => {
  try {
    const { availableAmount, tickets } = await MemeTicketClient.fetchAvailableTicketsByUser(
      new PublicKey(poolAddress),
      MemechanClientInstance,
      user,
    );

    const formattedAmount = new BigNumber(availableAmount).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

    return { amount: formattedAmount, tickets };
  } catch (e) {
    console.error(`[fetchUniqueHolders] Cannot fetch unique holders for pool ${poolAddress}:`, e);
  }
};

export function useAvailableTickets(poolAddress: string) {
  const [availableTickets, setAvailableTickets] = useState<string>("0");
  const [tickets, setTickets] = useState<ParsedMemeTicket[]>([]);

  const { publicKey } = useWallet();
  const { data, mutate } = useSWR(
    publicKey ? [`available-tickets-${poolAddress}`, poolAddress, publicKey] : null,
    ([url, pool, user]) => fetchAvailableTickets(pool, user),
  );

  useEffect(() => {
    mutate();
  }, [publicKey, mutate]);

  useEffect(() => {
    if (data) {
      setAvailableTickets(data.amount);
      setTickets(data.tickets);
    }
  }, [data]);

  return { availableTickets, tickets };
}
