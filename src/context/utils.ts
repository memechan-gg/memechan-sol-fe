import { MEMECHAN_RPC_ENDPOINT } from "@/common/endpoints";

export const getInitialRpcEndpoint = () => {
  return (typeof window !== "undefined" && localStorage.getItem("rpc-endpoint")) || MEMECHAN_RPC_ENDPOINT;
};
