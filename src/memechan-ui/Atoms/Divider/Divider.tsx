import React from "react";

interface DividerProps {
  vertical?: boolean;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ vertical = false, className = "" }) => {
  return <div className={`relative ${vertical ? "w-px h-full" : "p-0 h-px w-full"} bg-mono-300 ${className}`} />;
};
