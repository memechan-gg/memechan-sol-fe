import { useBoundPool } from "@/hooks/presale/useBoundPool";
import { getTokenInfo } from "@/hooks/utils";
import { PresaleCoinSidebarProps } from "../coin.types";
import { PresaleCoinHolders } from "./holders/presale-coin-holders";
import { PresaleCoinInfo } from "./info/presale-coin-info";
import { SidebarItem } from "./sidebar-item";
import { PresaleCoinSwap } from "./swap/presale-coin-swap";

export function PresaleCoinSidebar({ pool, coinMetadata, uniqueHoldersData, ticketsData }: PresaleCoinSidebarProps) {
  const boundPool = useBoundPool(pool.address ?? "");
  const tokenInfo = boundPool?.quoteReserve.mint
    ? getTokenInfo({ quoteMint: boundPool?.quoteReserve.mint.toString() })
    : undefined;
  if (
    !coinMetadata?.marketcap ||
    !coinMetadata?.creator ||
    !coinMetadata?.address ||
    !coinMetadata.name ||
    !coinMetadata.symbol ||
    !pool.address
  ) {
    return <></>;
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
