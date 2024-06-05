import { MemechanClient } from "@avernikoz/memechan-sol-sdk";
import { Connection } from "@solana/web3.js";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { CONNECTION_CONFIG, MEMECHAN_CLIENT_CONFIG } from "./config";
import { getInitialRpcEndpoint } from "./utils";

export type ConnectionContextType = {
  connection: Connection;
  memechanClient: MemechanClient;
  setRpcEndpoint: Dispatch<SetStateAction<string>>;
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
