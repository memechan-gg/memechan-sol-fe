import { SIMULATION_KEYPAIR } from "@/common/solana";
import { IS_TEST_ENV } from "@/config/config";
import { ConnectionConfig } from "@solana/web3.js";
import { NoWalletAdapter } from "memechan-sol-sdk";

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
