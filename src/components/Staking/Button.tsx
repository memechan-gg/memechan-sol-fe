import React from "react";

type ButtonProps = {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

const Button = ({ onClick, className, children }: ButtonProps) => {
  return (
    <Button onClick={onClick} className={className}>
      {children}
    </Button>
  );
};
 
export default Button;
