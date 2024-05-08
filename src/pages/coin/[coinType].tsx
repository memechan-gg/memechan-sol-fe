import { Coin } from "@/views/coin";
import { useRouter } from "next/router";

export default function CoinPage() {
  const router = useRouter();
  let { coinType } = router.query as { coinType: string };

  return <Coin coin={coinType} />;
}
