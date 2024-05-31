import toast from "react-hot-toast";

export const validateSlippage = (slippage: string) => {
  const parsedSlippage = parseFloat(slippage);

  if (isNaN(parsedSlippage)) return toast.error("Slippage must be a valid number") && false;
  if (parsedSlippage < 0 || parsedSlippage > 50) return toast.error("Slippage must be between 0 and 50") && false;

  return true;
};
