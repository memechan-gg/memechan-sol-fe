import { PoolStatus } from "@/types/pool";
import { useLivePoolClient } from "./live/useLivePoolClient";
import { useBoundPoolClient } from "./presale/useBoundPoolClient";

export type PoolVersion = "V1" | "V2";

export function usePoolVersion(poolStatus: PoolStatus, poolAddress?: string, livePoolAddress?: string): PoolVersion {
  const livePoolAddressKey = poolStatus === "LIVE" ? livePoolAddress || poolAddress : null;
  const boundPoolAddressKey = poolStatus === "PRESALE" ? poolAddress : null;

  const { data: livePoolClient } = useLivePoolClient(livePoolAddressKey);
  const { data: boundPoolClient } = useBoundPoolClient(boundPoolAddressKey);

  return (livePoolClient || boundPoolClient)?.version as PoolVersion;
}
