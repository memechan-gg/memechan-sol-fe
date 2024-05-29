import { MAX_TICKET_TOKENS, MEMECHAN_MEME_TOKEN_DECIMALS, MemeTicketFields } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import BN from "bn.js";

export const getBondingCurvePercentage = (uniqueHolders: Map<string, MemeTicketFields[]>) => {
  const rawBondingCurveAmount = Array.from(uniqueHolders.values()).reduce(
    (result, holderTickets) => {
      holderTickets.forEach((ticket) => {
        result = result.sub(ticket.amount);
      });

      return result;
    },
    new BN(MAX_TICKET_TOKENS).mul(new BN(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)),
  );

  const formattedBondingCurveAmount = new BigNumber(rawBondingCurveAmount.toString())
    .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)
    .toString();

  const bondingCurvePercentage = new BigNumber(formattedBondingCurveAmount)
    .div(MAX_TICKET_TOKENS)
    .multipliedBy(100)
    .toFixed(2);

  return bondingCurvePercentage;
};
