// import { MEMECHAN_QUOTE_TOKEN_DECIMALS } from "@/common/solana";
import { getTokenInfo } from "@/hooks/utils";
import { MEMECHAN_MEME_TOKEN_DECIMALS, SwapMemeOutput } from "memechan-sol-sdk";
import { Dispatch, SetStateAction } from "react";
import { InputAmountButtons } from "./input-amount-buttons";

export const InputAmountTitle = ({
  coinToMeme,
  tokenSymbol,
  memeBalance,
  coinBalance,
  setInputAmount,
  setOutputData,
  quoteMint,
}: {
  coinToMeme: boolean;
  tokenSymbol: string;
  coinBalance: string | undefined;
  memeBalance: string | undefined;
  setInputAmount: Dispatch<SetStateAction<string>>;
  setOutputData: Dispatch<SetStateAction<SwapMemeOutput | null>> | Dispatch<SetStateAction<string | null>>;
  quoteMint: string;
}) => {
  const inputValue = coinToMeme ? coinBalance : memeBalance;
  const tokenInfo = getTokenInfo({ tokenAddress: quoteMint });
  const inputDecimals = coinToMeme ? tokenInfo.decimals : MEMECHAN_MEME_TOKEN_DECIMALS;
  return (
    <div className="flex flex-wrap justify-between">
      <div className="text-xs font-bold text-regular">
        {coinToMeme ? `${tokenInfo.displayName} to ${tokenSymbol}` : `${tokenSymbol} to ${tokenInfo.displayName}`}
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
