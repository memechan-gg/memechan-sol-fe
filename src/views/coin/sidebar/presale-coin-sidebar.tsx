import { useBoundPool } from "@/hooks/presale/useBoundPool";
import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { PresaleCoinInfo } from "./info/presale-coin-info";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({ pool, coinMetadata, uniqueHoldersData }: PresaleCoinSidebarProps) {
  const boundPool = useBoundPool(pool.address);

  return (
    <>
      <SidebarItem>
        <PresaleCoinSwap pool={pool} tokenSymbol={coinMetadata.symbol} boundPool={boundPool} />
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
