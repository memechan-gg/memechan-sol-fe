import { useTheme } from "next-themes";
import React, { useState } from "react";
import Draggable from "react-draggable";
import CustomChart from "./CustomChart";
import PointsDisplay from "./PointsDisplay";
import PointsInfo from "./PointsInfo";
import ReferralLink from "./ReferralLink";
import WarningMessage from "./WarningMessage";

interface PointsComponentProps {
  points: number;
}

const PointsComponent: React.FC<PointsComponentProps> = ({ points }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Draggable>
      <div
        className={`flex flex-col pb-4 mx-auto w-full max-w-md rounded-sm border border-solid shadow-md ${
          theme === "light"
            ? "bg-white border-[#800000] text-mono-800"
            : "bg-neutral-800 border-neutral-700 text-mono-200"
        }`}
      >
        {/* Points Header */}
        <div
          className="flex justify-between items-center px-4 py-1.5 w-full text-sm font-bold"
          style={{
            backgroundColor: theme === "light" ? "#800001" : "#2d2d2d",
            color: "#ffffff", // Keep text white in both modes
          }}
        >
          <span className="text-white">Points</span>
          <button onClick={handleClose} className="text-white" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Content area with reduced top margin */}
        <div className="space-y-4 mr-4 ml-4">
          <PointsInfo />
          <PointsDisplay points={points} />
          <div className="my-1">
            <CustomChart />
          </div>
          <WarningMessage />
          <ReferralLink />
        </div>
      </div>
    </Draggable>
  );
};

export default PointsComponent;
