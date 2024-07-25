import { ColorVariants } from "@/globalTypes";
import { MouseEvent, ReactNode } from "react";

type TypographyVariants = keyof typeof TYPOGRAPHY_VARIANTS;

const TYPOGRAPHY_VARIANTS = {
  h1: "text-2xl leading-9 font-bold tracking-tightest inline-block", // 24px, line-height 36px, semi-bold (700)
  h2: "text-xl leading-[30px] font-bold tracking-tightest inline-block", // 20px, line-height 30px, semi-bold (700)
  h3: "text-[16px] font-bold leading-6 tracking-tightest inline-block", // 16px, line-height 24px, semi-bold (700)
  h4: "text-[13px] font-bold leading-5  inline-block", // 13px, line-height 20px, semi-bold (700)
  body: "text-[13px] font-normal leading-5  inline-block", // 13px, line-height 20px, regular (400)
  "text-button": "text-[13px] font-normal leading-5 inline-block", // 13px, line-height 16px, regular (400)
  caption: "text-xs font-normal leading-[16px] tracking-tight inline-block", // 12px, line-height 16px, regular (400)
};

interface Props {
  children: ReactNode;
  variant?: TypographyVariants;
  underline?: boolean;
  color?: ColorVariants;
  align?: "left" | "center" | "right";
  truncate?: boolean;
  onClick?: (e: MouseEvent<HTMLParagraphElement, globalThis.MouseEvent>) => void;
  className?: string;
}

export const Typography: React.FC<Props> = ({
  children,
  variant = "body",
  align = "left",
  underline,
  color = "mono-600",
  truncate,
  onClick,
  className,
}) => {
  const classString = `${TYPOGRAPHY_VARIANTS[variant]} ${truncate ? "truncate" : ""} text-${color} text-${align} ${underline ? "underline" : ""} ${
    onClick ? "cursor-pointer hover:opacity-75 active:opacity-50" : "hover:opacity-90 active:opacity-80"
  }`;

  return (
    <p className={classString + " " + className} onClick={(e) => onClick?.(e)}>
      {children}
    </p>
  );
};
