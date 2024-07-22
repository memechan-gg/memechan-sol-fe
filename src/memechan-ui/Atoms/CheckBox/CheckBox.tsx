export interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  height?: string;
  width?: string;
}

const Checkbox = ({ checked, onChange, label, height = "4", width = "4" }: CheckboxProps) => {
  const checkboxClass = `w-${width} h-${height} p-0.5 rounded-sm border border-[2px] flex items-center justify-center transition-all duration-300 ${
    checked ? "bg-primary-100 border-primary-100" : "border-primary-100 bg-mono-600"
  }`;

  const checkmarkClass = `scale-150 ${
    checked ? "opacity-100" : "opacity-0"
  } transition-opacity duration-300 ease-in-out text-mono-600`;

  return (
    <label className="flex items-center cursor-pointer space-x-2">
      <div className={checkboxClass} onClick={onChange}>
        {checked && (
          <svg
            className={checkmarkClass}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height={24}
            width={24}
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
    </label>
  );
};

export default Checkbox;
