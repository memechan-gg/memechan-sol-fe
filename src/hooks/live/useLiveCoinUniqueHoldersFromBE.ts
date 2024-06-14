import { LIVE_POOL_HOLDERS_INTERVAL, MAX_HOLDERS_COUNT } from "@/config/config";
import { BE_URL_DEV, MEMECHAN_PROGRAM_ID, TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchLiveCoinUniqueHoldersFromBE = async (memeMint: string, stakingPoolAddress: string) => {
  try {
    const [holders, stakingData] = await TokenApiHelper.getStakingPoolHoldersList(
      new PublicKey(memeMint),
      new PublicKey(stakingPoolAddress),
      new PublicKey(MEMECHAN_PROGRAM_ID),
      BE_URL_DEV,
    );

    const slicedHolders = holders.slice(0, MAX_HOLDERS_COUNT);

    return { holders: slicedHolders, stakingData, fullHolders: holders };
  } catch (e) {
    console.error(
      `[fetchLiveCoinUniqueHoldersFromBE] Cannot fetch live pool holders from BE for staking pool ` +
        `${stakingPoolAddress} and meme ${memeMint}`,
      e,
    );
  }
};

export const useLiveCoinUniqueHoldersFromBE = (memeMint?: string, stakingPoolAddress?: string) => {
  const { data } = useSWR(
    memeMint && stakingPoolAddress
      ? [`be-holders-${memeMint}-${stakingPoolAddress}`, memeMint, stakingPoolAddress]
      : null,
    ([url, meme, stakingAddress]) => fetchLiveCoinUniqueHoldersFromBE(meme, stakingAddress),
    { refreshInterval: LIVE_POOL_HOLDERS_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return data;
};
