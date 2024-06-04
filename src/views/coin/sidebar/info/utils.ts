import { BoundPool, MEMECHAN_QUOTE_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";

export const getBoundPoolProgress = (boundPool: BoundPool) => {
  const rawSlerfIn = boundPool.quoteReserve.toJSON().tokens;
  const formattedSlerfIn = new BigNumber(rawSlerfIn).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();
  const slerfLimit = boundPool.config.toJSON().gammaS;
  const progressInPercents = new BigNumber(formattedSlerfIn).div(slerfLimit).multipliedBy(100).toFixed(2);

  return { progress: progressInPercents, slerfIn: formattedSlerfIn, limit: slerfLimit };
};
