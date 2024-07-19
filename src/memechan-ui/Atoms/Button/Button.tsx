import { cn } from "@/utils/cn";
import React from "react";

export type ButtonTypes = "primary" | "secondary" | "regular";
export interface ButtonProps {
  children?: React.ReactNode;
  type: ButtonTypes;
  onClick?: () => void;
}
type ButtonTypeMap = {
  [K in ButtonTypes]: string;
};

const buttonStyles: ButtonTypeMap = {
  primary: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
  secondary: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
  regular: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
};

export const Button = ({ children, type }: ButtonProps) => {
  return <button className={cn(buttonStyles[type])}>{children}</button>;
};
