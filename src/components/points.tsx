import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";

const PointsComponent = dynamic(() => import("./Points/PointsComponent"), { ssr: false });

interface PointsDisplayProps {
  points: number;
}

const PointsIcon: React.FC<PointsDisplayProps> = ({ points }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const referenceElement = useRef<HTMLDivElement>(null);

  const { x, y, strategy, refs } = useFloating({
    placement: "bottom",
    middleware: [offset(10), shift(), flip()],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { borderColor, textColor, hoverBgColor } = useMemo(() => {
    return {
      borderColor: theme === "light" ? "border-[#7F0002]" : "border-pink-500",
      textColor: theme === "light" ? "text-[#7F0002]" : "text-pink-500",
      hoverBgColor: theme === "light" ? "hover:bg-[#7F0002]" : "hover:bg-pink-500",
    };
  }, [theme]);

  const togglePointsComponent = () => {
    setIsOpen((prev) => !prev);
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div
        ref={refs.setReference}
        className={`h-10 flex items-center gap-2 px-3 rounded-sm border border-solid bg-inherit box-content cursor-pointer ${borderColor} ${hoverBgColor} hover:text-white transition-colors group`}
        onClick={togglePointsComponent}
      >
        <span className="text-base tracking-normal group-hover:text-white transition-colors" aria-hidden="true">
          🔥
        </span>
        <div className={`text-sm leading-4 ${textColor} group-hover:text-white transition-colors`}>
          <span className="font-semibold">{formatNumber(points)}</span>
          <br />
          <span className="font-light">Points</span>
        </div>
      </div>

      {isOpen && mounted && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1000,
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
