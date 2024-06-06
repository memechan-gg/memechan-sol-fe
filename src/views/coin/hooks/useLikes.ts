import { SocialApiInstance } from "@/common/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";

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

  const { data, mutate } = useSWR(
    publicKey ? [`likes-${memeMint}`, publicKey.toString(), memeMint] : null,
    ([url, user, meme]) => fetchLikes(user, meme),
    { revalidateIfStale: false, revalidateOnFocus: false },
  );

  return { likesData: data?.result, refetch: mutate };
};
