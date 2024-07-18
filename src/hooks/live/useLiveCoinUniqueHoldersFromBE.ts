import { BE_URL } from "@/common/solana";
import { MAX_HOLDERS_COUNT } from "@/config/config";
import {  MEMECHAN_PROGRAM_ID, TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const fetchLiveCoinUniqueHoldersFromBE = async (memeMint: string, stakingPoolAddress: string) => {
  try {
    const [holders, stakingData] = await TokenApiHelper.getStakingPoolHoldersList(
      new PublicKey(memeMint),
      new PublicKey(stakingPoolAddress),
      new PublicKey(MEMECHAN_PROGRAM_ID),
      BE_URL,
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
  return useQuery({
    queryKey: ["be-holders-live", memeMint, stakingPoolAddress],
    queryFn: () =>
      memeMint && stakingPoolAddress ? fetchLiveCoinUniqueHoldersFromBE(memeMint, stakingPoolAddress) : undefined,
    enabled: !!memeMint && !!stakingPoolAddress,
  });
};
