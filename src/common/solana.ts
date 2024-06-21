import { Auth, BE_URL_DEV, ChartApi, PoolAPI, SocialAPI, TokenAPI } from "@avernikoz/memechan-sol-sdk";
import { Keypair } from "@solana/web3.js";

export const SIMULATION_KEYPAIR = Keypair.fromSeed(
  Uint8Array.from(
    [
      112, 234, 144, 85, 59, 150, 0, 244, 46, 236, 71, 109, 21, 225, 69, 44, 25, 0, 7, 229, 243, 64, 220, 205, 78, 165,
      246, 38, 79, 206, 39, 104, 19, 12, 58, 42, 237, 139, 24, 152, 111, 43, 124, 90, 66, 70, 32, 157, 46, 157, 241, 52,
      90, 45, 93, 246, 59, 54, 101, 116, 189, 167, 139, 96,
    ].slice(0, 32),
  ),
);

export const AuthInstance = new Auth(BE_URL_DEV);
export const TokenApiInstance = new TokenAPI(BE_URL_DEV);
export const PoolApiInstance = new PoolAPI(BE_URL_DEV);
export const SocialApiInstance = new SocialAPI(BE_URL_DEV);
export const ChartApiInstance = new ChartApi(BE_URL_DEV);
