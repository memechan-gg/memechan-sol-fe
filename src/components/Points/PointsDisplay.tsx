import React from "react";

interface PointsDisplayProps {
  points: number;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <div className="flex gap-4 items-center px-4 py-2 mt-3 w-full font-bold rounded-sm border border-pink-500 border-solid max-w-[374px]">
      <span className="self-stretch my-auto text-base tracking-normal text-yellow-500" aria-hidden="true">
        🔥
      </span>
      <div className="flex-1 shrink self-stretch my-auto text-xl tracking-tight text-right text-pink-500 basis-0">
        {points.toLocaleString()} Points
      </div>
    </div>
  );
};

export default PointsDisplay;
