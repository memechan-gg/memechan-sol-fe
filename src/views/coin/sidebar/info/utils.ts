import { getTokenInfo } from "@/hooks/utils";
import { BoundPool } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";

export const getBoundPoolProgress = (boundPool: BoundPool) => {
  const rawSlerfIn = boundPool.quoteReserve.toJSON().tokens;

  const formattedSlerfIn = new BigNumber(rawSlerfIn)
    .div(10 ** getTokenInfo({ quoteMint: boundPool.quoteReserve.mint, variant: "publicKey" }).decimals)
    .toString();
  const slerfLimit = boundPool.config.toJSON().gammaS;
  const progressInPercents = new BigNumber(formattedSlerfIn).div(slerfLimit).multipliedBy(100).toFixed(2);

  return { progress: progressInPercents, slerfIn: formattedSlerfIn, limit: slerfLimit };
};
