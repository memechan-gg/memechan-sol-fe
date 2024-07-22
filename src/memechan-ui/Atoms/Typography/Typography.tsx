import { ColorVariants } from "@/globalTypes";
import { MouseEvent, ReactNode } from "react";

type TypographyVariants = keyof typeof TYPOGRAPHY_VARIANTS;

// TODO:EDO
// fix typography variants
// see here: https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=330-37654&t=JvSbSggCPJO8wL1D-4
const TYPOGRAPHY_VARIANTS = {
  h1: "text-2xl font-semibold leading-9 tracking-tight text-center", // 24px, line-height 36px, semi-bold (700)
  h2: "text-xl font-semibold leading-[30px] tracking-tight text-left", // 20px, line-height 30px, semi-bold (700)
  h3: "text-lg font-semibold leading-6 tracking-tight text-left", // 16px, line-height 24px, semi-bold (700)
  h4: "text-[13px] font-semibold leading-5 text-left", // 13px, line-height 20px, semi-bold (700)
  body: "text-[13px] font-normal leading-5 text-left", // 13px, line-height 20px, regular (400)
  "text-button": "text-[13px] font-normal leading-[16px] text-left", // 13px, line-height 16px, regular (400)
  caption: "text-xs font-normal leading-[16px] tracking-tight text-left", // 12px, line-height 16px, regular (400)
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
