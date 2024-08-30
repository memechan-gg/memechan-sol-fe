import { useTheme } from "next-themes";

// Header Component
const Header = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-[#800000]" : "bg-neutral-700";
  const textColor = theme === "light" ? "text-white" : "text-white";

  return (
    <div className={`flex justify-start items-center px-4 py-1.5 w-full text-sm font-bold ${textColor} ${bgColor}`}>
      {title}
    </div>
  );
};

// DetailCard Component
const DetailCard = ({ label, value, action }: { label: string; value: string; action?: string }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const actionColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`flex flex-col flex-1 p-4 rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor}`}>
      <div className="flex justify-between text-sm">
        <div className={textColor}>{label}</div>
        {action && <div className={`underline ${actionColor}`}>{action}</div>}
      </div>
      <div className={`mt-5 text-base font-bold ${textColor}`}>{value}</div>
    </div>
  );
};

// Warning Component
const Warning = ({ message }: { message: string }) => {
  const { theme } = useTheme();
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";

  return (
    <div className={`flex items-start px-4 py-2 mx-4 mt-4 text-sm text-yellow-500 border border-solid ${borderColor}`}>
      <div>⚠️</div>
      <div className="flex-1 ml-2">{message}</div>
    </div>
  );
};

// Earnings Component
const Earnings = ({ label, value, action }: { label: string; value: string; action: string }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const secondaryTextColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const actionColor = theme === "light" ? "text-[#7F0002]" : "text-pink-500";

  return (
    <div
      className={`flex flex-col p-4 mx-4 mt-4 text-sm rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor}`}
    >
      <div className="flex justify-between">
        <div className={textColor}>{label}</div>
        <div className={`text-right ${actionColor} underline cursor-pointer`}>{action}</div>
      </div>
      <div className="flex justify-between mt-6">
        <div className={secondaryTextColor}>{label}</div>
        <div className={`font-bold ${textColor}`}>{value}</div>
      </div>
    </div>
  );
};

// StakeInfo Component
const StakeInfo = () => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";

  return (
    <div
      className={`
        flex flex-col pb-4 mx-auto w-full 
        rounded-sm border border-solid ${borderColor}
        shadow-md
        ${bgColor} max-md:mt-3
      `}
    >
      <Header title="Your Stake" />
      <div className="flex flex-wrap gap-3 mx-4 mt-4">
        <DetailCard label="Staked" value="100,000 vCHAN" action="Unstake (locked)" />
        <DetailCard label="Locked Until" value="Jan 23, 2025" />
        <DetailCard label="Current APR" value="16.42%" />
      </div>
      <Warning message="Earn or buy more Points to boost APR!" />
      <Earnings label="SOL Earned" value="0.02 SOL" action="Claim All" />
    </div>
  );
};

export default StakeInfo;
