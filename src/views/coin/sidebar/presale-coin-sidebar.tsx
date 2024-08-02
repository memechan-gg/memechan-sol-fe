import { TokenCard } from "@/components/TokenCard";
import { timeSince } from "@/utils/timeSpents";
import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { getBoundPoolProgress } from "./info/utils";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({
  pool,
  coinMetadata,
  uniqueHoldersData,
  ticketsData,
  boundPoolClient,
}: PresaleCoinSidebarProps) {
  const boundPool = boundPoolClient?.boundPoolInstance.poolObjectData;
  const isV2 = boundPoolClient.version === "V2";

  const { progress, slerfIn, limit } = boundPool
    ? getBoundPoolProgress(boundPool, isV2)
    : {
        progress: "0",
        slerfIn: "0",
        limit: "0",
      };

  return (
    <div className="flex flex-col gap-y-3">
      <SidebarItem>
        <TokenCard
          key={coinMetadata.address}
          token={coinMetadata}
          showLinks
          showCheckmark
          progressInfo={{
            progress: Number(progress),
            totalQuoteAmount: limit,
            currentQuoteAmount: slerfIn,
            participactsAmount: uniqueHoldersData?.holders.length.toString() ?? "0",
            timeFromCreation: timeSince(coinMetadata.creationTime),
          }}
          showOnClick={false}
        />
      </SidebarItem>
      <SidebarItem>
        <PresaleCoinHolders
          poolAddress={pool.address}
          coinMetadata={coinMetadata}
          uniqueHoldersData={uniqueHoldersData}
        />
      </SidebarItem>
    </div>
  );
}
