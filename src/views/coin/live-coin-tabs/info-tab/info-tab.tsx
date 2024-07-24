import { useLiveCoinUniqueHoldersFromBE } from "@/hooks/live/useLiveCoinUniqueHoldersFromBE";
import { useLiveMemePrice } from "@/hooks/live/useLiveMemePrice";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useMemePriceFromBE } from "@/hooks/useMemePriceFromBE";
import { LiveCoinSidebar } from "../../sidebar/live-coin-sidebar";

export function InfoTab({ coinMetadata, pool }: any) {
  const { data: price } = useMemePriceFromBE({ memeMint: coinMetadata.address, poolType: "livePool" });
  const { data: stakingPoolFromApi } = useStakingPoolFromApi(coinMetadata.address);
  const { data: uniqueHoldersData } = useLiveCoinUniqueHoldersFromBE(coinMetadata.address, stakingPoolFromApi?.address);
  const { data: seedPoolData } = useSeedPool(coinMetadata.address);
  const { data: prices } = useLiveMemePrice(pool.id);

  return (
    <LiveCoinSidebar
      pool={pool}
      coinMetadata={coinMetadata}
      uniqueHoldersData={uniqueHoldersData}
      seedPoolData={seedPoolData}
      stakingPoolFromApi={stakingPoolFromApi}
    />
  );
}

// OLD CODE
{
  /* <ThreadBoard title={coinMetadata.name} showNavigateBtn>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap flex-row gap-3 gap-x-10">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-regular">Token Name</div>
              <div className="text-xs font-bold text-regular">{coinMetadata.name}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-regular">Token Ticker</div>
              <div className="text-xs font-bold text-regular">{coinMetadata.symbol}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-regular">Market Cap</div>
              <div className="text-xs font-bold text-regular">${formatNumber(coinMetadata.marketcap, 2)}</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold !normal-case text-regular">USD price</div>
              <div className="text-xs font-bold !normal-case text-regular">
                {price ? `$${(+price).toFixed(10)}` : <Skeleton />}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-regular">Unique holders</div>
              <div className="text-xs font-bold text-regular">
                {uniqueHoldersData ? uniqueHoldersData.fullHolders.length : <Skeleton />}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold text-link">Created By</div>
              <Link
                href={`/profile/${coinMetadata.address}/${coinMetadata.creator}`}
                className="text-xs font-bold text-link"
              >
                {coinMetadata.creator.slice(0, 5)}...
                {coinMetadata.creator.slice(-3)}
              </Link>
            </div>
          </div>
          <div className="flex w-full flex-col lg:flex-row gap-6">
            <div className="flex flex-col gap-3 w-full">
              {tokenData ? (
                <Chart address={seedPoolData.address} tokenName={coinMetadata.symbol.toUpperCase()} />
              ) : null}
              <div className="flex flex-col gap-3 lg:hidden">
                <PresaleCoinSidebar
                  coinMetadata={coinMetadata}
                  pool={seedPoolData}
                  uniqueHoldersData={uniqueHoldersData}
                  ticketsData={ticketsData}
                />
              </div>
              <CommentsPanel coinType={coinMetadata.address} coinCreator={coinMetadata.creator} />
            </div>
            <div className="lg:flex hidden w-1/3 flex-col gap-4">
              <PresaleCoinSidebar
                coinMetadata={coinMetadata}
                pool={seedPoolData}
                uniqueHoldersData={uniqueHoldersData}
                ticketsData={ticketsData}
              />
            </div>
          </div>
        </div>
      </ThreadBoard> */
}
