import { MemechanClientInstance } from "@/common/solana";
import { MEMECHAN_MEME_TOKEN_DECIMALS, MemeTicketClient, ParsedMemeTicket } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const fetchTickets = async (poolAddress: string, user: PublicKey) => {
  try {
    const tickets = await MemeTicketClient.fetchTicketsByUser(new PublicKey(poolAddress), MemechanClientInstance, user);
    return tickets;
  } catch (e) {
    console.error(`[fetchTickets] Cannot fetch tickets for pool ${poolAddress}:`, e);
  }
};

export function useTickets(poolAddress?: string) {
  const [tickets, setTickets] = useState<ParsedMemeTicket[]>([]);
  const [availableTickets, setAvailableTickets] = useState<ParsedMemeTicket[]>([]);
  const [unavailableTickets, setUnavailableTickets] = useState<ParsedMemeTicket[]>([]);
  const [stakedAmount, setStakedAmount] = useState<string>("0");
  const [availableTicketsAmount, setAvailableTicketsAmount] = useState<string>("0");
  const [unavailableTicketsAmount, setUnavailableTicketsAmount] = useState<string>("0");

  const { publicKey } = useWallet();
  const { data, mutate } = useSWR(
    publicKey && poolAddress ? [`tickets-${poolAddress}`, poolAddress, publicKey] : null,
    ([url, pool, user]) => fetchTickets(pool, user),
    { refreshInterval: 5000 },
  );

  useEffect(() => {
    mutate();
  }, [publicKey, mutate]);

  useEffect(() => {
    if (data) {
      setTickets(data);

      const currentTimestamp = Date.now();
      const availableTickets: ParsedMemeTicket[] = [];
      const unavailableTickets: ParsedMemeTicket[] = [];

      data.forEach((ticket) => {
        const unlockTicketTimestampInMs = new BigNumber(ticket.jsonFields.untilTimestamp).multipliedBy(1000).toNumber();

        if (currentTimestamp >= unlockTicketTimestampInMs) {
          availableTickets.push(ticket);
        } else {
          unavailableTickets.push(ticket);
        }
      });

      setAvailableTickets(availableTickets);
      setUnavailableTickets(unavailableTickets);

      const rawAvailableAmount = availableTickets.reduce(
        (amount: BigNumber, ticket) => amount.plus(ticket.jsonFields.amount),
        new BigNumber(0),
      );
      const formattedAvailableAmount = rawAvailableAmount.div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

      const rawUnavailableAmount = unavailableTickets.reduce(
        (amount: BigNumber, ticket) => amount.plus(ticket.jsonFields.amount),
        new BigNumber(0),
      );
      const formattedUnavailableAmount = rawUnavailableAmount.div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

      const ticketFields = data.map((ticket) => ticket.jsonFields);
      const stakedAmount = ticketFields
        .reduce((staked, { vesting: { notional, released } }) => {
          const rest = new BigNumber(notional).minus(released);
          return staked.plus(rest);
        }, new BigNumber(0))
        .toFixed(0);

      const formattedStakedAmount = new BigNumber(stakedAmount).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

      setAvailableTicketsAmount(formattedAvailableAmount);
      setUnavailableTicketsAmount(formattedUnavailableAmount);
      setStakedAmount(formattedStakedAmount);
    }
  }, [data]);

  return {
    tickets,
    stakedAmount,
    availableTicketsAmount,
    availableTickets,
    unavailableTicketsAmount,
    unavailableTickets,
    refresh: mutate,
  };
}
