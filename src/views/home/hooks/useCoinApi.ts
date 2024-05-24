import { TokenApiInstance } from "@/common/solana";
import { CoinMetadata } from "@/types/coin";
import { useCallback, useEffect, useState } from "react";

export function useCoinApi() {
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState("last_reply");
  const [items, setItems] = useState<CoinMetadata[]>([]);
  const [status, setStatus] = useState<"all" | "pre_sale" | "live">("all");

  const fetchData = useCallback(async () => {
    const getSortBy = (sortBy: string) => {
      switch (sortBy) {
        case "last_reply":
          return "lastReply";
        case "creation_time":
          return "creationTime";
        case "market_cap":
          return "marketcap";
        default:
          return "lastReply";
      }
    };

    const getStatus = (status: "all" | "pre_sale" | "live"): "all" | "PRESALE" | "LIVE" => {
      switch (status) {
        case "pre_sale":
          return "PRESALE";
        case "live":
          return "LIVE";
        default:
          return "all";
      }
    };

    try {
      let fetchedItems: CoinMetadata[] = [];
      if (status === "all") {
        const [presaleRes, liveRes] = await Promise.all([
          TokenApiInstance.queryTokens({ sortBy: getSortBy(sortBy), direction, status: "PRESALE" }),
          TokenApiInstance.queryTokens({ sortBy: getSortBy(sortBy), direction, status: "LIVE" }),
        ]);
        fetchedItems = [...presaleRes.result, ...liveRes.result];
      } else {
        const res = await TokenApiInstance.queryTokens({
          sortBy: getSortBy(sortBy),
          direction,
          status: getStatus(status) as "PRESALE" | "LIVE",
        });
        fetchedItems = res.result;
      }

      setItems(fetchedItems);
    } catch (error) {
      console.error(`Failed to fetch data for ${status === "all" ? "all" : status} status:`, error);
    }
  }, [status, sortBy, direction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // TODO: Uncomment
  // useInterval(fetchData, 5000);

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
