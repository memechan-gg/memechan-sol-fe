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

{
  /* TODO:DIGITALLOVEX */
  // FIX CSS
}
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
    primary: "flex items-center bg-primary-100 font-bold text-mono-600 p-2 pl-4 pr-4 rounded-sm",
    secondary: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
    regular: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
    text: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
  };

  const backButtonStyles: Omit<ButtonVariantMap, "text"> = {
    primary:
      "focus:outline-none mr-3 flex items-center bg-primary-100 font-bold text-mono-600 p-2 pl-4 pr-4 rounded-sm",
    secondary:
      "focus:outline-none mr-3 bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
    regular:
      "focus:outline-none mr-3 bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
  };

  const dividerColor = variant === "primary" && subVariant === "primary" ? "mono-600" : "primary-100";

  return (
    <div className="flex items-center bg-primary-100 rounded-sm">
      <button className={buttonStyles[variant]} onClick={onClick}>
        {startIcon && <span className="mr-2">{startIcon}</span>}
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
