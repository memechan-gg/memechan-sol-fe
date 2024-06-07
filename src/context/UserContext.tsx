// import { getCoinsAndNormalizeWithDecimals } from "@/utils/sui/getCoins";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

type StakedLpObject = {};

export type UserContextType = {
  address: string;
  balance: string;
  stakedLps: {
    [ticketType: string]: StakedLpObject[];
  };
};

const UserContext = createContext<UserContextType>({
  address: "",
  balance: "0",
  stakedLps: {},
});

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { wallet } = useWallet();

  const [balance, setBalance] = useState("0");
  const [stakedLps, setStakedLps] = useState<{
    [ticketType: string]: StakedLpObject[];
  }>({});

  useEffect(() => {
    if (!wallet) {
      setBalance("0");
      setStakedLps({});
    }
  }, [wallet]);

  return (
    <UserContext.Provider value={{ address: wallet?.adapter.publicKey?.toBase58() ?? "", balance, stakedLps }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
