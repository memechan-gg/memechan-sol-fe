import { BoundPool, MEMECHAN_MEME_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";

export const getBoundPoolProgress = (boundPool: BoundPool) => {
  const rawMainTokenIn = boundPool.quoteReserve.toJSON().tokens;
  const formattedMainTokenIn = new BigNumber(rawMainTokenIn).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();
  const mainTokenLimit = boundPool.config.toJSON().gammaS;
  const progressInPercents = new BigNumber(formattedMainTokenIn).div(mainTokenLimit).multipliedBy(100).toFixed(2);

  return { progress: progressInPercents, slerfIn: formattedMainTokenIn, limit: mainTokenLimit };
};
