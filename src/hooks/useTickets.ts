import { useConnection } from "@/context/ConnectionContext";
import { PoolStatus } from "@/types/pool";
import {
  MemeTicketClient,
  MemeTicketClientV2,
  MemechanClient,
  MemechanClientV2,
  getBoundPoolClientFromId,
  getLivePoolClientFromId,
} from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import useSWR from "swr";
import { getTicketsData } from "./utils";

const fetchTickets = async (
  poolAddress: string | null,
  user: PublicKey | null,
  client: MemechanClient,
  clientV2: MemechanClientV2,
  poolStatus: PoolStatus,
  livePoolAddress?: string | null,
) => {
  try {
    if (!poolAddress || !user) return;

    const version = await fetchVersion(poolAddress, poolStatus, client, clientV2, livePoolAddress);

    if (!version) return;

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

const fetchVersion = async (
  poolAddress: string,
  poolStatus: PoolStatus,
  memechanClient: MemechanClient,
  memechanClientV2: MemechanClientV2,
  livePoolAddress?: string | null,
): Promise<"V1" | "V2" | undefined> => {
  const poolAdressKey = poolStatus === "PRESALE" ? poolAddress : livePoolAddress || poolAddress;

  if (!poolAdressKey) return;

  console.count("fetch version");

  const pool =
    poolStatus === "PRESALE"
      ? await getBoundPoolClientFromId(new PublicKey(poolAddress), memechanClient, memechanClientV2)
      : await getLivePoolClientFromId(new PublicKey(poolAddress), memechanClient, memechanClientV2);

  return pool?.version as "V1" | "V2";
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

  const { data, mutate, isLoading } = useSWR(
    [`tickets-${poolAddress}`, poolAddress, publicKey, memechanClient, memechanClientV2, poolStatus, livePoolAddress],
    ([_, pool, user, client, clientV2, status, livePoolAddress]) =>
      fetchTickets(pool || null, user || null, client, clientV2, status, livePoolAddress),
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
