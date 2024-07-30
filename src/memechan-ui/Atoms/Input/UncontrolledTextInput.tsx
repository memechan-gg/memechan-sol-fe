import { ICreateForm } from "@/views/create-coin/create-coin.types";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useState } from "react";
import { UseFormResetField } from "react-hook-form";
import { Typography } from "../Typography";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  resetField?: UseFormResetField<ICreateForm>;
  fieldName?: keyof ICreateForm;
}

const UncontrolledTextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, onChange, onBlur, resetField, fieldName, ...props }, ref) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] || null;
      setFile(selectedFile);
      // Call the onChange event passed down via props
      onChange && onChange(event);
    };

    return (
      <div className="relative flex items-center rounded-sm w-full">
        {type === "file" ? (
          <>
            {file ? (
              <div className="flex justify-between items-center primary-border rounded-sm w-full py-[18px] px-4">
                <span className="text-regular flex truncate">
                  <Typography>{file.name}</Typography>
                </span>
                {fieldName && resetField && (
                  <button
                    onClick={() => {
                      setFile(null);
                      resetField(fieldName);
                    }}
                    className="text-xs flex"
                  >
                    <FontAwesomeIcon icon={faClose} className="text-red-100" size="xl" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <label htmlFor="file-upload" className="hidden"></label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  multiple={false}
                  className="hidden"
                  onChange={handleFileChange}
                  ref={ref}
                  {...props}
                />
                <label
                  htmlFor="file-upload"
                  className="primary-border rounded-sm py-[18px] flex justify-center cursor-pointer w-full text-center text-mono-500"
                >
                  <Typography align="center" color="mono-500">
                    Attach file
                  </Typography>
                </label>
              </>
            )}
          </>
        ) : (
          <input
            type={type}
            className="h-13 focus-within:border-red-100 text-[13px] font-normal leading-5 inline-block text-mono-600 text-left hover:opacity-90 active:opacity-80 custom-inner-shadow rounded-tl-[2px] rounded-tr-[2px] placeholder:text-[13px] placeholder:font-normal placeholder:leading-5 border border-mono-400 p-4 flex-1 outline-none bg-transparent placeholder-mono-500 w-full"
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            {...props}
          />
        )}
      </div>
    );
  },
);

UncontrolledTextInput.displayName = "UncontrolledTextInput";

export default UncontrolledTextInput;
