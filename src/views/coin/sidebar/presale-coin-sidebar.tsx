import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { PresaleCoinInfo } from "./info/presale-coin-info";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({ pool, coinMetadata }: PresaleCoinSidebarProps) {
  return (
    <>
      <SidebarItem>
        <PresaleCoinSwap pool={pool} tokenSymbol={coinMetadata.symbol} />
      </SidebarItem>
      <SidebarItem>
        <PresaleCoinInfo metadata={coinMetadata} poolAddress={pool.address} />
      </SidebarItem>
      <SidebarItem>
        <PresaleCoinHolders poolAddress={pool.address} coinMetadata={coinMetadata} />
      </SidebarItem>
    </>
  );
}
