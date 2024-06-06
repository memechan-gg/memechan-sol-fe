import { IS_LIVE_POOL_CREATED_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { StakingPoolClient } from "@avernikoz/memechan-sol-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchIsLivePoolCreated = async (memeMint: string, connection: Connection) => {
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
  const { connection } = useConnection();

  const { data: isLivePoolCreated, mutate } = useSWR(
    [`is-live-pool-created-${coin}`, coin, connection],
    ([url, memeMint, connection]) => fetchIsLivePoolCreated(memeMint, connection),
    { refreshInterval: IS_LIVE_POOL_CREATED_INTERVAL },
  );

  return {
    isLivePoolCreated,
    refetch: mutate,
  };
};
