import { ColorVariants } from "@/globalTypes";
import { MouseEvent, ReactNode } from "react";

type TypographyVariants = keyof typeof TYPOGRAPHY_VARIANTS;

// TODO:EDO
// fix typography variants
// see here: https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=330-37654&t=JvSbSggCPJO8wL1D-4
const TYPOGRAPHY_VARIANTS = {
  h1: "text-2xl font-bold leading-9 tracking-tightest text-center",
  h2: "text-xl font-bold leading-7 tracking-tightest text-left",
  h3: "text-lg font-bold leading-6 tracking-tightest text-left",
  h4: "text-base font-bold leading-5 text-left",
  body: "text-base font-normal leading-5 text-left",
  "text-button": "text-base font-normal leading-4 text-left",
  caption: "text-xs font-normal leading-4 tracking-tightest text-left",
};

interface Props {
  children: ReactNode;
  variant?: TypographyVariants;
  underline?: boolean;
  color?: ColorVariants;
  onClick?: (e: MouseEvent<HTMLParagraphElement, globalThis.MouseEvent>) => void;
}

export const Typography: React.FC<Props> = ({ children, variant = "body", underline, color = "mono-600", onClick }) => {
  const classString = `${TYPOGRAPHY_VARIANTS[variant]} text-${color} ${underline ? "underline" : ""} ${
    onClick ? "cursor-pointer hover:opacity-75 active:opacity-50" : "hover:opacity-90 active:opacity-80"
  }`;

  return (
    <p className={classString} onClick={(e) => onClick?.(e)}>
      {children}
    </p>
  );
};
