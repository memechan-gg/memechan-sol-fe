import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import React, { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "regular" | "text" | "contained" | "disabled";
export type ButtonSubVariant = "primary" | "secondary" | "regular";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant: ButtonVariant;
  subVariant?: ButtonSubVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconClick?: () => void;
  isLoading?: boolean;
}

type ButtonVariantMap = {
  [K in ButtonVariant]: string;
};

export const Button = ({
  children,
  startIcon,
  endIcon,
  onEndIconClick,
  variant = "primary",
  subVariant = "primary",
  isLoading,
  ...rest
}: ButtonProps) => {
  const { theme } = useTheme();
  const buttonStyles: ButtonVariantMap = {
    primary: `text-white h-full cursor-pointer w-full bg-primary-100 justify-center text-xs leading-5 font-bold ${theme === "light" ? "text-mono-200" : "text-mono-600"} p-2 pl-4 pr-4 rounded-sm hover:bg-primary-300 active:bg-primary-400 focus:outline-none`,
    secondary: `bg-mono-100 h-10 cursor-pointer w-full justify-center border border-primary-100 rounded text-xs gap-2 font-bold  ${theme === "light" ? "text-primary-100 hover:text-mono-200" : "text-mono-600"} hover:bg-primary-200 active:bg-primary-300 focus:outline-none`,
    regular:
      "bg-primary-100 text-xs cursor-pointer w-full justify-center flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
    text: "bg-primary-100 text-xs cursor-pointer justify-center flex-row gap-2 font-bold text-regular hover:bg-primary-200 active:bg-primary-300 focus:outline-none",
    contained: "w-full h-full cursor-pointer rounded-sm bg-mono-600 text-primary-100",
    disabled: `w-full h-full rounded-sm  justify-center cursor-not-allowed ${theme === "light" ? "disabled:text-mono-200 text-mono-200 disabled:bg-mono-500 bg-mono-500" : "bg-mono-400 disabled:bg-mono-400"}'`,
  };

  return (
    <button
      {...rest}
      className={"flex items-center rounded-sm w-full h-full" + " " + buttonStyles[variant] + " " + rest.className}
    >
      {isLoading && (
        <div className="mr-2">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" fontSize={18} />
        </div>
      )}
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
};
