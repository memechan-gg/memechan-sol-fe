import { SocialApiInstance } from "@/common/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

const fetchLikes = async (walletAddress: string, memeMint: string) => {
  try {
    const likedThreadsData = await SocialApiInstance.getLikes({ walletAddress, coinType: memeMint });

    return likedThreadsData;
  } catch (e) {
    console.error(`[fetchLikes] Failed to fetch likes for user ${walletAddress} and meme ${memeMint}:`, e);
  }
};

export const useLikes = (memeMint: string) => {
  const { publicKey } = useWallet();
  return useQuery({
    queryKey: ["likes", memeMint, publicKey],
    queryFn: () => (memeMint && publicKey ? fetchLikes(publicKey.toString(), memeMint) : undefined),
    enabled: !!(publicKey && memeMint),
    staleTime: Infinity,
  });
};
