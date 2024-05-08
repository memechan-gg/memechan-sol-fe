import { cn } from "@/utils/cn";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asDiv?: boolean;
}

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    {...props}
    className={cn(
      "bg-title bg-opacity-15 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25",
      props.className,
    )}
  >
    {children}
  </button>
);
