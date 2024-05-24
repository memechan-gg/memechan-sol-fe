import { ThreadBoard } from "@/components/thread";
import { useBalance } from "@/hooks/solana/useBalance";
import { useLivePools } from "@/hooks/solana/useLivePools";
import { useSeedPools } from "@/hooks/solana/useSeedPools";
import { useTokens } from "@/hooks/solana/useTokens";
import { CoinMetadata } from "@/types/coin";
import Link from "next/link";
import { CoinNotFound } from "./coin-not-found";
import { LiveCoin } from "./live-coin";
import { PresaleCoin } from "./presale-coin";
import { Sidebar } from "./sidebar";

type CoinProps = {
  coin: string;
};

export function Coin({ coin }: CoinProps) {
  const seedPools = useSeedPools();
  const livePools = useLivePools();
  const tokens = useTokens();
  const { balance: memeBalance } = useBalance(coin);

  if (!tokens) return null;
  const coinMetadata = tokens.find((token) => token.address === coin);
  if (!coinMetadata) return null;
  const status = coinMetadata.status;

  if (status === "PRESALE" && seedPools) {
    const poolData = seedPools.find((pool) => pool.tokenAddress === coin);

    if (poolData) {
      return <PresaleCoin coinMetadata={coinMetadata} memeBalance={memeBalance} seedPoolData={poolData} />;
    }
  }

  if (status === "LIVE" && livePools) {
    const poolData = livePools.find((pool) => pool.tokenAddress === coin);

    if (poolData) {
      return <LiveCoin coinMetadata={coinMetadata} memeBalance={memeBalance} livePoolData={poolData} />;
    }
  }

  return <CoinNotFound />;
}

function ActualCoin({
  coinMetadata,
  memeBalance,
  poolData,
}: {
  coinMetadata: CoinMetadata;
  memeBalance: string;
  poolData: PoolResponse;
}) {
  return (
    <ThreadBoard title={coinMetadata.name}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap flex-row gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Token Name</div>
            <div className="text-xs font-bold text-regular">{coinMetadata.name}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Token Ticker</div>
            <div className="text-xs font-bold text-regular">{coinMetadata.symbol}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-regular">Market Cap</div>
            {/* <div className="text-xs font-bold text-regular">
              $
              {(
                Number(BondingPoolSingleton.MEMECOIN_MINT_AMOUNT_FROM_CONTRACT) * Number(BondingCurve.price.priceInUsd)
              ).toFixed(2)}
            </div> */}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-link">Created By</div>
            <Link href={`/profile/${coinMetadata.creator}`} className="text-xs font-bold text-link">
              {coinMetadata.creator.slice(0, 5)}...
              {coinMetadata.creator.slice(-3)}
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3 w-full">
            {/* Mockup Chart */}
            <div className="h-64 w-full bg-regular flex items-center justify-center">
              <div className="text-white text-center">Chart</div>
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              <Sidebar
                coinMetadata={coinMetadata}
                memeBalance={memeBalance}
                pool={poolData}
                CLAMM={0} // TODO: WARNING
              />
            </div>
          </div>
          <div className="lg:flex hidden w-1/3 flex-col gap-4">
            <Sidebar
              coinMetadata={coinMetadata}
              memeBalance={memeBalance}
              pool={poolData}
              CLAMM={0} // TODO: WARNING
            />
          </div>
        </div>
      </div>
    </ThreadBoard>
  );
}
