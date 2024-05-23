export interface ICreateForm {
  name: string;
  symbol: string;
  image: File[];
  description: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  website?: string;
}

export type CreateCoinState = "idle" | "sign" | "ipfs" | "create_meme" | "create_bonding";
