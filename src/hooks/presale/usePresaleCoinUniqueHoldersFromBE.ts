import { TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { BOUND_POOL_HOLDERS_INTERVAL } from "../refresh-intervals";

const fetchPresaleCoinUniqueHoldersFromBE = async (boundPoolAddress: string) => {
  try {
    const holdersMap = await TokenApiHelper.getBondingPoolHoldersMap(new PublicKey(boundPoolAddress));

    return holdersMap;
  } catch (e) {
    console.error(
      `[fetchPresaleCoinUniqueHoldersFromBE] Cannot fetch bound pool holders from BE for pool ${boundPoolAddress}:`,
      e,
    );
  }
};

export const usePresaleCoinUniqueHoldersFromBE = (boundPoolAddress?: string) => {
  const { data } = useSWR(
    boundPoolAddress ? [`be-holders-${boundPoolAddress}`, boundPoolAddress] : null,
    ([url, address]) => fetchPresaleCoinUniqueHoldersFromBE(address),
    { refreshInterval: BOUND_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
};
