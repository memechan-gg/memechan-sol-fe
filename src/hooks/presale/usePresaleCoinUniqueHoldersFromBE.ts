import { BE_URL } from "@/common/solana";
import { MAX_HOLDERS_COUNT } from "@/config/config";
import { TokenApiHelper } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

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
  return useQuery({
    queryKey: ["be-holders-presale", memeMint],
    queryFn: () => (memeMint ? fetchPresaleCoinUniqueHoldersFromBE(memeMint) : undefined),
    enabled: !!memeMint,
  });
};
