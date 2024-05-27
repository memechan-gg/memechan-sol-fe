import { MemechanClientInstance } from "@/common/solana";
import { getTokenAccount } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

export const useBalance = (coin: string) => {
  const [balance, setBalance] = useState("0");
  const { publicKey } = useWallet();

  const fetchBalanceData = useCallback(async () => {
    if (!publicKey) {
      setBalance("0");
      return;
    }

    const tokenAccount = await getTokenAccount({
      connection: MemechanClientInstance.connection,
      ownerAddress: publicKey,
      tokenAddress: new PublicKey(coin),
    });

    if (tokenAccount) {
      const uiAmount = tokenAccount.info.tokenAmount.uiAmountString;
      setBalance(uiAmount);
    }
  }, [coin, publicKey]);

  useEffect(() => {
    fetchBalanceData();
  }, [fetchBalanceData]);

  // TODO: Uncomment
  // useInterval(fetchBalanceData, 5000);

  return {
    balance,
    refetch: fetchBalanceData,
  };
};
