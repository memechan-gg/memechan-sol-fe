import { useTheme } from "next-themes";
import React from "react";

const PointsInfo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="flex flex-col mt-4 w-full max-w-[374px] min-h-[48px]">
      <h2 className={`text-base font-bold tracking-normal ${theme === "light" ? "text-black" : "text-white"}`}>
        Your points
      </h2>
      <p className="mt-1 text-sm leading-loose text-neutral-400">Earn more by trading memecoins on memechan.gg</p>
    </section>
  );
};

export default PointsInfo;
