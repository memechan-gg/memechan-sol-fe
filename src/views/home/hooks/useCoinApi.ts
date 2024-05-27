import { TokenApiInstance } from "@/common/solana";
import { CoinMetadata } from "@/types/coin";
import { useCallback, useEffect, useState } from "react";
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

        fetchedItems = [...liveRes.result, ...presaleRes.result];
      } else {
        const res = await TokenApiInstance.queryTokens({
          sortBy: getSortBy(sortBy),
          direction,
          status: getStatus(status),
        });

        fetchedItems = res.result;
      }

      setItems(fetchedItems);
    } catch (error) {
      console.error(`Failed to fetch data for ${status} status:`, error);
    }
  }, [status, sortBy, direction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useInterval(fetchData, 5000);

  return {
    items,
    status,
    setStatus,
    sortBy,
    setSortBy,
    direction,
    setDirection,
  };
}
