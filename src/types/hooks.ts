import { SwapMemeOutput } from "@rinegade/memechan-sol-sdk";

export type SwapParams = {
  inputAmount: string;
  minOutputAmount: string;
  slippagePercentage: number;
  SuiToMeme: boolean;
};

export type QuoteSwapParams = {
  inputAmount: string;
  SuiToMeme: boolean;
  slippagePercentage: number;
};

export type GetSwapOutputAmountParams = {
  inputAmount: string;
  coinToMeme: boolean;
  slippagePercentage: number;
};

export type GetSwapTransactionParams = GetSwapOutputAmountParams & { minOutputAmount: string };
export type GetLiveSwapTransactionParams = { coinToMeme: boolean; outputData: SwapMemeOutput };

export type AddLiquidityParams = {
  memeCoinInput: string;
  suiCoinInput: string;
  minOutputAmount: string;
  slippagePercentage: number;
};

export type QuoteAddLiquidityParams = {
  memeCoinInput: string;
  suiCoinInput: string;
  slippagePercentage: number;
};

export type RemoveLiquidityParams = {
  lpCoinInput: string;
  minAmounts: {
    suiCoin: string;
    memeCoin: string;
  };
  slippagePercentage: number;
};

export type QuoteRemoveLiquidityParams = {
  lpCoinInput: string;
  slippagePercentage: number;
};
