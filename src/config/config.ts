import { SIMULATION_KEYPAIR } from "@/common/solana";
import { NoWalletAdapter } from "@avernikoz/memechan-sol-sdk";
import { ConnectionConfig } from "@solana/web3.js";

// Connection Config
export const MEMECHAN_RPC_ENDPOINT = "https://rpc1.memechan.xyz";
export const IS_TEST_ENV = false;

export const CONNECTION_CONFIG: ConnectionConfig = {
  httpAgent: IS_TEST_ENV ? false : undefined,
  commitment: "confirmed",
};

export const MEMECHAN_CLIENT_CONFIG = {
  wallet: NoWalletAdapter,
  simulationKeypair: SIMULATION_KEYPAIR,
};

// UI Constants
export const MAX_HOLDERS_COUNT = 20;
export const LOW_FEES_THRESHOLD = 10 ** -3;
export const MAX_SLIPPAGE = 50;
export const MIN_SLIPPAGE = 0;

// Refresh Intervals
export const LIVE_POOL_PRICE_INTERVAL = 15_000;
export const LIVE_POOL_HOLDERS_INTERVAL = 15_000;
export const IS_LIVE_POOL_CREATED_INTERVAL = 15_000;

export const BOUND_POOL_DATA_INTERVAL = 15_000;
export const BOUND_POOL_HOLDERS_INTERVAL = 15_000;
export const BOUND_POOL_PRICE_INTERVAL = 5_000;

export const BALANCE_INTERVAL = 15_000;
export const SLERF_PRICE_INTERVAL = 15_000;
export const TARGET_CONFIG_INTERVAL = 15_000;
export const TICKETS_INTERVAL = 15_000;
export const TOKEN_INTERVAL = 5_000;
export const TOKEN_ACCOUNTS_INTERVAL = 15_000;
export const HOLDERS_INTERVAL = 15_000;
export const POOL_PRICE_INTERVAL = 15_000;
