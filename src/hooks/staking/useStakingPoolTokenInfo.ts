import { useQuery } from "@tanstack/react-query";
import { useStakingPoolClient } from "./useStakingPoolClient";

export const useStakingPoolTokenInfo = (address: string) => {
  const { data: stakingPoolClient } = useStakingPoolClient(address);

  return useQuery({
    queryKey: ["staking-pool", stakingPoolClient?.id],
    queryFn: stakingPoolClient?.getTokenInfo,
    enabled: !!stakingPoolClient?.getTokenInfo && !!stakingPoolClient?.id,
  });
};
