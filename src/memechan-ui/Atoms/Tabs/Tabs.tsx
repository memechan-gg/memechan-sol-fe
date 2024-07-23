export interface TabProps {
  tabs: string[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
}

export const Tabs = ({ tabs, activeTab, onTabChange, size = "sm" }: TabProps) => {
  return (
    <div className="flex">
      {tabs.map((label, index) => (
        <button
          key={index}
          onClick={() => {
            if (onTabChange) onTabChange(index);
          }}
          className={`px-4 py-2 text-${size} font-medium transition-colors duration-300 ${
            activeTab === index ? "text-primary-100 font-extrabold" : "text-mono-500 hover:text-primary-100 underline"
          } relative`}
        >
          {activeTab === index ? `[${label}]` : `${label}`}
        </button>
      ))}
    </div>
  );
};
