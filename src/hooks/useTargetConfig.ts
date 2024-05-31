import { loadBalancedConnection } from "@/common/solana";
import { MEMECHAN_QUOTE_TOKEN_DECIMALS, MEMECHAN_TARGET_CONFIG, TargetConfigClient } from "@avernikoz/memechan-sol-sdk";
import BigNumber from "bignumber.js";
import useSWR from "swr";

const fetchTargetConfig = async () => {
  try {
    const targetConfig = await TargetConfigClient.fetch(loadBalancedConnection, MEMECHAN_TARGET_CONFIG);

    return targetConfig;
  } catch (e) {
    console.error(`[fetchTargetConfig] Failed to fetch target config ${MEMECHAN_TARGET_CONFIG.toString()}:`, e);
  }
};

export function useTargetConfig() {
  const { data: targetConfig, isLoading } = useSWR(`target-config`, fetchTargetConfig, {
    refreshInterval: 5000,
  });

  const slerfThresholdAmount = targetConfig
    ? new BigNumber(targetConfig.tokenTargetAmount.toString()).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString()
    : null;

  return { targetConfig, isLoading, slerfThresholdAmount };
}
