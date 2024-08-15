import { useMedia } from "@/hooks/useMedia";
import { Coin } from "@/views/coin";
import { useRouter } from "next/router";

export default function CoinPage() {
  const router = useRouter();
  const media = useMedia();
  let { coinType, tab, referrer } = router.query as { coinType: string; tab: string; referrer?: string };

  if (!media.isSmallDevice && tab === "Info") {
    if (referrer) {
      router.push({
        pathname: `/coin/[coinType]`,
        query: { coinType: coinType, tab: "Chart", referrer: referrer },
      });
    } else {
      router.push({
        pathname: `/coin/[coinType]`,
        query: { coinType: coinType, tab: "Chart" },
      });
    }
  }

  return <Coin coin={coinType} tab={tab} />;
}
