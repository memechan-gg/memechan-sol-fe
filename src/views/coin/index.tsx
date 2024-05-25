import { useLivePools } from "@/hooks/solana/useLivePools";
import { useSeedPools } from "@/hooks/solana/useSeedPools";
import { useTokens } from "@/hooks/solana/useTokens";
import { CoinNotFound } from "./coin-not-found";
import { LiveCoin } from "./live-coin";
import { PresaleCoin } from "./presale-coin";

type CoinProps = {
  coin: string;
};

export function Coin({ coin }: CoinProps) {
  const seedPools = useSeedPools();
  const livePools = useLivePools();
  const tokens = useTokens();

  if (!tokens) return null;
  const coinMetadata = tokens.find((token) => token.address === coin);
  if (!coinMetadata) return null;
  const status = coinMetadata.status;

  if (status === "PRESALE" && seedPools) {
    const poolData = seedPools.find((pool) => pool.tokenAddress === coin);

    if (poolData) {
      return <PresaleCoin coinMetadata={coinMetadata} seedPoolData={poolData} />;
    }
  }

  if (status === "LIVE" && livePools) {
    const poolData = livePools.find((pool) => pool.tokenAddress === coin);

    if (poolData) {
      return <LiveCoin coinMetadata={coinMetadata} livePoolData={poolData} />;
    }
  }

  return <CoinNotFound />;
}
