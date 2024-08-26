import React from "react";

const ReferralLink: React.FC = () => {
  return (
    <section className="flex flex-col mt-4 w-full max-w-[374px]">
      <h2 className="text-base font-bold tracking-normal text-white">Your referral link</h2>
      <p className="mt-1 text-sm leading-5 text-neutral-400">
        Invite friends using your referral link and earn 25% of all the points they accumulate
      </p>
      <div className="flex gap-1 justify-end px-4 py-3.5 mt-3 w-full text-sm leading-loose text-pink-500 whitespace-nowrap rounded-sm border border-pink-500 border-solid">
        <span className="flex-auto">Coming soon</span>
      </div>
    </section>
  );
};

export default ReferralLink;
