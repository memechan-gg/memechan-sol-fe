import { TARGET_CONFIG_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { MEMECHAN_MEME_TOKEN_DECIMALS, MEMECHAN_TARGET_CONFIG, TargetConfigClient } from "@avernikoz/memechan-sol-sdk";
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

  const mainTokenThresholdAmount = targetConfig
    ? new BigNumber(targetConfig.tokenTargetAmount.toString()).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString()
    : null;

  return { targetConfig, isLoading, mainTokenThresholdAmount };
}
