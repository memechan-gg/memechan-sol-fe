import { useStakingPool } from "@/hooks/solana/useStakingPool";
import { StakingPoolProps } from "../../coin.types";
import { UnstakeStakingPoolDialog } from "./dialog-unstake-staking-pool";
import { WithdrawFeesDialog } from "./dialog-withdraw-fees";

export const StakingPool = ({ coinType, ticketBalance, tokenSymbol }: StakingPoolProps) => {
  const { stakingPool } = useStakingPool(coinType);

  if (!stakingPool) return <></>;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-xs font-bold text-regular">Staking Pool</div>
      <div className="flex flex-col w-full gap-1">
        {/* Add or Remove buttons */}
        <div className="flex w-full flex-row gap-2">
          <UnstakeStakingPoolDialog stakingPool={stakingPool} ticketBalance={ticketBalance} tokenSymbol={tokenSymbol} />
          <WithdrawFeesDialog stakingPool={stakingPool} tokenSymbol={tokenSymbol} ticketBalance={ticketBalance} />
        </div>
      </div>
    </div>
  );
};
