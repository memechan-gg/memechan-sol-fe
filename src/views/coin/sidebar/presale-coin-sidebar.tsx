import { useBoundPoolClient } from "@/hooks/presale/useBoundPoolClient";
import { getTokenInfo } from "@/hooks/utils";
import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { PresaleCoinInfo } from "./info/presale-coin-info";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({ pool, coinMetadata, uniqueHoldersData, ticketsData }: PresaleCoinSidebarProps) {
  const { data: boundPoolClient } = useBoundPoolClient(pool.address);

  const boundPool = boundPoolClient?.boundPoolInstance.poolObjectData;

  const tokenInfo = boundPool?.quoteReserve.mint
    ? getTokenInfo({ tokenAddress: boundPool?.quoteReserve.mint.toString() })
    : undefined;
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
      {tokenInfo && (
        <SidebarItem>
          <PresaleCoinInfo metadata={coinMetadata} boundPool={boundPool} tokenInfo={tokenInfo} />
        </SidebarItem>
      )}
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
