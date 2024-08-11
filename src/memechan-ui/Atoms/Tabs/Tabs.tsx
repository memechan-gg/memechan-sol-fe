import { Typography } from "../Typography";

export interface TabProps {
  tabs: string[];
  activeTab?: string;
  onTabChange?: (label: string, index: number) => void;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  className?: string;
  immovable?: boolean;
}

export const Tabs = ({ tabs, activeTab, onTabChange, size = "sm", className = "", immovable = false }: TabProps) => {
  return (
    <div className={`flex w-full ${className}`}>
      {tabs.map((label, index) => (
        <button
          key={index}
          onClick={() => {
            onTabChange?.(label, index);
          }}
          className={`${immovable ? "flex-1" : "min-w-[50px]"} py-3 text-${size} font-medium transition-colors duration-300 ${
            activeTab === label
              ? "text-primary-100 font-extrabold"
              : "text-mono-500 sm:hover:text-primary-100 underline"
          } relative`}
        >
          {activeTab === label ? (
            <Typography variant="h4" color="primary-100">
              {"[" + label + "]"}
            </Typography>
          ) : (
            <Typography variant="text-button" color="mono-500" underline>
              {label}
            </Typography>
          )}
        </button>
      ))}
    </div>
  );
};
