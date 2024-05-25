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
  slerfToMeme: boolean;
  slippagePercentage: number;
};

export type GetSwapTransactionParams = GetSwapOutputAmountParams & { minOutputAmount: string };

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
