import { useMainTokenName } from "@/hooks/useMainTokenName";
import { MEMECHAN_MEME_TOKEN_DECIMALS, SwapMemeOutput } from "@avernikoz/memechan-sol-sdk";
import { Dispatch, SetStateAction } from "react";
import { InputAmountButtons } from "./input-amount-buttons";

export const InputAmountTitle = ({
  mainTokenToMeme,
  tokenSymbol,
  memeBalance,
  mainTokenBalance,
  setInputAmount,
  setOutputData,
}: {
  mainTokenToMeme: boolean;
  tokenSymbol: string;
  mainTokenBalance: string | undefined;
  memeBalance: string | undefined;
  setInputAmount: Dispatch<SetStateAction<string>>;
  setOutputData: Dispatch<SetStateAction<SwapMemeOutput | null>> | Dispatch<SetStateAction<string | null>>;
}) => {
  const inputValue = mainTokenToMeme ? mainTokenBalance : memeBalance;
  const inputDecimals = mainTokenToMeme ? MEMECHAN_MEME_TOKEN_DECIMALS : MEMECHAN_MEME_TOKEN_DECIMALS;
  const mainTokenName = useMainTokenName();

  return (
    <div className="flex flex-wrap justify-between">
      <div className="text-xs font-bold text-regular">
        {mainTokenToMeme ? `${mainTokenName} to ${tokenSymbol}` : `${tokenSymbol} to ${mainTokenName}`}
      </div>
      <InputAmountButtons
        setInputAmount={setInputAmount}
        setOutputAmount={setOutputData}
        maxAmount={inputValue}
        decimals={inputDecimals}
      />
    </div>
  );
};
