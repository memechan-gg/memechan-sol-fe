import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
  placeholder?: string;
  className?: string;
}

const TextInput = ({ startAdornment, endAdornment, value, setValue, placeholder, className}: Props) => {
  return (
    <div className={`relative flex items-center rounded-sm pink-border ${className}`}>
      {startAdornment && <span className="m-[14px] flex">{startAdornment}</span>}
      <input
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
