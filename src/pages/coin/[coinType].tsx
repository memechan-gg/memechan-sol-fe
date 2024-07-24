import { useMedia } from "@/hooks/useMedia";
import { Coin } from "@/views/coin";
import { useRouter } from "next/router";

export default function CoinPage() {
  const router = useRouter();
  const media = useMedia();
  let { coinType, tab } = router.query as { coinType: string; tab: string };

  if (!media.isSmallDevice && tab === "info") {
    router.push({
      pathname: `/coin/[coinType]`,
      query: { coinType: coinType, tab: "chart" },
    });
  }
  return <Coin coin={coinType} tab={tab} />;
}
