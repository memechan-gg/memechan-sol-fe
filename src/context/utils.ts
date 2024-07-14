import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";

export const getInitialRpcEndpoint = () => {
  // update this later to fetch from local storage
  return (typeof window !== "undefined" && MEMECHAN_RPC_ENDPOINT) || MEMECHAN_RPC_ENDPOINT;
};
