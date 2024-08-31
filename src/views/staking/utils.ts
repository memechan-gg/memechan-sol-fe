import BigNumber from "bignumber.js";
import toast from "react-hot-toast";

export const validateVestingClaimInputAmount = ({
  maxAmount,
  inputAmount,
}: {
  maxAmount: string;
  inputAmount: string;
}): boolean => {
  if (inputAmount === "0" || inputAmount === "" || BigNumber(inputAmount).isNaN()) {
    toast.error("Amount to claim must be valid number");
    return false;
  }

  if (BigNumber(inputAmount).gt(maxAmount)) {
    toast.error("Amount to claim cannot be greater than claimable amount");
    return false;
  }

  if (BigNumber(inputAmount).lte(0)) {
    toast.error("Amount to claim must be a positive number");
    return false;
  }

  return true;
};
