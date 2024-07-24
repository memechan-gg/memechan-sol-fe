import { Chart } from "@/components/Chart";

export interface ChartTabProps {
  seedPoolDataAddress: string;
  tokenSymbol: string;
}
export function ChartTab({ seedPoolDataAddress, tokenSymbol }: ChartTabProps) {
  return <Chart address={seedPoolDataAddress} tokenName={tokenSymbol.toUpperCase()} />;
}
