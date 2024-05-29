import { StakingPoolProps } from "../../coin.types";
import { UnstakeDialog } from "./unstake-dialog";
import { WithdrawFeesDialog } from "./withdraw-fees-dialog";

export const StakingPool = ({ tokenSymbol, livePoolAddress, memeMint }: StakingPoolProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-xs font-bold text-regular">Staking Pool</div>
      <div className="text-xs font-medium text-regular text-balance">
        As Pre-Sale investor you are earning fees from trading of the{" "}
        <span className="!normal-case">{tokenSymbol}</span> token. You can unlock your locked Meme Coins or withdraw
        your fees from the staking pool.
      </div>
      <div className="flex flex-col w-full gap-1">
        {/* Add or Remove buttons */}
        <div className="flex w-full flex-row gap-2 mt-2">
          <UnstakeDialog tokenSymbol={tokenSymbol} livePoolAddress={livePoolAddress} memeMint={memeMint} />
          <WithdrawFeesDialog tokenSymbol={tokenSymbol} livePoolAddress={livePoolAddress} memeMint={memeMint} />
        </div>
      </div>
    </div>
  );
};
