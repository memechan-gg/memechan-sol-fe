import { DIVIDE_V2 } from "@/constants/constants";
import { getTokenInfo } from "@/hooks/utils";
import { BoundPoolClient, BoundPoolClientV2 } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";

export const getBoundPoolProgress = (
  boundPool: BoundPoolClient["poolObjectData"] | BoundPoolClientV2["poolObjectData"],
  isV2?: boolean
) => {
  const rawSlerfIn = boundPool.quoteReserve.toJSON().tokens;

  const formattedSlerfIn = new BigNumber(rawSlerfIn)
    .div(10 ** getTokenInfo({ tokenAddress: boundPool.quoteReserve.mint, variant: "publicKey" }).decimals)
    .toString();
  let slerfLimit = boundPool.config.toJSON().gammaS;
  if(isV2) {
     slerfLimit = (+slerfLimit / DIVIDE_V2).toString() 
  }
  const progressInPercents = new BigNumber(formattedSlerfIn).div(slerfLimit).multipliedBy(100).toFixed(2);

  return { progress: progressInPercents, slerfIn: formattedSlerfIn, limit: slerfLimit };
};
