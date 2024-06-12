import BigNumber from "bignumber.js";

export const InputAmountButtons = ({
  maxAmount,
  decimals,
  setInputAmount,
  setOutputAmount,
}: {
  maxAmount: string | undefined | null;
  decimals: number;
  setInputAmount: (data: any) => void;
  setOutputAmount?: (data: any) => void;
}) => {
  const handleInputAmountPercentButtonClick = (percent: number | string) => {
    if (!maxAmount) {
      setInputAmount("");
      return;
    }

    const partialAmount = new BigNumber(maxAmount).multipliedBy(percent).div(100).toFixed(decimals);

    setInputAmount(partialAmount);
  };

  const handleResetClick = () => {
    setInputAmount("");
    if (setOutputAmount) setOutputAmount(null);
  };

  return (
    <div className="flex items-self-end gap-3 justify-self-end mr-1 font-bold">
      <div className="text-regular hover:underline cursor-pointer" onClick={handleResetClick}>
        reset
      </div>
      <div
        className="text-regular hover:underline cursor-pointer"
        onClick={() => handleInputAmountPercentButtonClick(25)}
      >
        25%
      </div>
      <div
        className="text-regular hover:underline cursor-pointer"
        onClick={() => handleInputAmountPercentButtonClick(50)}
      >
        50%
      </div>
      <div
        className="text-regular hover:underline cursor-pointer"
        onClick={() => handleInputAmountPercentButtonClick(75)}
      >
        75%
      </div>
      <div
        className="text-regular hover:underline cursor-pointer"
        onClick={() => handleInputAmountPercentButtonClick(100)}
      >
        max
      </div>
    </div>
  );
};
