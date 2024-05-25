import { Auth, MemechanClient, NoWalletAdapter, PoolAPI, SocialAPI, TokenAPI } from "@avernikoz/memechan-sol-sdk";

// TODO: Change to mainnet
export const DEFAULT_PROVIDER_URL = "https://devnet.helius-rpc.com/?api-key=5f8ab112-be5c-4982-aacf-04e3bc1d8dcf";
export const RPC_API_CLUSTER = "https://rpc.ankr.com/solana_devnet";
export const WSS_API_CLUSTER = "wss://api.devnet.solana.com/";
export const IS_TEST_ENV = false;
export const BE_URL = "https://14r6b4r6kf.execute-api.us-east-1.amazonaws.com/prod";

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
