import React from "react";

type ButtonProps = {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

const Button = ({ onClick, className, children }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
