import { useUniqueHolders } from "@/hooks/solana/useUniqueHolders";
import { QuoteSwapParams, SwapParams } from "@/types/hooks";
import { FULL_MEME_AMOUNT_CONVERTED, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import { Transaction } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { SidebarProps } from "../coin.types";
import { Holders } from "./holders";
import { Info } from "./info";
import { SidebarItem } from "./sidebar-item";
import { Swap } from "./swap/swap";

// TODO: Replace these mock-methods with real ones
const swap = (params: SwapParams) => Promise<Transaction | undefined>;
const quoteSwap = (params: QuoteSwapParams) => Promise<string>;

export const Sidebar = ({ pool, memeBalance, coinMetadata, CLAMM }: SidebarProps) => {
  const uniqueHolders = useUniqueHolders(pool.address);

  return (
    <>
      <SidebarItem>
        <Swap
          memeBalance={memeBalance}
          pool={pool}
          quoteSwap={coinMetadata.status === "LIVE" ? CLAMM.quoteSwap : quoteSwap}
          swap={coinMetadata.status === "LIVE" ? CLAMM.swap : swap}
          tokenSymbol={coinMetadata.symbol}
        />
      </SidebarItem>
      {/* TODO: Handle live pools */}
      {/* {coinMetadata.status === "LIVE" && (
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
              coinType={pool.tokenAddress}
              ticketBalance={BondingCurve.availableTickets}
              tokenSymbol={coinMetadata.symbol}
            />
          </SidebarItem>
        </>
      )} */}
      <SidebarItem>
        <Info metadata={coinMetadata} poolAddress={pool.address} />
      </SidebarItem>
      {uniqueHolders && uniqueHolders.size > 0 && (
        <SidebarItem>
          <Holders
            holders={Array.from(uniqueHolders.entries()).map(([holder, tickets]) => {
              const ticketsMemeAmount = tickets
                .reduce((sum, ticket) => sum.plus(ticket.amount.toString()), new BigNumber(0))
                .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);

              const percentage = ticketsMemeAmount.div(FULL_MEME_AMOUNT_CONVERTED).multipliedBy(100).toFixed(2);

              return {
                address: holder.slice(0, 6) + "..." + holder.slice(-4),
                percentage,
                type: coinMetadata.creator === holder ? "dev" : undefined,
              };
            })}
          />
        </SidebarItem>
      )}
    </>
  );
};
