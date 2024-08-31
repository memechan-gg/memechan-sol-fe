import { useTheme } from "next-themes";
import React, { useMemo } from "react";

const ReferralLink: React.FC = () => {
  const { theme } = useTheme();

  const { textColor, borderColor } = useMemo(() => {
    return {
      textColor: theme === "light" ? "text-[#7F0002]" : "text-pink-500",
      borderColor: theme === "light" ? "border-[#7F0002]" : "border-pink-500",
    };
  }, [theme]);

  return (
    <section className="flex flex-col mt-4 w-full max-w-[374px]">
      <h2 className={`text-base font-bold tracking-normal ${theme === "light" ? "text-black" : "text-white"}`}>
        Your referral link
      </h2>
      <p className={`mt-1 text-sm leading-5 ${theme === "light" ? "text-neutral-600" : "text-neutral-400"}`}>
        Invite friends using your referral link and earn 25% of all the points they accumulate
      </p>
      <div
        className={`flex gap-1 justify-end px-4 py-3.5 mt-3 w-full text-sm leading-loose ${textColor} whitespace-nowrap rounded-sm border ${borderColor} border-solid`}
      >
        <span className="flex-auto">Coming soon</span>
      </div>
    </section>
  );
};

export default ReferralLink;
