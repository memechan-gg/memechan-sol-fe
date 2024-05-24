export type ParsedTokenAccountTokenAmount = {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
};

export type ParsedTokenAccountInfo = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: ParsedTokenAccountTokenAmount;
};

export type ParsedTokenAccount = {
  info: ParsedTokenAccountInfo;
  type: string;
};
