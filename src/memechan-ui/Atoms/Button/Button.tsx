import React from "react";

export type ButtonVariant = "primary" | "secondary" | "regular";
export interface ButtonProps {
  children?: React.ReactNode;
  variant: ButtonVariant;
  onClick?: () => void;
}
type ButtonVariantMap = {
  [K in ButtonVariant]: string;
};

export const Button = ({ children, variant }: ButtonProps) => {
  const buttonStyles: ButtonVariantMap = {
    primary: "bg-primary-100 font-bold text-mono-600",
    secondary: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
    regular: "bg-primary-100 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular",
  };
  return (
    <>
      <button className="bg-primary-100 font-bold text-mono-600">{children}</button>
      <button className="border-black border-2 rounded-2xl py-2 px-4">Search</button>
    </>
  );
};
