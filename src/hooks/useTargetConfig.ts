import { NATIVE_MINT_STRING } from "@/common/solana";
import { TARGET_CONFIG_INTERVAL } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { TargetConfigClient, TokenInfo } from "@avernikoz/memechan-sol-sdk";
import { Connection } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
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

  const tokenInfo = getTokenInfo({ tokenAddress: NATIVE_MINT_STRING });

  const { data: targetConfig, ...rest } = useQuery({
    queryKey: ["target-config"],
    queryFn: () => fetchTargetConfig(connection, tokenInfo),
    staleTime: Infinity,
    refetchInterval: TARGET_CONFIG_INTERVAL,
  });

  const solanaThresholdAmount = targetConfig
    ? new BigNumber(targetConfig.tokenTargetAmount.toString()).div(10 ** tokenInfo.decimals).toString()
    : null;

  return { targetConfig, solanaThresholdAmount, ...rest };
}
