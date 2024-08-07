import { QUOTE_TOKEN_DECIMALS } from "@/constants/constants";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { parseChainValue } from "./parseChainValue";
import { timeSince } from "./timeSpents";

interface Props {
  token: SolanaToken;
}

export const formatNumberForTokenCard = ({ token }: Props) => {
  if (
    !token?.quoteIn ||
    !token?.quoteLimit ||
    !token?.creationTime ||
    !token?.holdersCount ||
    token.quoteIn > token.quoteLimit ||
    token.quoteSymbol !== "SOL"
  ) {
    return undefined;
  }

  if (token.quoteSymbol === "SOL") {
    return {
      progress: (Number(token.quoteIn) / Number(token.quoteLimit)) * 100 ?? undefined,
      totalQuoteAmount: parseChainValue(Number(token.quoteLimit), QUOTE_TOKEN_DECIMALS, 2) ?? undefined,
      currentQuoteAmount: parseChainValue(Number(token.quoteIn), QUOTE_TOKEN_DECIMALS, 4) ?? undefined,
      participactsAmount: token.holdersCount?.toString() ?? "",
      timeFromCreation: timeSince(token.creationTime),
    };
  }
  return {
    progress: Number(token.quoteIn) / Number(token.quoteLimit) ?? undefined,
    totalQuoteAmount: token?.quoteLimit,
    currentQuoteAmount: parseChainValue(Number(token.quoteIn), 0, 2) ?? undefined,
    participactsAmount: token.holdersCount?.toString() ?? "",
    timeFromCreation: timeSince(token.creationTime),
  };
};
