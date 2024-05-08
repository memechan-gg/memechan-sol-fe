export type COIN_METADATA = {
  symbol: string;
  type: string;
  status: "LIVE" | "PRESALE";
  marketcap: number;
  creationTime: number;
  lastReply: number;
  txDigest: string;
  name: string;
  decimals: number;
  objectId: string;
  treasureCapId: string;
  objectType: string;
  description: string;
  image: string;
  metadataObjectId: string;
  creator: string;
  socialLinks?:
    | {
        twitter?: string | null | undefined;
        discord?: string | null | undefined;
      }
    | null
    | undefined;
  contractAddress?: string | null | undefined;
};
