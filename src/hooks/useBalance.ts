import { loadBalancedConnection } from "@/common/solana";
import { getTokenAccounts } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

const fetchCoinBalance = async (tokenAddress: string, ownerAddress: PublicKey) => {
  try {
    const tokenAccountsData = await getTokenAccounts({
      connection: loadBalancedConnection,
      ownerAddress: ownerAddress,
      tokenAddress: new PublicKey(tokenAddress),
    });

    return tokenAccountsData;
  } catch (e) {
    console.error(`[fetchCoinBalance] Cannot fetch balance for token ${tokenAddress} and user ${ownerAddress}:`, e);
  }
};

export const useBalance = (coin: string) => {
  const { publicKey } = useWallet();

  const { data: tokenAccountsData, mutate } = useSWR(
    publicKey ? [`balance-${publicKey.toString()}-${coin}`, coin, publicKey] : null,
    ([url, tokenAddress, ownerAddress]) => fetchCoinBalance(tokenAddress, ownerAddress),
    { refreshInterval: 5000 },
  );

  return {
    balance: tokenAccountsData?.amount,
    refetch: mutate,
  };
};
