import { useLivePool } from "@/hooks/live/useLivePool";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useToken } from "@/hooks/useToken";
import { Oval } from "react-loader-spinner";
import { CoinNotFound } from "./coin-not-found";
import { LiveCoin } from "./live-coin";
import { PresaleCoin } from "./presale-coin";

type CoinProps = {
  coin: string;
  tab: string;
};

export function Coin({ coin, tab }: CoinProps) {
  const { data: token, isLoading: tokenIsLoading } = useToken(coin);

  const { data: seedPool, isLoading: seedPoolIsLoading } = useSeedPool(
    token?.status === "PRESALE" ? token?.address : undefined,
  );
  const { data: livePool, isLoading: livePoolIsLoading } = useLivePool(
    token?.status === "LIVE" ? token.address : undefined,
  );

  if (tokenIsLoading || seedPoolIsLoading || livePoolIsLoading)
    return (
      <div className="text-regular mt-2">
        <Oval visible={true} color="#3e3e3e" secondaryColor="#979797" />
      </div>
    );
  if (!token) return <CoinNotFound />;

  if (seedPool) return <PresaleCoin coinMetadata={token} tab={tab} seedPoolData={seedPool} />;
  if (livePool) return <LiveCoin coinMetadata={token} tab={tab} livePoolData={livePool} />;

  return <CoinNotFound />;
}
