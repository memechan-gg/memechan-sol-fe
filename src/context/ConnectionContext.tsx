import { MEMECHAN_RPC_ENDPOINT } from "@/common/endpoints";
import { IS_TEST_ENV, SIMULATION_KEYPAIR } from "@/common/solana";
import { MemechanClient, NoWalletAdapter } from "@avernikoz/memechan-sol-sdk";
import { Connection, ConnectionConfig } from "@solana/web3.js";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";

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

export type ConnectionContextType = {
  connection: Connection;
  memechanClient: MemechanClient;
  setRpcEndpoint: Dispatch<SetStateAction<string>>;
};

const getInitialRpcEndpoint = () => {
  return (typeof window !== "undefined" && localStorage.getItem("rpc-endpoint")) || MEMECHAN_RPC_ENDPOINT;
};

const initialConnection = new Connection(getInitialRpcEndpoint(), CONNECTION_CONFIG);

const ConnectionContext = createContext<ConnectionContextType>({
  connection: initialConnection,
  memechanClient: new MemechanClient({ connection: initialConnection, ...MEMECHAN_CLIENT_CONFIG }),
  setRpcEndpoint: () => {},
});

export const ConnectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [rpcEndpoint, setRpcEndpoint] = useState(getInitialRpcEndpoint());
  const [connection, setConnection] = useState<Connection>(initialConnection);
  const [memechanClient, setMemechanClient] = useState<MemechanClient>(
    new MemechanClient({
      ...MEMECHAN_CLIENT_CONFIG,
      connection,
    }),
  );

  useEffect(() => {
    const newConnection = new Connection(rpcEndpoint, CONNECTION_CONFIG);

    setConnection(newConnection);
    setMemechanClient(new MemechanClient({ ...MEMECHAN_CLIENT_CONFIG, connection: newConnection }));

    typeof window !== "undefined" && localStorage.setItem("rpc-endpoint", rpcEndpoint);
  }, [rpcEndpoint]);

  return (
    <ConnectionContext.Provider value={{ connection, memechanClient, setRpcEndpoint }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);
