import { NATIVE_MINT_STRING } from "@/common/solana";
import { TARGET_CONFIG_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { TargetConfigClient, TokenInfo } from "@avernikoz/memechan-sol-sdk";
import { Connection } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import useSWR from "swr";
import { getTokenInfo } from "./utils";

const fetchTargetConfig = async (connection: Connection, tokenInfo: TokenInfo) => {
  try {
    const targetConfig = await TargetConfigClient.fetch(connection, tokenInfo.targetConfig);

    return targetConfig;
  } catch (e) {
    console.error(`[fetchTargetConfig] Failed to fetch target config ${tokenInfo.targetConfig.toString()}:`, e);
  }
};

export function useTargetConfig() {
  const { connection } = useConnection();

  const tokenInfo = getTokenInfo(NATIVE_MINT_STRING);

  const { data: targetConfig, isLoading } = useSWR(
    [`target-config`, connection],
    ([url, connection]) => fetchTargetConfig(connection, tokenInfo),
    {
      refreshInterval: TARGET_CONFIG_INTERVAL,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  );

  const slerfThresholdAmount = targetConfig
    ? new BigNumber(targetConfig.tokenTargetAmount.toString()).div(10 ** tokenInfo.decimals).toString()
    : null;

  return { targetConfig, isLoading, slerfThresholdAmount };
}
