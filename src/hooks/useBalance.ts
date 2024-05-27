import { MemechanClientInstance } from "@/common/solana";
import { getTokenAccount } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchCoinBalance = async (tokenAddress: string, ownerAddress: PublicKey) => {
  try {
    const tokenAccount = await getTokenAccount({
      connection: MemechanClientInstance.connection,
      ownerAddress: ownerAddress,
      tokenAddress: new PublicKey(tokenAddress),
    });

    return tokenAccount;
  } catch (e) {
    console.error(`[fetchCoinBalance] Cannot fetch balance for token ${tokenAddress} and user ${ownerAddress}:`, e);
  }
};

export const useBalance = (coin: string) => {
  const { publicKey } = useWallet();

  const { data: tokenAccount, mutate } = useSWR(
    publicKey ? [`balance-${publicKey.toString()}-${coin}`, coin, publicKey] : null,
    ([url, tokenAddress, ownerAddress]) => fetchCoinBalance(tokenAddress, ownerAddress),
    { refreshInterval: 5000 },
  );

  return {
    balance: tokenAccount?.info.tokenAmount.uiAmount,
    refetch: mutate,
  };
};
