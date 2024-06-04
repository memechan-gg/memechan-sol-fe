import { TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { MAX_HOLDERS_COUNT } from "../config";
import { LIVE_POOL_HOLDERS_INTERVAL } from "../refresh-intervals";

const fetchLiveCoinUniqueHoldersFromBE = async (livePoolAddress: string, stakingPoolAddress: string) => {
  try {
    const [holders, stakingData] = await TokenApiHelper.getStakingPoolHoldersList(
      new PublicKey(livePoolAddress),
      new PublicKey(stakingPoolAddress),
    );

    const fullHolders = holders.slice();

    const sortedHolders = holders.sort(({ tokenAmount: amountA }, { tokenAmount: amountB }) =>
      amountB.minus(amountA).toNumber(),
    );

    const slicedHolders = sortedHolders.slice(0, MAX_HOLDERS_COUNT);

    return { holders: slicedHolders, stakingData, fullHolders };
  } catch (e) {
    console.error(
      `[fetchLiveCoinUniqueHoldersFromBE] Cannot fetch live pool holders from BE for staking pool ` +
        `${stakingPoolAddress} and live pool ${livePoolAddress}:`,
      e,
    );
  }
};

export const useLiveCoinUniqueHoldersFromBE = (livePoolAddress?: string, stakingPoolAddress?: string) => {
  const { data } = useSWR(
    livePoolAddress && stakingPoolAddress
      ? [`be-holders-${livePoolAddress}-${stakingPoolAddress}`, livePoolAddress, stakingPoolAddress]
      : null,
    ([url, liveAddress, stakingAddress]) => fetchLiveCoinUniqueHoldersFromBE(liveAddress, stakingAddress),
    { refreshInterval: LIVE_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
};
