import { MEMECHAN_QUOTE_TOKEN_DECIMALS } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useBoundPool } from "./useBoundPool";

export function useBoundPoolProgress(poolAddress: string) {
  const [progressData, setProgressData] = useState<{ progress: string; slerfIn: string; limit: string }>({
    progress: "0",
    slerfIn: "0",
    limit: "0",
  });
  const boundPool = useBoundPool(poolAddress);
  console.log("boundPool:", boundPool?.toJSON());

  useEffect(() => {
    if (boundPool) {
      const rawSlerfIn = boundPool.memeReserve.toJSON().tokens;
      const formattedSlerfIn = new BigNumber(rawSlerfIn).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();
      const rawSlerfLimit = boundPool.config.toJSON().gammaS;
      const progressInPercents = new BigNumber(rawSlerfIn).div(rawSlerfLimit).multipliedBy(100).toString();
      const slerfLimit = new BigNumber(rawSlerfLimit).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString();

      setProgressData({ progress: progressInPercents, slerfIn: formattedSlerfIn, limit: slerfLimit });
    }
  }, [boundPool]);

  return progressData;
}
