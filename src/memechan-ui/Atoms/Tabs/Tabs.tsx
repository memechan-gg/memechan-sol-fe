import { Typography } from "../Typography";

export interface TabProps {
  tabs: string[];
  activeTab?: string;
  onTabChange?: (label: string, index: number) => void;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
}

export const Tabs = ({ tabs, activeTab, onTabChange, size = "sm" }: TabProps) => {
  return (
    <div className="flex">
      {tabs.map((label, index) => (
        <button
          key={index}
          onClick={() => {
            onTabChange?.(label, index);
          }}
          className={`px-4 py-3 text-${size} font-medium transition-colors duration-300 ${
            activeTab === label ? "text-primary-100 font-extrabold" : "text-mono-500 hover:text-primary-100 underline"
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
