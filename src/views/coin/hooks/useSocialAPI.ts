import { SocialApiInstance } from "@/common/solana";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInterval } from "usehooks-ts";
import { CoinThreadWithParsedMessage } from "../coin.types";
import { filterThreads } from "../comments-tab/comments/utils";

export function useSocialAPI({ coinType }: { coinType: string }) {
  const [threads, setThreads] = useState<CoinThreadWithParsedMessage[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>();
  const [loadedMore, setLoadedMore] = useState<boolean>(false);

  const fetchCoinThreads = useCallback(async () => {
    try {
      const { result, paginationToken } = await SocialApiInstance.getThreads({
        coinType,
        direction: "asc",
        sortBy: "creationTime",
      });

      const filtredThreads = filterThreads(result);

      setNextPageToken(paginationToken ?? null);
      setThreads(filtredThreads);
    } catch (e) {
      console.error(`[fetchCoinThreads] Failed to fetch threads for coin ${coinType}:`, e);
    }
  }, [coinType]);

  // The `load more` button click handler
  const loadMore = useCallback(async () => {
    if (!loadedMore) {
      setLoadedMore(true);
      toast("Disabled auto comments update. Reload page to turn it back");
    }

    try {
      const { result, paginationToken } = await SocialApiInstance.getThreads({
        coinType,
        direction: "asc",
        sortBy: "creationTime",
        paginationToken: nextPageToken,
      });

      const filtredThreads = filterThreads(result);

      setNextPageToken(paginationToken ?? null);
      setThreads((prevThreads) => (prevThreads ? [...prevThreads, ...filtredThreads] : filtredThreads));
    } catch (e) {
      console.error(`[fetchCoinThreads] Failed to fetch threads for coin ${coinType}:`, e);
    }
  }, [loadedMore, coinType, nextPageToken]);

  useEffect(() => {
    fetchCoinThreads();
  }, [fetchCoinThreads]);

  useInterval(fetchCoinThreads, loadedMore ? null : 10_000);

  return { threads, updateThreads: fetchCoinThreads, loadMore, nextPageToken };
}
