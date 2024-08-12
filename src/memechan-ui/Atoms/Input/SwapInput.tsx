import { formatNumberForDisplay } from "@/utils/formatNumber";
import { useTheme } from "next-themes";
import { ChangeEvent, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Typography } from "../Typography";

interface SwapInputProps {
  currencyName: string;
  currencyLogoUrl: string;
  inputValue: string;
  placeholder?: string;
  disabled?: boolean;
  setInputValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  usdPrice?: number;
  isReadOnly?: boolean;
  type?: "text" | "number";
  label?: string;
  labelRight?: string;
  showQuickInput?: boolean;
  baseCurrencyAmount?: number;
  tokenDecimals?: number;
  isRefreshing?: boolean;
  quickInputNumber?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  currencyName,
  currencyLogoUrl,
  inputValue,
  type = "number",
  placeholder,
  disabled = false,
  setInputValue,
  usdPrice,
  isReadOnly,
  label,
  labelRight,
  showQuickInput = false,
  baseCurrencyAmount,
  tokenDecimals,
  isRefreshing = false,
  quickInputNumber = false,
}) => {
  // const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // const handleFocus = () => {
  //   if (!isReadOnly) {
  //     setIsFocused(true);
  //     inputRef.current?.focus();
  //   }
  // };

  const quickInputClick = (value: number, isPercentage: boolean) => {
    if (setInputValue && inputRef.current) {
      const changeEvent = {
        target: inputRef.current,
        currentTarget: inputRef.current,
      } as ChangeEvent<HTMLInputElement>;
      if (!isPercentage) {
        changeEvent.target.value = value.toString();
        setInputValue(changeEvent);
        return;
      }
      const baseAmount = (value * (baseCurrencyAmount ?? 0)) / 100;
      const result = baseAmount.toString().split(".");
      if (result[1] && tokenDecimals !== undefined) {
        result[1] = result[1].slice(0, tokenDecimals);
      }
      changeEvent.target.value = result.join(".");
      setInputValue(changeEvent);
    }
  };
  return (
    <div>
      <div className="flex justify-between pb-1">
        {label && (
          <label htmlFor="fromValue">
            <Typography color="mono-500" variant="body">
              {label}
            </Typography>
          </label>
        )}
        {labelRight && (
          <label
            htmlFor="fromValue"
            onClick={() => {
              quickInputClick(100, true);
            }}
          >
            <Typography color="mono-500" variant="body">
              {labelRight}
            </Typography>
          </label>
        )}
      </div>
      <div
        // onClick={handleFocus}
        className={`flex custom-inner-shadow h-14 items-center px-3 py-1.5 rounded-tl-[2px] rounded-tr-[2px] border border-mono-400`}
      >
        <div className={`cursor-pointer mr-1 ${isReadOnly ? "cursor-default" : ""}`}>
          <span className="relative flex items-center gap-1.5">
            <img
              src={currencyLogoUrl}
              alt={currencyName}
              width="24"
              height="24"
              className="object-cover rounded-sm"
              style={{ maxWidth: 24, maxHeight: 24 }}
            />
            <Typography variant="h3">{currencyName}</Typography>
          </span>
        </div>
        <span className="flex-1 text-right">
          <div className="flex flex-col text-right h-full">
            {!isRefreshing ? (
              <input
                ref={inputRef}
                inputMode="decimal"
                autoComplete="off"
                name="fromValue"
                data-lpignore="true"
                placeholder={placeholder}
                className="h-full w-full size-4 leading-6 bg-transparent disabled:cursor-not-allowed disabled:opacity-100 disabled:text-black dark:text-white text-right font-bold dark:placeholder:text-white/25 outline-none"
                type={type}
                value={inputValue}
                onChange={(e) => setInputValue?.(e)}
                // onFocus={() => setIsFocused(true)}
                // onBlur={() => setIsFocused(false)}
                readOnly={isReadOnly}
                disabled={disabled}
                style={{
                  // Inline styles to remove the spinner
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
            ) : (
              <div>
                <Skeleton
                  count={1}
                  height={"100%"}
                  width={"50%"}
                  baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                  highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                />
              </div>
            )}
            <div className="text-xs text-black-35 dark:text-white-35">
              {usdPrice !== 0 && usdPrice !== undefined && (
                <Typography color="mono-500">${formatNumberForDisplay(usdPrice)}</Typography>
              )}
            </div>
          </div>
        </span>
      </div>
      {showQuickInput && (
        <div
          className={`flex cursor-pointer custom-inner-shadow h-9 items-center rounded-tl-[2px] rounded-tr-[2px] border border-mono-400 justify-between w-full`}
        >
          <div
            role="button"
            className="flex justify-center items-center w-1/6 sm:hover:bg-mono-300 active:bg-mono-400 h-full"
            onClick={() => {
              if (disabled) return;
              quickInputClick(quickInputNumber ? 0.1 : 1, !quickInputNumber);
            }}
          >
            <Typography variant="text-button" underline color="mono-500">
              {quickInputNumber ? "0.1" : "1%"}
            </Typography>
          </div>
          <div
            className="border-l border-mono-400 flex justify-center items-center w-1/6 h-full sm:hover:bg-mono-300 active:bg-mono-400"
            onClick={() => {
              if (disabled) return;
              quickInputClick(quickInputNumber ? 0.25 : 5, !quickInputNumber);
            }}
          >
            <Typography variant="text-button" underline color="mono-500">
              {quickInputNumber ? "0.25" : "5%"}
            </Typography>
          </div>
          <div
            className="border-l border-mono-400 flex justify-center items-center w-1/6 sm:hover:bg-mono-300 active:bg-mono-400 h-full"
            onClick={() => {
              if (disabled) return;
              quickInputClick(quickInputNumber ? 0.5 : 10, !quickInputNumber);
            }}
          >
            <Typography variant="text-button" underline color="mono-500">
              {quickInputNumber ? "0.5" : "10%"}
            </Typography>
          </div>
          <div
            className="border-l border-mono-400 flex justify-center items-center w-1/6 sm:hover:bg-mono-300 active:bg-mono-400 h-full"
            onClick={() => {
              if (disabled) return;
              quickInputClick(quickInputNumber ? 1 : 25, !quickInputNumber);
            }}
          >
            <Typography variant="text-button" underline color="mono-500">
              {quickInputNumber ? "1.0" : "25%"}
            </Typography>
          </div>
          <div
            className="border-l border-mono-400 flex justify-center items-center w-1/6 sm:hover:bg-mono-300 active:bg-mono-400 h-full"
            onClick={() => {
              if (disabled) return;
              quickInputClick(quickInputNumber ? 3 : 50, !quickInputNumber);
            }}
          >
            <Typography variant="text-button" underline color="mono-500">
              {quickInputNumber ? "3.0" : "50%"}
            </Typography>
          </div>
          <div
            className="border-l border-mono-400 flex justify-center items-center w-1/6 sm:hover:bg-mono-300 active:bg-mono-400 h-full"
            onClick={() => {
              if (disabled) return;
              quickInputClick(quickInputNumber ? 5 : 100, !quickInputNumber);
            }}
          >
            <Typography variant="text-button" underline color="mono-500">
              {quickInputNumber ? "5.0" : "100%"}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
