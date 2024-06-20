import { MEMECHAN_QUOTE_TOKEN_DECIMALS, MEMECHAN_TARGET_CONFIG } from "@/common/solana";
import { TARGET_CONFIG_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { TargetConfigClient } from "@avernikoz/memechan-sol-sdk";
import { Connection } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import useSWR from "swr";

const fetchTargetConfig = async (connection: Connection) => {
  try {
    const targetConfig = await TargetConfigClient.fetch(connection, MEMECHAN_TARGET_CONFIG);

    return targetConfig;
  } catch (e) {
    console.error(`[fetchTargetConfig] Failed to fetch target config ${MEMECHAN_TARGET_CONFIG.toString()}:`, e);
  }
};

export function useTargetConfig() {
  const { connection } = useConnection();
  const { data: targetConfig, isLoading } = useSWR(
    [`target-config`, connection],
    ([url, connection]) => fetchTargetConfig(connection),
    {
      refreshInterval: TARGET_CONFIG_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const slerfThresholdAmount = targetConfig
    ? new BigNumber(targetConfig.tokenTargetAmount.toString()).div(10 ** MEMECHAN_QUOTE_TOKEN_DECIMALS).toString()
    : null;

  return { targetConfig, isLoading, slerfThresholdAmount };
}
