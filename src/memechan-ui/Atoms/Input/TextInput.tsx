import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
  placeholder?: string;
}

const TextInput = ({ startAdornment, endAdornment, value, setValue, placeholder }: Props) => {
  return (
    <div className="relative flex items-center rounded-sm pink-border">
      {startAdornment && <span className="m-[14px] flex">{startAdornment}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none bg-transparent placeholder-mono-500"
        placeholder={placeholder}
      />
      {endAdornment && <span className="flex">{endAdornment}</span>}
    </div>
  );
};

export default TextInput;
