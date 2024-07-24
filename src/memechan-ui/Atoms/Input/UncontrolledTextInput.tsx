import * as React from "react";
import { Typography } from "../Typography";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const UncontrolledTextInput = ({ type, placeholder, ...props }: InputProps) => {
  return (
    <div className="relative flex items-center rounded-sm w-full">
      {type === "file" ? (
        <label className="flex items-center w-full">
          <input
            type="file"
            className=" file:text-white absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            {...props}
          />
          <div className="h-13 border border-mono-400 p-4 flex-1 bg-transparent placeholder-mono-500 flex items-center justify-center">
            <Typography variant="body" color="mono-500">
              {placeholder || "Attach file"}
            </Typography>
          </div>
        </label>
      ) : (
        // <input type="file" className=" opacity-0 cursor-pointer w-full h-full" {...props} />
        <input
          type={type}
          className="h-13 custom-inner-shadow rounded-tl-[2px] rounded-tr-[2px] placeholder:text-[13px] placeholder:font-normal placeholder:leading-5 border border-mono-400 p-4 flex-1 outline-none bg-transparent placeholder-mono-500 w-full"
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
};

export default UncontrolledTextInput;
