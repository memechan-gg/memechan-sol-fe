import { MEMECHAN_QUOTE_TOKEN_DECIMALS } from "@/common/solana";
import { MEMECHAN_MEME_TOKEN_DECIMALS, SwapMemeOutput } from "@avernikoz/memechan-sol-sdk";
import { Dispatch, SetStateAction } from "react";
import { InputAmountButtons } from "./input-amount-buttons";

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
  const inputValue = slerfToMeme ? slerfBalance : memeBalance;
  const inputDecimals = slerfToMeme ? MEMECHAN_QUOTE_TOKEN_DECIMALS : MEMECHAN_MEME_TOKEN_DECIMALS;

  return (
    <div className="flex flex-wrap justify-between">
      <div className="text-xs font-bold text-regular">
        {slerfToMeme ? `SLERF to ${tokenSymbol}` : `${tokenSymbol} to SLERF`}
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
