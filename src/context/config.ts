import { IS_TEST_ENV, SIMULATION_KEYPAIR } from "@/common/solana";
import { NoWalletAdapter } from "@avernikoz/memechan-sol-sdk";
import { ConnectionConfig } from "@solana/web3.js";

export const CONNECTION_CONFIG: ConnectionConfig = {
  httpAgent: IS_TEST_ENV ? false : undefined,
  commitment: "confirmed",
  // httpHeaders: {
  //   "Rpc-time": Date.now().toString(),
  // },
};

export const MEMECHAN_CLIENT_CONFIG = {
  wallet: NoWalletAdapter,
  simulationKeypair: SIMULATION_KEYPAIR,
};
