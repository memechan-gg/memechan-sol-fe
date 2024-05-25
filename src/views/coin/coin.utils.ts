import { PoolStatus } from "@/types/pool";
import { getSlippage } from "@/utils";
import toast from "react-hot-toast";

export function validateSwapInput(
  sendTokenAmount: string,
  suiBalance: string,
  availableTickets: string,
  slippage: number,
  isXToY: boolean,
  status: PoolStatus,
  memeBalance?: string,
) {
  if (Number(sendTokenAmount) === 0) {
    toast.error("Please enter a valid amount");
    return false;
  }

  if (!isXToY && status === "PRESALE" && Number(sendTokenAmount) > Number(availableTickets)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (!isXToY && memeBalance && status === "LIVE" && Number(sendTokenAmount) > Number(memeBalance)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (isXToY && Number(sendTokenAmount) > Number(suiBalance)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (slippage < 0.01 || slippage > 50) {
    toast.error("Slippage must be between 0 and 50");
    return false;
  }

  return true;
}

export function validateAddLiquidityInput(
  memeAmount: string,
  suiAmount: string,
  memeBalance: string,
  suiBalance: string,
  slippage: string,
) {
  if (Number(memeAmount) === 0 || Number(suiAmount) === 0) {
    toast.error("Please enter a valid amount");
    return false;
  }

  if (Number(suiBalance) < Number(suiAmount)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (Number(memeBalance) < Number(memeAmount)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (getSlippage(slippage) === -1) {
    toast.error("Slippage must be between 0 and 100");
    return false;
  }

  return true;
}

export function validateRemoveLiquidityInput(inputLp: string, lpCoinBalance: string, slippage: string) {
  if (Number(inputLp) === 0) {
    toast.error("Please enter a valid amount");
    return false;
  }

  if (Number(lpCoinBalance) < Number(inputLp)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (getSlippage(slippage) === -1) {
    toast.error("Slippage must be between 0 and 100");
    return false;
  }

  return true;
}
