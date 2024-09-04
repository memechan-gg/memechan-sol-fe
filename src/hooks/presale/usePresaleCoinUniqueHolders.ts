import { MAX_HOLDERS_COUNT } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { getBoundPoolHolderPercentage } from "@/views/coin/sidebar/holders/utils";
import { MemechanClient, MemechanClientV2, getBoundPoolClientFromId } from "@kitakitsune/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

export const fetchPresaleCoinUniqueHolders = async (
  poolAddress: string,
  client: MemechanClient,
  clientV2: MemechanClientV2,
) => {
  try {
    const boundPoolInstance = (await getBoundPoolClientFromId(new PublicKey(poolAddress), client, clientV2))
      .boundPoolInstance;
    const map = await boundPoolInstance.getHoldersMap();
    const maxTicketTokens = boundPoolInstance.getMaxTicketTokens();

    const holders: { address: string; tokenAmountInPercentage: BigNumber }[] = [];

    Array.from(map.entries()).forEach(([holder, tickets]) => {
      const percentage = getBoundPoolHolderPercentage(tickets, maxTicketTokens);
      holders.push({ address: holder, tokenAmountInPercentage: new BigNumber(percentage) });
    });

    const sortedHolders = holders.sort(({ tokenAmountInPercentage: percentA }, { tokenAmountInPercentage: percentB }) =>
      percentB.minus(percentA).toNumber(),
    );

    const slicedHolders = sortedHolders.slice(0, MAX_HOLDERS_COUNT);

    return { slicedHolders, map };
  } catch (e) {
    console.error(`[fetchPresaleCoinUniqueHolders] Cannot fetch unique holders for pool ${poolAddress}:`, e);
  }
};

export function usePresaleCoinUniqueHolders(poolAddress: string) {
  const { memechanClient, memechanClientV2 } = useConnection();

  const { data, ...rest } = useQuery({
    queryKey: ["unique-holders", poolAddress],
    queryFn: () =>
      poolAddress ? fetchPresaleCoinUniqueHolders(poolAddress, memechanClient, memechanClientV2) : undefined,
  });
  return { ...data, holders: data?.slicedHolders, map: data?.map, ...rest };
}
