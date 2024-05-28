import { TokenApiInstance } from "@/common/solana";
import { CoinMetadata } from "@/types/coin";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInterval } from "usehooks-ts";
import { ThreadsSortBy, ThreadsSortDirection, ThreadsSortOptions, ThreadsSortStatus } from "./types";
import { getSortBy, getStatus, isThreadsSortBy, isThreadsSortDirection, isThreadsSortStatus } from "./utils";

export const DEFAULT_SORT_PARAMS: {
  status: ThreadsSortStatus;
  sortBy: ThreadsSortBy;
  direction: ThreadsSortDirection;
} = {
  status: "all",
  sortBy: "last_reply",
  direction: "asc",
};

export function useCoinApi() {
  const [status, setStatus] = useState<ThreadsSortStatus | null>(null);
  const [sortBy, setSortBy] = useState<ThreadsSortBy | null>(null);
  const [direction, setDirection] = useState<ThreadsSortDirection | null>(null);

  const [items, setItems] = useState<CoinMetadata[] | null>(null);
  const [presaleNextPageToken, setPresaleNextPageToken] = useState<string | null>(null);
  const [liveNextPageToken, setLiveNextPageToken] = useState<string | null>(null);
  const [loadedMore, setLoadedMore] = useState<boolean>(false);

  // Gettings values from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initStatus = localStorage.getItem(ThreadsSortOptions.Status) ?? DEFAULT_SORT_PARAMS.status;
      const initSortBy = localStorage.getItem(ThreadsSortOptions.SortBy) ?? DEFAULT_SORT_PARAMS.sortBy;
      const initDirection = localStorage.getItem(ThreadsSortOptions.Direction) ?? DEFAULT_SORT_PARAMS.direction;

      if (isThreadsSortStatus(initStatus)) setStatus(initStatus);
      if (isThreadsSortBy(initSortBy)) setSortBy(initSortBy);
      if (isThreadsSortDirection(initDirection)) setDirection(initDirection);
    }
  }, []);

  // Setting values into local storage
  useEffect(() => {
    if (status && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.Status, status);
  }, [status]);
  useEffect(() => {
    if (sortBy && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.SortBy, sortBy);
  }, [sortBy]);
  useEffect(() => {
    if (direction && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.Direction, direction);
  }, [direction]);

  // Method for fetching data without pagination. Using pagination `load` methods inside will cause bugs.
  const fetchData = useCallback(async () => {
    if (!status || !sortBy || !direction) return;

    try {
      let fetchedItems: CoinMetadata[] = [];

      if (status === "all") {
        const [presaleRes, liveRes] = await Promise.all([
          TokenApiInstance.queryTokens({
            sortBy: getSortBy(sortBy),
            direction,
            status: "PRESALE",
          }),
          TokenApiInstance.queryTokens({ sortBy: getSortBy(sortBy), direction, status: "LIVE" }),
        ]);

        setPresaleNextPageToken(presaleRes.paginationToken ?? null);
        setLiveNextPageToken(liveRes.paginationToken ?? null);

        fetchedItems = [...liveRes.result, ...presaleRes.result];
      } else {
        const formattedStatus = getStatus(status);

        const res = await TokenApiInstance.queryTokens({
          sortBy: getSortBy(sortBy),
          direction,
          status: formattedStatus,
        });

        formattedStatus === "LIVE"
          ? setLiveNextPageToken(res.paginationToken ?? null)
          : setPresaleNextPageToken(res.paginationToken ?? null);

        fetchedItems = res.result;
      }

      setItems(fetchedItems);
    } catch (error) {
      console.error(`Failed to fetch data for ${status} status:`, error);
    }
  }, [status, sortBy, direction]);

  // Pagination methods
  const loadMoreLiveTokens = useCallback(async () => {
    if (!sortBy || !direction) return;

    const { result, paginationToken } = await TokenApiInstance.queryTokens({
      sortBy: getSortBy(sortBy),
      direction,
      status: "LIVE",
      paginationToken: liveNextPageToken,
    });

    setLiveNextPageToken(paginationToken ?? null);

    setItems((prevItems) => (prevItems ? [...prevItems, ...result] : result));
  }, [sortBy, direction, liveNextPageToken]);

  const loadMorePresaleTokens = useCallback(async () => {
    if (!sortBy || !direction) return;

    const { result, paginationToken } = await TokenApiInstance.queryTokens({
      sortBy: getSortBy(sortBy),
      direction,
      status: "PRESALE",
      paginationToken: presaleNextPageToken,
    });

    setPresaleNextPageToken(paginationToken ?? null);

    setItems((prevItems) => (prevItems ? [...prevItems, ...result] : result));
  }, [sortBy, direction, presaleNextPageToken]);

  const loadMoreTokens = useCallback(async () => {
    if (liveNextPageToken) {
      await loadMoreLiveTokens();
    }

    if (presaleNextPageToken) {
      await loadMorePresaleTokens();
    }
  }, [liveNextPageToken, presaleNextPageToken, loadMoreLiveTokens, loadMorePresaleTokens]);

  // The `load more` button click handler
  const loadMore = useCallback(async () => {
    if (!loadedMore) {
      setLoadedMore(true);
      toast("Disabled auto tokens update. Reload page to turn it back");
    }

    if (status === "live" && liveNextPageToken) {
      await loadMoreLiveTokens();
      return;
    }

    if (status === "pre_sale" && presaleNextPageToken) {
      await loadMorePresaleTokens();
      return;
    }

    if (status === "all" && (presaleNextPageToken || liveNextPageToken)) {
      await loadMoreTokens();
      return;
    }
  }, [
    loadedMore,
    liveNextPageToken,
    status,
    presaleNextPageToken,
    loadMoreLiveTokens,
    loadMorePresaleTokens,
    loadMoreTokens,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleaning all the pagination fields when any of the sort params has changed
  useEffect(() => {
    setLoadedMore(false);
    setLiveNextPageToken(null);
    setPresaleNextPageToken(null);
  }, [status, sortBy, direction]);

  // Intervally fetch the tokens only until user started loading more tokens
  useInterval(fetchData, loadedMore ? null : 5000);

  return {
    items,
    status,
    setStatus,
    sortBy,
    setSortBy,
    direction,
    setDirection,
    presaleNextPageToken,
    liveNextPageToken,
    loadMore,
  };
}
