// Header Component
const Header = ({ title }: { title: string }) => (
  <div className="flex justify-start items-center px-4 py-1.5 w-full text-sm font-bold text-white bg-neutral-700">
    {title}
  </div>
);

// DetailCard Component
const DetailCard = ({ label, value, action }: { label: string; value: string; action?: string }) => (
  <div className="flex flex-col flex-1 p-4 rounded-sm border border-solid shadow-sm bg-neutral-800 border-neutral-700">
    <div className="flex justify-between text-sm">
      <div className="text-white">{label}</div>
      {action && <div className="underline text-neutral-400">{action}</div>}
    </div>
    <div className="mt-5 text-base font-bold text-white">{value}</div>
  </div>
);

// Warning Component
const Warning = ({ message }: { message: string }) => (
  <div className="flex items-start px-4 py-2 mx-4 mt-4 text-sm text-yellow-500 border border-solid border-neutral-700">
    <div>⚠️</div>
    <div className="flex-1 ml-2">{message}</div>
  </div>
);

// Earnings Component
const Earnings = ({ label, value, action }: { label: string; value: string; action: string }) => (
  <div className="flex flex-col p-4 mx-4 mt-4 text-sm rounded-sm border border-solid shadow-sm bg-neutral-800 border-neutral-700">
    <div className="flex justify-between">
      <div className="text-white">{label}</div>
      <div className="text-right text-pink-500 underline cursor-pointer">{action}</div>
    </div>
    <div className="flex justify-between mt-6">
      <div className="text-neutral-400">{label}</div>
      <div className="font-bold text-white">{value}</div>
    </div>
  </div>
);

// StakeInfo Component
const StakeInfo = () => (
  <div className="flex flex-col pb-4 mx-auto w-full rounded-sm border border-solid shadow-sm bg-neutral-800 border-neutral-700 max-md:mt-3">
    {/* Header */}
    <Header title="Your Stake" />
    {/* Stake Details */}
    <div className="flex flex-wrap gap-3 mx-4 mt-4">
      <DetailCard label="Staked" value="100,000 vCHAN" action="Unstake (locked)" />
      <DetailCard label="Locked Until" value="Jan 23, 2025" />
      <DetailCard label="Current APR" value="16.42%" />
    </div>
    {/* Warning Section */}
    <Warning message="Earn or buy more Points to boost APR!" />
    {/* Earnings Section */}
    <Earnings label="SOL Earned" value="0.02 SOL" action="Claim All" />
  </div>
);

export default StakeInfo;
