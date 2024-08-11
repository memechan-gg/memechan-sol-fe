import React from "react";

export interface RoundBoxProps {
  children?: React.ReactNode;
  checked: boolean;
  onClick?: () => void;
}

const RoundBox = ({ children, checked, onClick }: RoundBoxProps) => {
  const outerBoxClass = `rounded-full flex items-center justify-center border transition-all duration-300 ease-in-out ${
    checked ? "border-primary-100" : "border-mono-500"
  } w-5 h-5`;

  const innerCircleClass = `w-2.5 h-2.5 rounded-full bg-primary-100 transform ${
    checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
  } transition-transform duration-300 ease-in-out`;

  return (
    <div className={outerBoxClass} onClick={onClick}>
      <div className={innerCircleClass}></div>
      {children}
    </div>
  );
};

export default RoundBox;
