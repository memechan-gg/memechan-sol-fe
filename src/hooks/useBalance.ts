import { connection } from "@/common/solana";
import { getTokenAccounts } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { BALANCE_INTERVAL } from "./refresh-intervals";

const fetchCoinBalance = async (tokenAddress: string, ownerAddress: PublicKey) => {
  try {
    const tokenAccountsData = await getTokenAccounts({
      connection: connection,
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
    { refreshInterval: BALANCE_INTERVAL, revalidateIfStale: false, revalidateOnFocus: false },
  );

  return {
    balance: tokenAccountsData?.amount,
    refetch: mutate,
  };
};
