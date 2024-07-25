import * as React from "react";
import { Typography } from "../Typography";
import { SetStateAction, useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface Props {
  file: File | null;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}

const UncontrolledTextInput = ({ type, placeholder, ...props }: InputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };
  
  return (
    <div className="relative flex items-center rounded-sm w-full">
      {type === "file" ? (
        <>
          {file ? (
        <div className="flex justify-between items-center primary-border rounded-sm w-full py-[18px] px-4">
          <span className="text-regular truncate">
          <Typography>
            {file.name}
          </Typography>
          </span>
          <button onClick={() => setFile(null)} className="text-xs flex">
            <FontAwesomeIcon icon={faClose} className="text-red-100" size="xl" />
          </button>
        </div>
      ) : (
        <>
          <label htmlFor="file-upload" className="hidden">
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            multiple={false}
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="primary-border rounded-sm py-[18px] inline-block cursor-pointer w-full text-center text-mono-500"
          >
            <Typography align="center" color="mono-500">Attach file </Typography>
          </label>
        </>
      )}
        </>
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
