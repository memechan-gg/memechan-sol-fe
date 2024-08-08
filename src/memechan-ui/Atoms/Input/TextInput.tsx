import { useTheme } from "next-themes";
import { ReactNode } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  startAdornmentClassName?: string;
  endAdornmentClassName?: string;
  setValue: (e: string) => void;
  value: string;
  placeholder?: string;
}

const TextInput = ({
  startAdornment,
  endAdornment,
  startAdornmentClassName = "",
  endAdornmentClassName = "",
  value,
  setValue,
  placeholder,
  ...rest
}: Props) => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center text-[13px] font-normal leading-5 text-mono-600 text-left sm:hover:opacity-90 active:opacity-80 custom-inner-shadow rounded-tl-[2px] rounded-tr-[2px] placeholder:text-[13px] placeholder:font-normal placeholder:leading-5 border  ${theme === "light" ? "border-primary-100" : "border-mono-400"} p-4 flex-1 outline-none bg-transparent placeholder-mono-500 w-full ${rest.className}`}
    >
      {startAdornment && <span className={`flex ${startAdornmentClassName}`}>{startAdornment}</span>}
      <input
        {...rest}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none bg-transparent placeholder-mono-500 text-[13px] leading-5"
        placeholder={placeholder}
      />
      {endAdornment && <span className={`flex ${endAdornmentClassName}`}>{endAdornment}</span>}
    </div>
  );
};

export default TextInput;
