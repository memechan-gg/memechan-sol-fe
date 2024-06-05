import { MEMECHAN_RPC_ENDPOINT } from "@/common/endpoints";
import { IS_TEST_ENV, SIMULATION_KEYPAIR } from "@/common/solana";
import { NoWalletAdapter } from "@avernikoz/memechan-sol-sdk";
import { ConnectionConfig } from "@solana/web3.js";

export const CONNECTION_CONFIG: ConnectionConfig = {
  httpAgent: IS_TEST_ENV ? false : undefined,
  commitment: "confirmed",
};

export const MEMECHAN_CLIENT_CONFIG = {
  wallet: NoWalletAdapter,
  // TODO: This field should be removed later from MemechanClient constructor options
  heliusApiUrl: MEMECHAN_RPC_ENDPOINT,
  simulationKeypair: SIMULATION_KEYPAIR,
};
