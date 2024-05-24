import { PoolApiInstance } from "@/common/solana";

export type PoolStatus = "LIVE" | "PRESALE";

export type SeedPoolData = Awaited<ReturnType<typeof PoolApiInstance.getSeedPoolByTokenAddress>>;

export type LivePoolData = Awaited<ReturnType<typeof PoolApiInstance.getLivePoolByTokenAddress>>;
