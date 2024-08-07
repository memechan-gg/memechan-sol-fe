import { TokenCard } from "@/components/TokenCard";
import { useMedia } from "@/hooks/useMedia";
import { formatNumberForTokenCard } from "@/utils/formatNumbersForTokenCard";
import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { PresaleCoinInfo } from "./info/presale-coin-info";
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
  const media = useMedia();

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
          progressInfo={formatNumberForTokenCard({ token: coinMetadata })}
          showOnClick={false}
        />
      </SidebarItem>
      {!media.isSmallDevice && (
        <SidebarItem>
          <PresaleCoinSwap
            pool={pool}
            tokenSymbol={coinMetadata.symbol}
            boundPool={boundPool}
            ticketsData={ticketsData}
            memeImage={coinMetadata.image}
          />
        </SidebarItem>
      )}
      <SidebarItem>
        <PresaleCoinInfo boundPool={boundPool} metadata={coinMetadata} />
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
