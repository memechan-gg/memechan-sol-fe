import { useBalance } from "@/hooks/sui/useBalance";
import { ActualLiquidityProps, LiquidityProps } from "../../coin.types";
import { AddLiquidityDialog } from "./dialog-add-liquidity";
import { RemoveLiquidityDialog } from "./dialog-remove-liquidity";

export const Liquidity = ({
  memeBalance,
  tokenSymbol,
  lpCoinType,
  addLiquidity,
  removeLiquidity,
  quoteAddLiquidity,
  quoteRemoveLiquidity,
}: LiquidityProps) => {
  if (!lpCoinType) return null;

  return (
    <ActualLiquidity
      memeBalance={memeBalance}
      tokenSymbol={tokenSymbol}
      lpCoinType={lpCoinType}
      addLiquidity={addLiquidity}
      removeLiquidity={removeLiquidity}
      quoteAddLiquidity={quoteAddLiquidity}
      quoteRemoveLiquidity={quoteRemoveLiquidity}
    />
  );
};

export const ActualLiquidity = ({
  memeBalance,
  tokenSymbol,
  lpCoinType,
  addLiquidity,
  removeLiquidity,
  quoteAddLiquidity,
  quoteRemoveLiquidity,
}: ActualLiquidityProps) => {
  const { balance: lpCoinBalance, refetch } = useBalance(lpCoinType);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-xs font-bold text-regular">Liquidity</div>
      <div className="flex flex-col w-full gap-1">
        {/* Add or Remove buttons */}
        <div className="flex w-full flex-row gap-2">
          <AddLiquidityDialog
            lpCoinBalance={lpCoinBalance}
            memeBalance={memeBalance}
            tokenSymbol={tokenSymbol}
            addLiquidity={addLiquidity}
            quoteAddLiquidity={quoteAddLiquidity}
          />
          <RemoveLiquidityDialog
            lpCoinBalance={lpCoinBalance}
            tokenSymbol={tokenSymbol}
            removeLiquidity={removeLiquidity}
            quoteRemoveLiquidity={quoteRemoveLiquidity}
          />
        </div>
      </div>
    </div>
  );
};
