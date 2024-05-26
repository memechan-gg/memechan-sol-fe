import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useTickets } from "@/hooks/useTickets";
import { LiveCoinSidebarProps } from "../coin.types";
import { LiveCoinHolders } from "./holders/live-coin-holders";
import { LiveCoinInfo } from "./info/live-coin-info";
import { SidebarItem } from "./sidebar-item";
import { StakingPool } from "./staking-pool/staking-pool";
import { LiveCoinSwap } from "./swap/live-coin-swap";

export function LiveCoinSidebar({ coinMetadata, pool }: LiveCoinSidebarProps) {
  const seedPoolData = useSeedPool(coinMetadata.address);
  const { tickets } = useTickets(seedPoolData?.address);

  return (
    <>
      <SidebarItem>
        <LiveCoinSwap pool={pool} tokenSymbol={coinMetadata.symbol} />
      </SidebarItem>
      {tickets.length > 0 && (
        <SidebarItem>
          <StakingPool tokenSymbol={coinMetadata.symbol} poolAddress={pool.address} memeMint={pool.tokenAddress} />
        </SidebarItem>
      )}
      <SidebarItem>
        <LiveCoinInfo metadata={coinMetadata} />
      </SidebarItem>
      <SidebarItem>
        <LiveCoinHolders coinMetadata={coinMetadata} />
      </SidebarItem>
    </>
  );
}
