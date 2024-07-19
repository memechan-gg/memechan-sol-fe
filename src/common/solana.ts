import { Auth, ChartApi, PoolAPI, SocialAPI, TokenAPI } from "@avernikoz/memechan-sol-sdk";
import { Keypair, PublicKey } from "@solana/web3.js";

export const SIMULATION_KEYPAIR = Keypair.fromSeed(
  Uint8Array.from(
    [
      112, 234, 144, 85, 59, 150, 0, 244, 46, 236, 71, 109, 21, 225, 69, 44, 25, 0, 7, 229, 243, 64, 220, 205, 78, 165,
      246, 38, 79, 206, 39, 104, 19, 12, 58, 42, 237, 139, 24, 152, 111, 43, 124, 90, 66, 70, 32, 157, 46, 157, 241, 52,
      90, 45, 93, 246, 59, 54, 101, 116, 189, 167, 139, 96,
    ].slice(0, 32),
  ),
);
export const BE_URL = process.env.NEXT_PUBLIC_BE_URL;

gexport const AuthInstance = new Auth(BE_URL);
export const TokenApiInstance = new TokenAPI(BE_URL);
export const PoolApiInstance = new PoolAPI(BE_URL);
export const SocialApiInstance = new SocialAPI(BE_URL);
export const ChartApiInstance = new ChartApi(BE_URL);

// export const MEMECHAN_QUOTE_TOKEN = "WSOL";
// export const MEMECHAN_QUOTE_TOKEN_DECIMALS = TOKEN_INFOS[MEMECHAN_QUOTE_TOKEN].decimals;
// export const MEMECHAN_TARGET_CONFIG = TOKEN_INFOS[MEMECHAN_QUOTE_TOKEN].targetConfig;
// export const MEMECHAN_QUOTE_MINT = TOKEN_INFOS[MEMECHAN_QUOTE_TOKEN].mint;

export const NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112");
export const NATIVE_MINT_STRING = "So11111111111111111111111111111111111111112";
