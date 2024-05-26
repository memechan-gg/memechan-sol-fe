import { LiveCoinSidebarProps } from "../coin.types";
import { LiveCoinHolders } from "./holders/live-coin-holders";
import { LiveCoinInfo } from "./info/live-coin-info";
import { SidebarItem } from "./sidebar-item";
import { LiveCoinSwap } from "./swap/live-coin-swap";

export function LiveCoinSidebar({ coinMetadata, pool }: LiveCoinSidebarProps) {
  return (
    <>
      <SidebarItem>
        <LiveCoinSwap pool={pool} tokenSymbol={coinMetadata.symbol} />
      </SidebarItem>
      <SidebarItem>
        <LiveCoinInfo metadata={coinMetadata} />
      </SidebarItem>
      <SidebarItem>
        <LiveCoinHolders coinMetadata={coinMetadata} />
      </SidebarItem>
    </>
  );
}
