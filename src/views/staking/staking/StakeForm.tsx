import { useState } from "react";
import Button from "./Button";

// Header Component
const Header = ({ title }: { title: string }) => (
  <div className="flex flex-col justify-center items-start px-4 py-1.5 w-full text-sm font-bold text-white bg-neutral-700">
    {title}
  </div>
);

// StakingInfo Component
const StakingInfo = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between w-full text-sm text-neutral-400">
    <div>{label}</div>
    <div className="flex items-center text-right">
      <div className="mr-2">👛</div>
      <div>{value}</div>
    </div>
  </div>
);

// StakeAmount Component
const StakeAmount = ({
  stakeAmount,
  onPercentageChange,
}: {
  stakeAmount: number;
  onPercentageChange: (percentage: number) => void;
}) => (
  <div className="mt-2 flex flex-col w-full">
    <div className="flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm bg-neutral-800 border-neutral-700">
      <div className="flex items-center text-white font-bold">
        <img loading="lazy" src="http://b.io/ext_17-" alt="vCHAN icon" className="w-6 h-6 mr-2" />
        <span>vCHAN</span>
      </div>
      <div className="text-right text-white font-bold">{stakeAmount.toLocaleString()}</div>
      <div className="text-sm text-neutral-400">${(stakeAmount * 0.0001424).toFixed(2)}</div>
    </div>
    <div className="flex mt-2 w-full text-neutral-400">
      {["10%", "20%", "25%", "50%", "75%", "100%"].map((percentage, index) => (
        <div
          key={index}
          className="flex-1 text-center py-1 cursor-pointer border border-neutral-700"
          onClick={() => onPercentageChange(parseInt(percentage))}
        >
          {percentage}
        </div>
      ))}
    </div>
  </div>
);

// StakePeriod Component
const StakePeriod = ({
  selectedPeriod,
  onSelectPeriod,
}: {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}) => (
  <div className="flex flex-col mt-4 w-full text-neutral-400">
    <div>For period of</div>
    <div className="flex mt-2 w-full text-center">
      {["7d", "14D", "1M", "3M", "6M", "12M"].map((period, index) => (
        <div
          key={index}
          className={`flex-1 py-1 cursor-pointer border ${
            period === selectedPeriod ? "text-pink-500 border-pink-500" : "border-neutral-700"
          }`}
          onClick={() => onSelectPeriod(period)}
        >
          {period}
        </div>
      ))}
    </div>
  </div>
);

// AdditionalInfo Component
const AdditionalInfo = ({ baseAPR, pointBoost, apr }: { baseAPR: string; pointBoost: string; apr: string }) => (
  <div className="mt-4 w-full text-neutral-400">
    <div className="flex justify-between">
      <span>Base APR</span>
      <span className="font-bold text-white">{baseAPR}</span>
    </div>
    <div className="flex justify-between mt-2">
      <span>Your Point Boost</span>
      <span className="font-bold text-white">{pointBoost}</span>
    </div>
    <div className="flex justify-between mt-2 text-green-600">
      <span>Your APR</span>
      <span className="font-bold">{apr}</span>
    </div>
  </div>
);

// Main StakeForm Component
const StakeForm = () => {
  const [stakeAmount, setStakeAmount] = useState<number>(100000);
  const [stakePeriod, setStakePeriod] = useState<string>("12M");

  const handleStakeAmountChange = (percentage: number) => {
    setStakeAmount(100000 * (percentage / 100));
  };

  const handleStakePeriodChange = (period: string) => {
    setStakePeriod(period);
  };

  return (
    <div className="flex flex-col grow pb-3.5 w-full rounded-sm border border-solid shadow-sm bg-neutral-800 border-neutral-700 max-md:mt-3">
      <Header title="Stake" />
      <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
        <StakingInfo label="Staking" value="100,000 vCHAN" />
        <StakeAmount stakeAmount={stakeAmount} onPercentageChange={handleStakeAmountChange} />
        <StakePeriod selectedPeriod={stakePeriod} onSelectPeriod={handleStakePeriodChange} />
        <Button onClick={() => {}} className="mt-4 py-3 w-full text-white bg-pink-500 rounded-sm">
          Stake
        </Button>
        <AdditionalInfo baseAPR="14.88%" pointBoost="x0.1" apr="16.42%" />
      </div>
    </div>
  );
};

export default StakeForm;
