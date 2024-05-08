export function getSlippage(slippageText: string): number {
  const slippage = Number(slippageText.replace("%", ""));

  if (isNaN(slippage)) {
    return -1;
  }

  return slippage / 100;
}
