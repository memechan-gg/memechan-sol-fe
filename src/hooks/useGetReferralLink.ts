import { useConnection } from "@/context/ConnectionContext";
import { getReferrerLink } from "@avernikoz/memechan-sol-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const fetchUsersReferralLink = async (walletAddress: string, connection: Connection) => {
  try {
    const referralLink = await getReferrerLink(connection, walletAddress);

    return referralLink;
  } catch (e) {
    console.error(`[fetchTokenAccounts] Cannot fetch referral link of ${walletAddress.toString()}:`, e);
  }
};

export function useGetReferralLink() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  return useQuery({
    queryKey: [`referral-link`, publicKey],
    queryFn: () => {
      if (publicKey) return fetchUsersReferralLink(publicKey.toBase58(), connection);
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
