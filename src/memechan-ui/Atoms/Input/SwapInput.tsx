import { ChangeEvent, useRef, useState } from "react";
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (!isReadOnly) {
      setIsFocused(true);
      inputRef.current?.focus();
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
          <label htmlFor="fromValue">
            <Typography color="mono-500" variant="body">
              {labelRight}
            </Typography>
          </label>
        )}
      </div>
      <div
        onClick={handleFocus}
        className={`flex custom-inner-shadow h-14 items-center px-3 py-1.5 rounded-tl-[2px] rounded-tr-[2px] ${isFocused && !isReadOnly ? "border border-primary-100" : "border border-mono-400"}`}
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
            <input
              ref={inputRef}
              inputMode="decimal"
              autoComplete="off"
              name="fromValue"
              data-lpignore="true"
              placeholder={placeholder}
              className="h-full w-full bg-transparent disabled:cursor-not-allowed disabled:opacity-100 disabled:text-black dark:text-white text-right font-semibold dark:placeholder:text-white/25 text-xl outline-none"
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue?.(e)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              readOnly={isReadOnly}
              disabled={disabled}
              style={{
                // Inline styles to remove the spinner
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
            <div className="text-xs text-black-35 dark:text-white-35">
              {!!usdPrice && <Typography color="mono-500">${usdPrice.toFixed(2)}</Typography>}
              <Typography color="mono-500"> </Typography>
            </div>
          </div>
        </span>
      </div>
    </div>
  );
};
