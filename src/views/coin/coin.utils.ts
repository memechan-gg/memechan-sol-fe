import { getSlippage } from "@/utils";
import BigNumber from "bignumber.js";
import toast from "react-hot-toast";

export function presaleSwapParamsAreValid({
  availableTicketsAmount,
  inputAmount,
  coinBalance,
  slerfToMeme,
  slippagePercentage,
}: {
  inputAmount: string;
  coinBalance: string;
  availableTicketsAmount: string;
  slippagePercentage: number;
  slerfToMeme: boolean;
}) {
  if (new BigNumber(inputAmount).eq(0)) {
    toast.error("Input amount must be greater than zero");
    return false;
  }

  if (slerfToMeme && new BigNumber(inputAmount).gt(coinBalance)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (!slerfToMeme && new BigNumber(inputAmount).gt(availableTicketsAmount)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (slippagePercentage < 0 || slippagePercentage > 50) {
    toast.error("Slippage must be between 0 and 50");
    return false;
  }

  return true;
}

export function liveSwapParamsAreValid({
  memeBalance,
  inputAmount,
  coinBalance,
  slerfToMeme,
  slippagePercentage,
}: {
  inputAmount: string;
  coinBalance: string;
  memeBalance?: string;
  slippagePercentage: number;
  slerfToMeme: boolean;
}) {
  if (new BigNumber(inputAmount).eq(0)) {
    toast.error("Input amount must be greater than zero");
    return false;
  }

  if (slerfToMeme && new BigNumber(inputAmount).gt(coinBalance)) {
    toast.error("Insufficient balance");
    return false;
  }

  if (!slerfToMeme && (!memeBalance || new BigNumber(inputAmount).gt(memeBalance))) {
    toast.error("Insufficient balance");
    return false;
  }

  if (slippagePercentage < 0 || slippagePercentage > 50) {
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
