import { ReactNode } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  setValue: (e: string) => void;
  value: string;
  placeholder?: string;
}

const TextInput = ({ startAdornment, endAdornment, value, setValue, placeholder, ...rest }: Props) => {
  return (
    <div
      className={`relative flex items-center border-2 rounded-lg p-4 border-gray-300 focus-within:border-primary-100 ${rest.className}`}
    >
      {startAdornment && <span className="m-[14px] flex">{startAdornment}</span>}
      <input
        {...rest}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none bg-transparent placeholder-mono-500 text-[13px] leading-5"
        placeholder={placeholder}
      />
      {endAdornment && <span className="flex">{endAdornment}</span>}
    </div>
  );
};

export default TextInput;
