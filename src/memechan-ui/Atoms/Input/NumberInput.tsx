import { ReactNode } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  startAdornmentClassName?: string;
  endAdornmentClassName?: string;
  setValue: (e: string) => void;
  value: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

const NumberInput = ({
  startAdornment,
  endAdornment,
  startAdornmentClassName = "",
  endAdornmentClassName = "",
  value,
  setValue,
  placeholder,
  min,
  max,
  ...rest
}: Props) => {
  return (
    <div
      className={`flex items-center text-[13px] font-normal leading-5 text-mono-600 text-left hover:opacity-90 active:opacity-80 custom-inner-shadow rounded-tl-[2px] rounded-tr-[2px] placeholder:text-[13px] placeholder:font-normal placeholder:leading-5 border border-mono-400 p-4 flex-1 outline-none bg-transparent placeholder-mono-500 w-full ${rest.className}`}
    >
      {startAdornment && <span className={`flex ${startAdornmentClassName}`}>{startAdornment}</span>}
      <input
        min={min}
        max={max}
        {...rest}
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none bg-transparent placeholder-mono-500 text-[13px] leading-5"
        placeholder={placeholder}
      />
      {endAdornment && <span className={`flex ${endAdornmentClassName}`}>{endAdornment}</span>}
    </div>
  );
};

export default NumberInput;
