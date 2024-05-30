import { PoolStatus } from "@/types/pool";
import { ThreadsSortBy, ThreadsSortDirection, ThreadsSortStatus } from "./types";

export const getSortBy = (sortBy: string) => {
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

export const getStatus = (status: string): PoolStatus => {
  switch (status) {
    case "pre_sale":
      return "PRESALE";
    case "live":
      return "LIVE";
    default:
      return "PRESALE";
  }
};

export function isThreadsSortStatus(data: unknown): data is ThreadsSortStatus {
  return typeof data === "string" && (data === "all" || data === "pre_sale" || data === "live");
}

export function isThreadsSortBy(data: unknown): data is ThreadsSortBy {
  return typeof data === "string" && (data === "last_reply" || data === "creation_time" || data === "market_cap");
}

export function isThreadsSortDirection(data: unknown): data is ThreadsSortDirection {
  return typeof data === "string" && (data === "asc" || data === "desc");
}
