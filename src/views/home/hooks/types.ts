export type ThreadsSortStatus = "all" | "pre_sale" | "live";
export type ThreadsSortBy = "last_reply" | "creation_time" | "market_cap";
export type ThreadsSortDirection = "asc" | "desc";

export enum ThreadsSortOptions {
  Status = "threads-show-status",
  SortBy = "threads-show-sort-by",
  Direction = "threads-show-direction",
}
