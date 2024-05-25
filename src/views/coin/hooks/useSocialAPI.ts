import { SocialApiInstance } from "@/common/solana";
import { ThreadsResult } from "@avernikoz/memechan-sol-sdk";
import { useCallback, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { CoinThreadWithParsedMessage } from "../coin.types";
import { filterThreads } from "../comments/utils";

export function useSocialAPI({ coinType }: { coinType: string }) {
  const [threads, setThreads] = useState<CoinThreadWithParsedMessage[]>();

  const fetchCoinThreads = useCallback(
    async function () {
      if (!coinType) {
        return;
      }

      let threads: ThreadsResult | null = null;

      try {
        threads = await SocialApiInstance.getThreads({ coinType, direction: "asc", sortBy: "creationTime" });
      } catch (error) {}

      if (!threads) {
        return;
      }

      const filtredThreads = filterThreads(threads.result);

      setThreads(filtredThreads);
    },
    [coinType],
  );

  useEffect(() => {
    fetchCoinThreads();
  }, [coinType, fetchCoinThreads]);

  useInterval(fetchCoinThreads, 10000);

  return { threads, updateThreads: fetchCoinThreads };
}
