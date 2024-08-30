import { useTheme } from "next-themes";
import { useState } from "react";
import Button from "./Button";

// Header Component
const Header = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-[#800000]" : "bg-neutral-700";
  const textColor = "text-white";

  return (
    <div
      className={`flex flex-col justify-center items-start px-4 py-1.5 w-full text-sm font-bold ${textColor} ${bgColor}`}
    >
      {title}
    </div>
  );
};

// StakingInfo Component
const StakingInfo = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`flex justify-between w-full text-sm ${textColor}`}>
      <div>{label}</div>
      <div className="flex items-center text-right">
        <div className="mr-2">👛</div>
        <div>{value}</div>
      </div>
    </div>
  );
};

// StakeAmount Component
const StakeAmount = ({
  stakeAmount,
  onPercentageChange,
}: {
  stakeAmount: number;
  onPercentageChange: (percentage: number) => void;
}) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const secondaryTextColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className="mt-2 flex flex-col w-full">
      <div
        className={`flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm ${bgColor} ${borderColor}`}
      >
        <div className={`flex items-center ${textColor} font-bold`}>
          <img loading="lazy" src="http://b.io/ext_17-" alt="vCHAN icon" className="w-6 h-6 mr-2" />
          <span>vCHAN</span>
        </div>
        <div className={`text-right ${textColor} font-bold`}>{stakeAmount.toLocaleString()}</div>
        <div className={`text-sm ${secondaryTextColor}`}>${(stakeAmount * 0.0001424).toFixed(2)}</div>
      </div>
      <div className={`flex mt-2 w-full ${secondaryTextColor}`}>
        {["10%", "20%", "25%", "50%", "75%", "100%"].map((percentage, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-1 cursor-pointer border ${borderColor}`}
            onClick={() => onPercentageChange(parseInt(percentage))}
          >
            {percentage}
          </div>
        ))}
      </div>
    </div>
  );
};

// StakePeriod Component
const StakePeriod = ({
  selectedPeriod,
  onSelectPeriod,
}: {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const selectedColor = theme === "light" ? "text-[#7F0002] border-[#7F0002]" : "text-pink-500 border-pink-500";

  return (
    <div className={`flex flex-col mt-4 w-full ${textColor}`}>
      <div>For period of</div>
      <div className="flex mt-2 w-full text-center">
        {["7d", "14D", "1M", "3M", "6M", "12M"].map((period, index) => (
          <div
            key={index}
            className={`flex-1 py-1 cursor-pointer border ${period === selectedPeriod ? selectedColor : borderColor}`}
            onClick={() => onSelectPeriod(period)}
          >
            {period}
          </div>
        ))}
      </div>
    </div>
  );
};

// AdditionalInfo Component
const AdditionalInfo = ({ baseAPR, pointBoost, apr }: { baseAPR: string; pointBoost: string; apr: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const highlightColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`mt-4 w-full ${textColor}`}>
      <div className="flex justify-between">
        <span>Base APR</span>
        <span className={`font-bold ${highlightColor}`}>{baseAPR}</span>
      </div>
      <div className="flex justify-between mt-2">
        <span>Your Point Boost</span>
        <span className={`font-bold ${highlightColor}`}>{pointBoost}</span>
      </div>
      <div className="flex justify-between mt-2 text-green-700">
        <span>Your APR</span>
        <span className="font-bold">{apr}</span>
      </div>
    </div>
  );
};

// Main StakeForm Component
const StakeForm = () => {
  const [stakeAmount, setStakeAmount] = useState<number>(100000);
  const [stakePeriod, setStakePeriod] = useState<string>("12M");
  const { theme } = useTheme();

  const handleStakeAmountChange = (percentage: number) => {
    setStakeAmount(100000 * (percentage / 100));
  };

  const handleStakePeriodChange = (period: string) => {
    setStakePeriod(period);
  };

  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";
  const buttonColor = theme === "light" ? "bg-[#7F0002]" : "bg-pink-500";

  return (
    <div
      className={`flex flex-col grow pb-3.5 w-full rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor} max-md:mt-3`}
    >
      <Header title="Stake" />
      <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
        <StakingInfo label="Staking" value="100,000 vCHAN" />
        <StakeAmount stakeAmount={stakeAmount} onPercentageChange={handleStakeAmountChange} />
        <StakePeriod selectedPeriod={stakePeriod} onSelectPeriod={handleStakePeriodChange} />
        <Button onClick={() => {}} className={`mt-4 py-3 w-full text-white ${buttonColor} rounded-sm`}>
          Stake
        </Button>
        <AdditionalInfo baseAPR="14.88%" pointBoost="x0.1" apr="16.42%" />
      </div>
    </div>
  );
};

export default StakeForm;
