import { PoolStatus } from "./pool";

export type CoinMetadata = {
  symbol: string;
  address: string;
  status: PoolStatus;
  marketcap: number;
  creationTime: number;
  lastReply: number;
  txDigest: string;
  name: string;
  decimals: number;
  description: string;
  image: string;
  creator: string;
  socialLinks?:
    | {
        website?: string | null | undefined;
        telegram?: string | null | undefined;
        twitter?: string | null | undefined;
        discord?: string | null | undefined;
      }
    | null
    | undefined;
};
