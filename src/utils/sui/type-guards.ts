import { ParsedTokenAccount, ParsedTokenAccountInfo, ParsedTokenAccountTokenAmount } from "./types";

export function isParsedTokenAccountTokenAmount(obj: unknown): obj is ParsedTokenAccountTokenAmount {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "amount" in obj &&
    typeof obj.amount === "string" &&
    "decimals" in obj &&
    typeof obj.decimals === "number" &&
    "uiAmount" in obj &&
    typeof obj.uiAmount === "number" &&
    "uiAmountString" in obj &&
    typeof obj.uiAmountString === "string"
  );
}

export function isParsedTokenAccountInfo(obj: unknown): obj is ParsedTokenAccountInfo {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "isNative" in obj &&
    typeof obj.isNative === "boolean" &&
    "mint" in obj &&
    typeof obj.mint === "string" &&
    "owner" in obj &&
    typeof obj.owner === "string" &&
    "state" in obj &&
    typeof obj.state === "string" &&
    "tokenAmount" in obj &&
    isParsedTokenAccountTokenAmount(obj.tokenAmount)
  );
}

export function isParsedTokenAccount(obj: unknown): obj is ParsedTokenAccount {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "info" in obj &&
    isParsedTokenAccountInfo(obj.info) &&
    "type" in obj &&
    typeof obj.type === "string"
  );
}
