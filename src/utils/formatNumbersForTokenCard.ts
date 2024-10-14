import { QUOTE_TOKEN_DECIMALS } from "@/constants/constants";
import { getTokenInfo } from "@/hooks/utils";
import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { parseChainValue } from "./parseChainValue";
import { timeSince } from "./timeSpents";

interface Props {
  token: SolanaToken;
}

export const formatNumberForTokenCard = ({ token }: Props) => {
  if (!token?.quoteIn || !token?.quoteLimit || !token?.creationTime || !token?.holdersCount) {
    return undefined;
  }

  if (token.quoteSymbol === "SOL") {
    return {
      progress: isNaN((Number(token.quoteIn) / Number(token.quoteLimit)) * 100)
        ? undefined
        : (Number(token.quoteIn) / Number(token.quoteLimit)) * 100,
      totalQuoteAmount: parseChainValue(Number(token.quoteLimit), QUOTE_TOKEN_DECIMALS, 2) ?? undefined,
      currentQuoteAmount: parseChainValue(Number(token.quoteIn), QUOTE_TOKEN_DECIMALS, 4) ?? undefined,
      participactsAmount: token.holdersCount?.toString() ?? "",
      timeFromCreation: timeSince(token.creationTime),
    };
  }
  if (token.quoteSymbol === "SLERF") {
    const formattedSlerfIn = new BigNumber(token.quoteIn)
      .div(
        10 **
          getTokenInfo({
            tokenAddress: token.quoteMint || JSON.parse(token?.boundPoolJson || "")?.quoteReserve?.mint,
            variant: "string",
          }).decimals,
      )
      .toString();

    return {
      progress: isNaN((Number(formattedSlerfIn) / Number(token.quoteLimit)) * 100)
        ? undefined
        : (Number(formattedSlerfIn) / Number(token.quoteLimit)) * 100,
      totalQuoteAmount: token?.quoteLimit,
      currentQuoteAmount: parseChainValue(Number(formattedSlerfIn), 0, 2) ?? undefined,
      participactsAmount: token.holdersCount?.toString() ?? "",
      timeFromCreation: timeSince(token.creationTime),
    };
  }

  return {
    progress: isNaN((Number(token.quoteIn) / Number(token.quoteLimit)) * 100)
      ? undefined
      : (Number(token.quoteIn) / Number(token.quoteLimit)) * 100,
    totalQuoteAmount: token?.quoteLimit,
    currentQuoteAmount: parseChainValue(Number(token.quoteIn), 0, 2) ?? undefined,
    participactsAmount: token.holdersCount?.toString() ?? "",
    timeFromCreation: timeSince(token.creationTime),
  };
};
