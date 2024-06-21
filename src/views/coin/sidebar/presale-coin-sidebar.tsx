import { useBoundPool } from "@/hooks/presale/useBoundPool";
import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { PresaleCoinInfo } from "./info/presale-coin-info";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({ pool, coinMetadata, uniqueHoldersData, ticketsData }: PresaleCoinSidebarProps) {
  const boundPool = useBoundPool(pool.address);
  const boundPoolClient = useBoundPoolClient(pool.address);

  if (!boundPool) {
    return <>Loading...</>;
  }
  return (
    <>
      <SidebarItem>
        <PresaleCoinSwap
          pool={pool}
          tokenSymbol={coinMetadata.symbol}
          boundPool={boundPool}
          ticketsData={ticketsData}
        />
      </SidebarItem>
      <SidebarItem>
        <PresaleCoinInfo metadata={coinMetadata} boundPool={boundPool} />
      </SidebarItem>
      <SidebarItem>
        <PresaleCoinHolders
          poolAddress={pool.address}
          coinMetadata={coinMetadata}
          uniqueHoldersData={uniqueHoldersData}
        />
      </SidebarItem>
    </>
  );
}
