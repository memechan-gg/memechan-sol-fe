import { cn } from "@/utils/cn";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asDiv?: boolean;
  width?: number;
  height?: number;
}

export const Button = ({ children, width, height, ...props }: ButtonProps) => (
  <button
    {...props}
    className={cn(
      " text-primary-100 bg-opacity-15 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
      width ? `w-[${width}px]` : "",
      height ? `h-[${height}px]` : "",
      props.className,
    )}
  >
    {children}
  </button>
);
