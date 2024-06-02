import { connection } from "@/common/solana";
import { StakingPoolClient } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { IS_LIVE_POOL_CREATED_INTERVAL } from "../refresh-intervals";

const fetchIsLivePoolCreated = async (memeMint: string) => {
  try {
    const created = await StakingPoolClient.isAmmPoolIsCreated({ connection, memeMintPubkey: new PublicKey(memeMint) });

    return created;
  } catch (e) {
    console.error(
      `[fetchIsLivePoolCreated] Cannot fetch whether the live pool for the meme ${memeMint} is created:`,
      e,
    );
  }
};

export const useIsLivePoolCreated = (coin: string) => {
  const { data: isLivePoolCreated, mutate } = useSWR(
    [`is-live-pool-created-${coin}`, coin],
    ([url, memeMint]) => fetchIsLivePoolCreated(memeMint),
    { refreshInterval: IS_LIVE_POOL_CREATED_INTERVAL },
  );

  return {
    isLivePoolCreated,
    refetch: mutate,
  };
};
