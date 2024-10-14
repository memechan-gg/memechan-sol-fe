import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { MemeTicketClient, MemeTicketClientV2 } from "@rinegade/memechan-sol-sdk";
import { ChangeEvent, SetStateAction } from "react";
import toast from "react-hot-toast";

export const validateSlippage = (slippage: string) => {
  const parsedSlippage = parseFloat(slippage);

  if (isNaN(parsedSlippage)) return toast.error("Slippage must be a valid number") && false;
  if (parsedSlippage < MIN_SLIPPAGE || parsedSlippage > MAX_SLIPPAGE)
    return toast.error("Slippage must be between 0 and 50") && false;

  return true;
};

export const handleSwapInputChange = ({
  e,
  setValue,
  decimalPlaces,
}: {
  e: ChangeEvent<HTMLInputElement>;
  setValue: (value: SetStateAction<string>) => void;
  decimalPlaces: number;
}) => {
  const input = e.target.value;

  // Allow empty value
  if (input === "") {
    setValue(input);
    return;
  }

  // Regular expression to validate numbers
  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);

  // If the value matches the regular expression, update the state
  if (regex.test(input)) {
    setValue(input);
  }
};

export const handleSlippageInputChange = ({
  e,
  setValue,
  decimalPlaces,
  min,
  max,
}: {
  e: ChangeEvent<HTMLInputElement>;
  setValue: (value: string) => void;
  decimalPlaces: number;
  min: number;
  max: number;
}) => {
  const input = e.target.value;

  // Allow empty value
  if (input === "") {
    setValue(input);
    return;
  }

  // Regular expression to validate numbers with up to `decimalPlaces` decimal places
  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);

  // If the value matches the regular expression, update the state
  if (regex.test(input)) {
    const numValue = parseFloat(input);

    // Ensure the number is between min and max, and prevent appending a dot after reaching max
    if (numValue >= min && numValue <= max && !(numValue === max && input.includes("."))) {
      setValue(input);
    }
  }
};

export const getFreeMemeTicketIndex = (freeIndexes: number[], version: "V1" | "V2") => {
  return freeIndexes[0] + (version === "V1" ? MemeTicketClient : MemeTicketClientV2).TICKET_NUMBER_START;
};
