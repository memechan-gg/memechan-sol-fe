import { Auth, MemechanClient, NoWalletAdapter, PoolAPI, SocialAPI, TokenAPI } from "@avernikoz/memechan-sol-sdk";
import { Keypair } from "@solana/web3.js";

// TODO: Change to mainnet
export const DEFAULT_PROVIDER_URL = "https://devnet.helius-rpc.com/?api-key=5f8ab112-be5c-4982-aacf-04e3bc1d8dcf";
export const RPC_API_CLUSTER = "https://rpc.ankr.com/solana_devnet";
export const WSS_API_CLUSTER = "wss://api.devnet.solana.com/";
export const IS_TEST_ENV = false;
export const BE_URL = "https://14r6b4r6kf.execute-api.us-east-1.amazonaws.com/prod";
export const SIMULATION_KEYPAIR = Keypair.fromSeed(
  Uint8Array.from(
    [
      112, 234, 144, 85, 59, 150, 0, 244, 46, 236, 71, 109, 21, 225, 69, 44, 25, 0, 7, 229, 243, 64, 220, 205, 78, 165,
      246, 38, 79, 206, 39, 104, 19, 12, 58, 42, 237, 139, 24, 152, 111, 43, 124, 90, 66, 70, 32, 157, 46, 157, 241, 52,
      90, 45, 93, 246, 59, 54, 101, 116, 189, 167, 139, 96,
    ].slice(0, 32),
  ),
);

export const AuthInstance = new Auth(BE_URL);
export const TokenApiInstance = new TokenAPI(BE_URL);
export const PoolApiInstance = new PoolAPI(BE_URL);
export const SocialApiInstance = new SocialAPI(BE_URL);
export const MemechanClientInstance = new MemechanClient({
  wallet: NoWalletAdapter,
  heliusApiUrl: DEFAULT_PROVIDER_URL,
  rpcApiUrl: RPC_API_CLUSTER,
  wssApiUrl: WSS_API_CLUSTER,
  isTest: IS_TEST_ENV,
  simulationKeypair: SIMULATION_KEYPAIR,
});