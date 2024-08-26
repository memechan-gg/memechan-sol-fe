import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { useTheme } from "next-themes";
import React, { useRef, useState } from "react";
import PointsComponent from "./Points/PointsComponent";

interface PointsDisplayProps {
  points: number;
}

const PointsIcon: React.FC<PointsDisplayProps> = ({ points }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const referenceElement = useRef<HTMLDivElement>(null); // Reference element for floating UI

  const { x, y, strategy, refs } = useFloating({
    placement: "bottom", // Position the floating component at the bottom of the reference element
    middleware: [offset(10), shift(), flip()],
  });

  // Toggle the floating PointsComponent
  const togglePointsComponent = () => {
    setIsOpen((prev) => !prev);
  };

  // Determine the color based on the theme
  const borderColor = theme === "light" ? "border-[#7F0002]" : "border-pink-500";
  const textColor = theme === "light" ? "#7F0002" : "text-pink-500";

  return (
    <>
      <div
        ref={refs.setReference} // Set the reference element for floating UI
        className={`h-10 flex items-center gap-2 px-3 rounded-sm border border-solid bg-inherit box-content cursor-pointer ${borderColor}`}
        onClick={togglePointsComponent}
      >
        <span className="text-base tracking-normal text-neutral-800" aria-hidden="true">
          🔥
        </span>
        <div className={`text-sm leading-4 ${textColor}`}>
          {" "}
          {/* Apply the determined text color */}
          <span className="font-semibold">{points.toLocaleString()}</span>
          <br />
          <span className="font-light">Points</span>
        </div>
      </div>

      {isOpen && (
        <div
          ref={refs.setFloating} // Set the floating element for floating UI
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1000, // Ensure the floating component is on top
          }}
          className="mt-2"
        >
          <PointsComponent points={points} />
        </div>
      )}
    </>
  );
};

export default PointsIcon;
