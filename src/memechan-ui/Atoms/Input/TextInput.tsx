import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
}

const TextInput = ({ startAdornment, endAdornment, value, setValue }: Props) => {
  // TODO:EDO:2
  // MAKE CSS SAME AS IN FIGMA
  // https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=576-59440&t=pgsueAM0HZAaTUUL-4
  // we have idle, active(while typing) state
  return (
    <div className="relative flex items-center border-2 rounded-lg p-2 border-gray-300 focus-within:border-blue-500">
      {startAdornment && <span className="mr-2">{startAdornment}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 outline-none bg-transparent placeholder-gray-500"
        placeholder="Search"
      />
      {endAdornment && <span className="ml-2">{endAdornment}</span>}
    </div>
  );
};

export default TextInput;
