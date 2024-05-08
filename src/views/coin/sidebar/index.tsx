import { BondingPoolSingleton } from "@avernikoz/memechan-ts-sdk";
import { SidebarProps } from "../coin.types";
import { Holders } from "./holders";
import { Info } from "./info";
import { Liquidity } from "./liquidity";
import { SidebarItem } from "./sidebar-item";
import { StakingPool } from "./staking-pool";
import { Swap } from "./swap/swap";

export const Sidebar = ({ pool, memeBalance, coinMetadata, BondingCurve, CLAMM }: SidebarProps) => {
  return (
    <>
      <SidebarItem>
        <Swap
          memeBalance={memeBalance}
          availableTickets={BondingCurve.availableTickets}
          pool={pool}
          quoteSwap={coinMetadata.status === "LIVE" ? CLAMM.quoteSwap : BondingCurve.quoteSwap}
          swap={coinMetadata.status === "LIVE" ? CLAMM.swap : BondingCurve.swap}
          tokenSymbol={coinMetadata.symbol}
        />
      </SidebarItem>
      {coinMetadata.status === "LIVE" && (
        <>
          <SidebarItem>
            <Liquidity
              addLiquidity={CLAMM.addLiquidity}
              quoteAddLiquidity={CLAMM.quoteAddLiquidity}
              quoteRemoveLiquidity={CLAMM.quoteRemoveLiquidity}
              removeLiquidity={CLAMM.removeLiquidity}
              tokenSymbol={coinMetadata.symbol}
              memeBalance={memeBalance}
              lpCoinType={CLAMM.lpCoinType}
            />
          </SidebarItem>
          <SidebarItem>
            <StakingPool
              coinType={pool.memeCoinType}
              ticketBalance={BondingCurve.availableTickets}
              tokenSymbol={coinMetadata.symbol}
            />
          </SidebarItem>
        </>
      )}
      <SidebarItem>
        <Info progressData={BondingCurve.progressData} metadata={coinMetadata} />
      </SidebarItem>
      <SidebarItem>
        <Holders
          holders={BondingCurve.uniqueHolders.map((holder) => ({
            address: holder.data.content.fields.name.slice(0, 6) + "..." + holder.data.content.fields.name.slice(-4),
            percentage: (
              Number(holder.data.content.fields.value.fields.notional) /
              Number(BondingPoolSingleton.MEMECOIN_MINT_AMOUNT_FROM_CONTRACT)
            ).toFixed(2),
            type: coinMetadata.creator === holder.data.content.fields.name ? "dev" : undefined,
          }))}
        />
      </SidebarItem>
    </>
  );
};
