import { useState } from "react";

interface MobileNavbarProps {
  onSelect: (section: string) => void;
}

export const MobileNavbar = ({ onSelect }: MobileNavbarProps) => {
  const [activeSection, setActiveSection] = useState("coinInfo");

  const handleSelect = (section: string) => {
    setActiveSection(section);
    onSelect(section);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-4 text-lg">
      <button
        className={`flex-1 text-center ${activeSection === "coinInfo" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => handleSelect("coinInfo")}
      >
        Info
      </button>
      <button
        className={`flex-1 text-center ${activeSection === "chart" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => handleSelect("chart")}
      >
        Chart
      </button>
      <button
        className={`flex-1 text-center ${activeSection === "posts" ? "text-blue-500" : "text-gray-500"}`}
        onClick={() => handleSelect("posts")}
      >
        Posts
      </button>
    </div>
  );
};
