import { useTheme } from "next-themes";

export interface CheckboxProps {
  checked: boolean;
  onChange: (e: any) => void;
  label?: string;
  children?: any;
}

const Checkbox = ({ checked, onChange, label, children }: CheckboxProps) => {
  const { theme } = useTheme();

  const checkboxClass = `w-3 h-3 p-0.5 rounded-sm border border-[1px] flex items-center justify-center transition-all duration-300 ${
    theme === "light"
      ? checked
        ? "bg-primary-100 border-mono-200"
        : "border-primary-100 bg-mono-200"
      : checked
        ? "bg-primary-100 border-primary-100"
        : "border-primary-100 bg-mono-600"
  }`;

  const checkmarkClass = `scale-150 ${
    checked ? "opacity-100" : "opacity-0"
  } transition-opacity duration-300 ease-in-out ${theme === "light" ? "text-mono-200" : "text-mono-600"}`;

  return (
    <label className="flex items-center cursor-pointer space-x-2">
      <div
        className={checkboxClass}
        onClick={(event) => {
          onChange(event);
        }}
      >
        {checked && (
          <svg
            className={checkmarkClass}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height={"12px"}
            width={"12px"}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && <span className={`select-none ${checked ? "text-mono-100" : "text-mono-600"}`}>{label}</span>}
      {
        <div
          className="flex items-center"
          onClick={(event) => {
            onChange(event);
          }}
        >
          {children}
        </div>
      }
    </label>
  );
};

export default Checkbox;
