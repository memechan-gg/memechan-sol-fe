import {
  MEMECHAN_MEME_TOKEN_DECIMALS,
  MEMECHAN_QUOTE_TOKEN_DECIMALS,
  SwapMemeOutput,
} from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { Dispatch, SetStateAction } from "react";

export const InputAmountTitle = ({
  slerfToMeme,
  tokenSymbol,
  memeBalance,
  slerfBalance,
  setInputAmount,
  setOutputData,
}: {
  slerfToMeme: boolean;
  tokenSymbol: string;
  slerfBalance: string | undefined;
  memeBalance: string | undefined;
  setInputAmount: Dispatch<SetStateAction<string>>;
  setOutputData: Dispatch<SetStateAction<SwapMemeOutput | null>> | Dispatch<SetStateAction<string | null>>;
}) => {
  const handleInputAmountPercentButtonClick = (percent: number | string) => {
    const inputValue = slerfToMeme ? slerfBalance : memeBalance;
    const inputDecimals = slerfToMeme ? MEMECHAN_QUOTE_TOKEN_DECIMALS : MEMECHAN_MEME_TOKEN_DECIMALS;

    if (!inputValue) {
      setInputAmount("");
      return;
    }

    const partialAmount = new BigNumber(inputValue).multipliedBy(percent).div(100).toFixed(inputDecimals);

    setInputAmount(partialAmount);
  };

  const handleResetClick = () => {
    setInputAmount("");
    setOutputData(null);
  };

  return (
    <div className="flex flex-wrap justify-between">
      <div className="text-xs font-bold text-regular">
        {slerfToMeme ? `SLERF to ${tokenSymbol}` : `${tokenSymbol} to SLERF`}
      </div>
      <div className="flex items-self-end gap-3 justify-self-end mr-1">
        <div className="text-regular hover:underline cursor-pointer font-bold" onClick={handleResetClick}>
          reset
        </div>
        <div
          className="text-regular hover:underline cursor-pointer font-bold"
          onClick={() => handleInputAmountPercentButtonClick(25)}
        >
          25%
        </div>
        <div
          className="text-regular hover:underline cursor-pointer font-bold"
          onClick={() => handleInputAmountPercentButtonClick(50)}
        >
          50%
        </div>
        <div
          className="text-regular hover:underline cursor-pointer font-bold"
          onClick={() => handleInputAmountPercentButtonClick(75)}
        >
          75%
        </div>
        <div
          className="text-regular hover:underline cursor-pointer font-bold"
          onClick={() => handleInputAmountPercentButtonClick(100)}
        >
          max
        </div>
      </div>
    </div>
  );
};
