import { useTheme } from "next-themes";
import React, { useMemo } from "react";

interface PointsDisplayProps {
  points: number;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  const { theme } = useTheme();

  const { borderColor, textColor } = useMemo(() => {
    return {
      borderColor: theme === "light" ? "border-[#7F0002]" : "border-pink-500",
      textColor: theme === "light" ? "text-[#7F0002]" : "text-pink-500",
    };
  }, [theme]);

  return (
    <div
      className={`flex gap-4 items-center px-4 py-2 mt-3 w-full font-bold rounded-sm border border-solid max-w-[374px] ${borderColor}`}
    >
      <span className="self-stretch my-auto text-base tracking-normal text-yellow-500" aria-hidden="true">
        🔥
      </span>
      <div className={`flex-1 shrink self-stretch my-auto text-xl tracking-tight text-right basis-0 ${textColor}`}>
        {points.toLocaleString()} Points
      </div>
    </div>
  );
};

export default PointsDisplay;
