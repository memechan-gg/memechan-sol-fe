export interface ICreateForm {
  name: string;
  ticker: string;
  image: File[];
  description: string;
  twitter?: string;
  discord?: string;
}

export type CreateCoinState = "idle" | "sign" | "ipfs" | "create_meme" | "create_bonding";
