import { ThreadBoard } from "@/components/thread";
import { useBalance } from "@/hooks/sui/useBalance";
import { useBondingCurve } from "@/hooks/solana/useBondingCurve";
import { useCLAMM } from "@/hooks/solana/useCLAMM";
import { COIN_METADATA } from "@/types/coin";
import { PoolResponse } from "@/types/pool";
import { BondingPoolSingleton } from "@avernikoz/memechan-ts-sdk";
import Link from "next/link";
import { useQueryCoin } from "./hooks/useQueryCoin";
import { Sidebar } from "./sidebar";

type CoinProps = {
  coin: string;
};

export function Coin({ coin }: CoinProps) {
  const { coinMetadata, poolData } = useQueryCoin({
    coinType: coin,
  });
  const { balance: memeBalance } = useBalance(coin);

  if (!coinMetadata || !poolData) {
    return null;
  }

  return <ActualCoin coinMetadata={coinMetadata} memeBalance={memeBalance} poolData={poolData} />;
}

function ActualCoin({
  coinMetadata,
  memeBalance,
  poolData,
}: {
  coinMetadata: COIN_METADATA;
  memeBalance: string;
  poolData: PoolResponse;
}) {
  const BondingCurve = useBondingCurve({
    bondingCurvePoolObjectId: poolData.objectId,
    memeCoin: {
      coinType: poolData.memeCoinType,
    },
    status: coinMetadata.status,
  });

  const CLAMM = useCLAMM({
    status: coinMetadata.status,
    memeCoin: {
      coinType: poolData.memeCoinType,
    },
  });

  return (
    <ThreadBoard title={coinMetadata.name}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap flex-row gap-3">
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
            <div className="text-xs font-bold text-regular">
              $
              {(
                Number(BondingPoolSingleton.MEMECOIN_MINT_AMOUNT_FROM_CONTRACT) * Number(BondingCurve.price.priceInUsd)
              ).toFixed(2)}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold text-link">Created By</div>
            <Link href={`/profile/${coinMetadata.creator}`} className="text-xs font-bold text-link">
              {coinMetadata.creator.slice(0, 5)}...
              {coinMetadata.creator.slice(-3)}
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-3 w-full">
            {/* Mockup Chart */}
            <div className="h-64 w-full bg-regular flex items-center justify-center">
              <div className="text-white text-center">Chart</div>
            </div>
            <div className="flex flex-col gap-3 lg:hidden">
              <Sidebar
                coinMetadata={coinMetadata}
                memeBalance={memeBalance}
                pool={poolData}
                BondingCurve={BondingCurve}
                CLAMM={CLAMM}
              />
            </div>
            {/*TODO: SOCIAL STUFF
            <div className="flex flex-col gap-3">
              <div className="text-sm font-bold text-regular">Comments</div>
              <div className="flex flex-col gap-3">
                <div className="bg-title flex flex-row gap-4 bg-opjacity-30 p-4 rounded-xl">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs flex flex-row gap-1 font-bold text-regular">
                      <div>0x123...456</div>
                      <div className="text-xs font-medium text-regular">
                        4/22/2024, 2:32:43 PM
                      </div>
                    </div>
                    <div className="flex flex-row gap-2">
                      <img
                        className="w-[150px] border border-regular h-auto rounded-lg"
                        src="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="text-xs text-regular">
                          I love this token, I think it will go to the moon
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex w-full">
                <div role="button" className="text-sm font-bold text-link">
                  Post a reply
                </div>
              </div>
            </div> 
            */}
          </div>
          <div className="lg:flex hidden w-1/3 flex-col gap-4">
            <Sidebar
              coinMetadata={coinMetadata}
              memeBalance={memeBalance}
              pool={poolData}
              BondingCurve={BondingCurve}
              CLAMM={CLAMM}
            />
          </div>
        </div>
      </div>
    </ThreadBoard>
  );
}
