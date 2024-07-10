import { PoolStatus } from "@/types/pool";
import { useLivePoolClient } from "./live/useLivePoolClient";
import { useBoundPoolClient } from "./presale/useBoundPoolClient";

export type Version = "V1" | "V2";

export function useVersion(poolStatus: PoolStatus, poolAddress?: string, livePoolAddress?: string): Version {
  const livePoolAddressKey = poolStatus === "LIVE" ? livePoolAddress || poolAddress : null;
  const boundPoolAddressKey = poolStatus === "PRESALE" ? poolAddress : null;

  const livePoolClient = useLivePoolClient(livePoolAddressKey);
  const boundPoolClient = useBoundPoolClient(boundPoolAddressKey);

  return (livePoolClient || boundPoolClient)?.version as Version;
}
