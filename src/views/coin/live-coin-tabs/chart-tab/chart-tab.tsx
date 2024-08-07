import { ChartIframe } from "@/components/chart-iframe";
import { Button } from "@/memechan-ui/Atoms";
import { useState } from "react";

export interface ChartTabProps {
  coinAddress: string;
  livePoolDataId: string;
}
export function ChartTab({ coinAddress, livePoolDataId }: ChartTabProps) {
  // Initialize state with 'birdeye' as the default
  const [selectedChart, setSelectedChart] = useState<"birdeye" | "dexscreener">("dexscreener");

  return (
    <>
      {selectedChart === "birdeye" ? (
        <ChartIframe
          src={`https://birdeye.so/tv-widget/${coinAddress}/${livePoolDataId}?chain=solana&chartType=candle&chartInterval=5&chartLeftToolbar=show`}
        />
      ) : (
        <ChartIframe
          src={`https://dexscreener.com/solana/${livePoolDataId}?embed=1&theme=dark&trades=0&info=0&interval=5`}
        />
      )}
      <div className="m-[10.5%] h-10 flex justify-center items-center gap-3 sm:m-5">
        <Button variant="primary" onClick={() => setSelectedChart("birdeye")}>
          Birdeye.so
        </Button>
        <Button variant="secondary" onClick={() => setSelectedChart("dexscreener")}>
          Dexscreener.com
        </Button>
      </div>
    </>
  );
}
