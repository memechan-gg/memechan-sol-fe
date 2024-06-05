import { FC } from "react";

interface RadioButtonProps {
  id: string;
  name: string;
  label: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export const RadioButton: FC<RadioButtonProps> = ({ id, name, label, selectedValue, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name={name}
        className="hidden"
        checked={selectedValue === id}
        onChange={() => onChange(id)}
      />
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <span
          className={`w-4 h-4 mr-2 border border-regular rounded-full flex items-center justify-center transition duration-200 ease-linear ${
            selectedValue === id ? "border-regular" : ""
          }`}
        >
          {selectedValue === id && (
            <span className="w-2 h-2 bg-regular rounded-full transition duration-200 ease-linear"></span>
          )}
        </span>
        {label}
      </label>
    </div>
  );
};
