import React, { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "regular";
export interface ButtonProps {
  children?: React.ReactNode;
  variant: ButtonVariant;
  onClick?: () => void;
  frontIcon?: ReactNode;
  backIcon?: ReactNode;
}
type ButtonVariantMap = {
  [K in ButtonVariant]: string;
};

export const Button = ({ children, variant, frontIcon, backIcon }: ButtonProps) => {
  const buttonStyles: ButtonVariantMap = {
    primary: "bg-primary-100 font-bold text-mono-600",
    secondary: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
    regular: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
  };
  return <button className={buttonStyles[variant]}>{children}</button>;
};
