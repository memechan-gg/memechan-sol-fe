import { BE_URL } from "@/common/solana";
import { BOUND_POOL_HOLDERS_INTERVAL, MAX_HOLDERS_COUNT } from "@/config/config";
import { TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import useSWR from "swr";

const fetchPresaleCoinUniqueHoldersFromBE = async (memeMint: string) => {
  try {
    const holdersMap = await TokenApiHelper.getBondingPoolHoldersMap(new PublicKey(memeMint), BE_URL);

    const holders = Array.from(holdersMap.values()).filter(({ amount }) => !new BigNumber(amount.toString()).isZero());

    const slicedHolders = holders.slice(0, MAX_HOLDERS_COUNT);

    return { holders: slicedHolders, fullHolders: holders };
  } catch (e) {
    console.error(
      `[fetchPresaleCoinUniqueHoldersFromBE] Cannot fetch bound pool holders from BE for meme ${memeMint}:`,
      e,
    );
  }
};

export const usePresaleCoinUniqueHoldersFromBE = (memeMint?: string) => {
  const { data } = useSWR(
    memeMint ? [`be-holders-${memeMint}`, memeMint] : null,
    ([url, meme]) => fetchPresaleCoinUniqueHoldersFromBE(meme),
    { refreshInterval: BOUND_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
};
