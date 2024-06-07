import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";

export const getInitialRpcEndpoint = () => {
  return (typeof window !== "undefined" && localStorage.getItem("rpc-endpoint")) || MEMECHAN_RPC_ENDPOINT;
};
