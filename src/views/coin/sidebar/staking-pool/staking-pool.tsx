import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { StakingPoolProps } from "../../coin.types";
import { UnstakeDialog } from "./unstake/unstake-dialog";
import { WithdrawFeesDialog } from "./withdraw-fees/withdraw-fees-dialog";

export const StakingPool = ({ tokenSymbol, livePoolAddress, ticketsData, stakingPoolFromApi }: StakingPoolProps) => {
  console.log("Selam merab!!!!");
  return (
    <div className="flex flex-col gap-2 w-full">
      <Card>
        <Card.Header>
          <Typography variant="h4" color="mono-600">
            Staking Pool
          </Typography>
        </Card.Header>
        <Card.Body>
          <Typography variant="body" color="mono-500">
            As Pre-Sale investor you are earning fees from trading of the{" "}
            <span className="!normal-case underline">{tokenSymbol}</span> token. You can unstake your staked memecoins
            or withdraw your fees from the staking pool.
          </Typography>
          <div className="flex flex-col w-full gap-1 mt-4">
            <div className="flex w-full flex-row gap-4 mt-2 justify-between">
              <UnstakeDialog
                tokenSymbol={tokenSymbol}
                livePoolAddress={livePoolAddress}
                ticketsData={ticketsData}
                stakingPoolFromApi={stakingPoolFromApi}
              />
              <WithdrawFeesDialog
                tokenSymbol={tokenSymbol}
                livePoolAddress={livePoolAddress}
                ticketsData={ticketsData}
                stakingPoolFromApi={stakingPoolFromApi}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
