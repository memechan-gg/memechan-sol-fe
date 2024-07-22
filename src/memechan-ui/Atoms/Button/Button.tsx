import React, { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "regular" | "text";
export type ButtonSubVariant = "primary" | "secondary" | "regular";
export interface ButtonProps {
  children?: React.ReactNode;
  variant: ButtonVariant;
  subVariant?: ButtonSubVariant;
  onClick?: () => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconClick?: () => void;
}

type ButtonVariantMap = {
  [K in ButtonVariant]: string;
};

export const Button = ({
  children,
  startIcon,
  endIcon,
  onClick,
  onEndIconClick,
  variant = "primary",
  subVariant = "primary",
}: ButtonProps) => {
  const buttonStyles: ButtonVariantMap = {
    primary:
      "flex items-center text-white h-10 bg-primary-100 text-xs leading-5 font-bold text-mono-600 p-2 pl-4 pr-4 rounded-sm hover:bg-primary-300 active:bg-primary-400 focus:outline-none",
    secondary:
      "bg-mono-100 cursor-pointer h-10 w-full text-center border border-primar-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
    regular:
      "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
    text: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
  };

  const backButtonStyles: Omit<ButtonVariantMap, "text"> = {
    primary:
      "flex items-center bg-primary-100 font-bold text-mono-600 p-2 pl-4 pr-4 rounded-sm hover:bg-primary-300 active:bg-primary-400 focus:outline-none",
    secondary:
      "bg-transparent items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
    regular:
      "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
  };

  const dividerColor = variant === "primary" && subVariant === "primary" ? "mono-600" : "primary-100";

  return (
    <div className="flex items-center bg-primary-100 rounded-sm w-full">
      <button className={buttonStyles[variant]} onClick={onClick}>
        {startIcon && <span>{startIcon}</span>}
        {children}
      </button>
      {endIcon && (
        <>
          <span className={`mx-2 text-${dividerColor}`}>|</span>
          <button onClick={onEndIconClick} className={backButtonStyles[subVariant]}>
            {endIcon}
          </button>
        </>
      )}
    </div>
  );
};
