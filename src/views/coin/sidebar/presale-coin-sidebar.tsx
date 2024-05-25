import { PresaleCoinSidebarProps } from "../coin.types";
import { Holders } from "./holders";
import { Info } from "./info";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({ pool, coinMetadata }: PresaleCoinSidebarProps) {
  return (
    <>
      <SidebarItem>
        <PresaleCoinSwap pool={pool} tokenSymbol={coinMetadata.symbol} />
      </SidebarItem>
      <SidebarItem>
        <Info metadata={coinMetadata} poolAddress={pool.address} />
      </SidebarItem>
      <SidebarItem>
        <Holders poolAddress={pool.address} coinMetadata={coinMetadata} />
      </SidebarItem>
    </>
  );
}
