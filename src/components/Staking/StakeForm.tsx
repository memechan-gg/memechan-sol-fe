import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import Image from "next/image";

// Header Component
const Header = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-[#800000]" : "bg-neutral-700";
  const textColor = "text-white";

  return (
    <div
      className={`flex flex-col justify-center items-start px-4 py-1.5 w-full text-sm font-bold ${textColor} ${bgColor}`}
    >
      {title}
    </div>
  );
};

// StakingInfo Component
const StakingInfo = ({ label }: { label: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`flex justify-between w-full text-sm ${textColor}`}>
      <div>{label}</div>
      <div className="flex items-center text-right">
        <div className="mr-2">👛</div>
        <div>Coming soon</div> {/* Placeholder text */}
      </div>
    </div>
  );
};

// PeridoInfo Component
const PeridoInfo = ({ label }: { label: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`mt-4 flex justify-between w-full text-sm ${textColor}`}>
      <div>{label}</div>
    </div>
  );
};

// StakeAmount Component
const StakeAmount = ({
  stakeAmount,
  setStakeAmount,
  onPercentageChange,
}: {
  stakeAmount: number;
  setStakeAmount: (amount: number) => void;
  onPercentageChange: (percentage: number) => void;
}) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className="mt-2 flex flex-col w-full">
      <div
        className={`flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm ${bgColor} ${borderColor}`}
      >
        <div className={`flex items-center ${textColor} font-bold`}>
          <Image src="/android-chrome-512x512.png" alt="vCHAN logo" width={24} height={24} className="mr-2" />
          <span>vCHAN</span>
        </div>
        <input
          type="text"
          className={`text-right ${textColor} font-bold w-full bg-transparent outline-none`}
          value="Coming soon" // Placeholder text
          readOnly // Make it read-only
        />
      </div>
      <div className={`flex mt-2 w-full text-neutral-600`}>
        {["10%", "20%", "25%", "50%", "75%", "100%"].map((percentage, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-1 cursor-pointer border ${borderColor}`}
            onClick={() => {}}
          >
            {percentage}
          </div>
        ))}
      </div>
    </div>
  );
};

// PeriodSelection Component
const PeriodSelection = ({
  selectedPeriod,
  onPeriodChange,
}: {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const selectedColor = "border-pink-500";

  const periods = ["7d", "14D", "1M", "3M", "6M", "12M"];

  return (
    <div className="flex mt-2 w-full">
      {periods.map((period, index) => (
        <div
          key={index}
          className={`flex-1 text-center py-1 cursor-pointer border ${
            selectedPeriod === period ? selectedColor : borderColor
          }`}
          onClick={() => {}}
        >
          {period}
        </div>
      ))}
    </div>
  );
};

// ReceiveInfo Component
const ReceiveInfo = () => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className="mt-2 flex flex-col w-full">
      <Header title="Receive" />
      <div
        className={`flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm ${bgColor} ${borderColor}`}
      >
        <div className={`flex items-center ${textColor} font-bold`}>
          <Image src="/veCHAN_log.png" alt="veCHAN logo" width={24} height={24} className="mr-2" />
          <span>veCHAN</span>
        </div>
        <div className={`text-right ${textColor} font-bold`}>Coming soon</div> {/* Placeholder text */}
      </div>
    </div>
  );
};

// AdditionalInfo Component
const AdditionalInfo = () => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const highlightColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`mt-4 w-full ${textColor}`}>
      <div className="flex justify-between">
        <span>Base APR</span>
        <span className={`font-bold ${highlightColor}`}>Coming soon</span> {/* Placeholder text */}
      </div>
      <div className="flex justify-between mt-2">
        <span>Your Point Boost</span>
        <span className={`font-bold ${highlightColor}`}>Coming soon</span> {/* Placeholder text */}
      </div>
      <div className="flex justify-between mt-2 text-green-700">
        <span>Your APR</span>
        <span className="font-bold">Coming soon</span> {/* Placeholder text */}
      </div>
    </div>
  );
};

// Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}></div>
);

// Main StakeForm Component
const StakeForm = () => {
  const { theme } = useTheme();
  const { connected } = useWallet();

  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";

  return (
    <div
      className={`flex flex-col grow pb-3.5 w-full rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor} max-md:mt-3`}
    >
      <Header title="Stake" />
      {connected ? (
        <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
          <StakingInfo label="Staking" />
          <StakeAmount
            stakeAmount={0}
            setStakeAmount={() => {}} // No-op function
            onPercentageChange={() => {}} // No-op function
          />
          <PeridoInfo label="For period of" />
          <PeriodSelection selectedPeriod="7d" onPeriodChange={() => {}} /> {/* Default to 7d */}
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
          <ReceiveInfo />
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
          <AdditionalInfo />
          <button className="mt-4 py-3 bg-pink-500 text-white text-center rounded">Stake</button>
        </div>
      ) : (
        <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}
    </div>
  );
};

export default StakeForm;

// import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
// import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { useTheme } from "next-themes";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// // Header Component
// const Header = ({ title }: { title: string }) => {
//   const { theme } = useTheme();
//   const bgColor = theme === "light" ? "bg-[#800000]" : "bg-neutral-700";
//   const textColor = "text-white";

//   return (
//     <div
//       className={`flex flex-col justify-center items-start px-4 py-1.5 w-full text-sm font-bold ${textColor} ${bgColor}`}
//     >
//       {title}
//     </div>
//   );
// };

// // StakingInfo Component
// const StakingInfo = ({ label, value }: { label: string; value: string }) => {
//   const { theme } = useTheme();
//   const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

//   return (
//     <div className={`flex justify-between w-full text-sm ${textColor}`}>
//       <div>{label}</div>
//       <div className="flex items-center text-right">
//         <div className="mr-2">👛</div>
//         <div>{value}</div>
//       </div>
//     </div>
//   );
// };

// // PeridoInfo Component
// const PeridoInfo = ({ label }: { label: string }) => {
//   const { theme } = useTheme();
//   const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

//   return (
//     <div className={`mt-4 flex justify-between w-full text-sm ${textColor}`}>
//       <div>{label}</div>
//     </div>
//   );
// };

// // StakeAmount Component
// const StakeAmount = ({
//   stakeAmount,
//   setStakeAmount, // Add this line
//   onPercentageChange,
// }: {
//   stakeAmount: number;
//   setStakeAmount: (amount: number) => void; // Add this line
//   onPercentageChange: (percentage: number) => void;
// }) => {
//   const { theme } = useTheme();
//   const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
//   const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
//   const textColor = theme === "light" ? "text-black" : "text-white";
//   const secondaryTextColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

//   return (
//     <div className="mt-2 flex flex-col w-full">
//       <div
//         className={`flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm ${bgColor} ${borderColor}`}
//       >
//         <div className={`flex items-center ${textColor} font-bold`}>
//           <Image src="/android-chrome-512x512.png" alt="vCHAN logo" width={24} height={24} className="mr-2" />
//           <span>vCHAN</span>
//         </div>
//         <input
//           type="number"
//           className={`text-right ${textColor} font-bold w-full bg-transparent outline-none`}
//           value={stakeAmount.toFixed(2)} // Ensure the displayed value is always rounded to 2 decimals
//           onChange={(e) => {
//             const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
//             setStakeAmount(isNaN(value) ? 0 : parseFloat(value.toFixed(2))); // Round to 2 decimals on change
//           }}
//           onBlur={() => {
//             setStakeAmount(Number(stakeAmount.toFixed(2))); // Round to 2 decimals on blur
//           }}
//         />
//       </div>
//       <div className={`flex mt-2 w-full ${secondaryTextColor}`}>
//         {["10%", "20%", "25%", "50%", "75%", "100%"].map((percentage, index) => (
//           <div
//             key={index}
//             className={`flex-1 text-center py-1 cursor-pointer border ${borderColor}`}
//             onClick={() => onPercentageChange(parseInt(percentage))}
//           >
//             {percentage}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // PeriodSelection Component
// const PeriodSelection = ({
//   selectedPeriod,
//   onPeriodChange,
// }: {
//   selectedPeriod: string;
//   onPeriodChange: (period: string) => void;
// }) => {
//   const { theme } = useTheme();
//   const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
//   const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
//   const selectedColor = "border-pink-500";

//   const periods = ["7d", "14D", "1M", "3M", "6M", "12M"];

//   return (
//     <div className="flex mt-2 w-full">
//       {periods.map((period, index) => (
//         <div
//           key={index}
//           className={`flex-1 text-center py-1 cursor-pointer border ${
//             selectedPeriod === period ? selectedColor : borderColor
//           }`}
//           onClick={() => onPeriodChange(period)}
//         >
//           {period}
//         </div>
//       ))}
//     </div>
//   );
// };

// // ReceiveInfo Component
// const ReceiveInfo = ({ receiveAmount }: { receiveAmount: number }) => {
//   const { theme } = useTheme();
//   const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
//   const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
//   const textColor = theme === "light" ? "text-black" : "text-white";
//   const secondaryTextColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

//   return (
//     <div className="mt-2 flex flex-col w-full">
//       <Header title="Receive" />
//       <div
//         className={`flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm ${bgColor} ${borderColor}`}
//       >
//         <div className={`flex items-center ${textColor} font-bold`}>
//           <Image src="/veCHAN_log.png" alt="veCHAN logo" width={24} height={24} className="mr-2" />
//           <span>veCHAN</span>
//         </div>
//         <div className={`text-right ${textColor} font-bold`}>
//           {receiveAmount.toFixed(2)} {/* Ensure the displayed value is always rounded to 2 decimals */}
//         </div>
//       </div>
//     </div>
//   );
// };

// // AdditionalInfo Component
// const AdditionalInfo = ({ baseAPR, pointBoost, apr }: { baseAPR: string; pointBoost: string; apr: string }) => {
//   const { theme } = useTheme();
//   const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
//   const highlightColor = theme === "light" ? "text-black" : "text-white";

//   return (
//     <div className={`mt-4 w-full ${textColor}`}>
//       <div className="flex justify-between">
//         <span>Base APR</span>
//         <span className={`font-bold ${highlightColor}`}>{baseAPR}</span>
//       </div>
//       <div className="flex justify-between mt-2">
//         <span>Your Point Boost</span>
//         <span className={`font-bold ${highlightColor}`}>{pointBoost}</span>
//       </div>
//       <div className="flex justify-between mt-2 text-green-700">
//         <span>Your APR</span>
//         <span className="font-bold">{apr}</span>
//       </div>
//     </div>
//   );
// };

// // Skeleton Component
// const Skeleton = ({ className }: { className?: string }) => (
//   <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}></div>
// );

// // Main StakeForm Component
// // Add this button to the StakeForm Component
// const StakeForm = () => {
//   const [stakeAmount, setStakeAmount] = useState<number>(0);
//   const [selectedPeriod, setSelectedPeriod] = useState<string>("12M");
//   const [receiveAmount, setReceiveAmount] = useState<number>(0); // Default to 0
//   const { theme } = useTheme();
//   const { connected } = useWallet();
//   const { balance, isLoading, error } = useVChanBalance();

//   const bonusPercentages: { [key: string]: number } = {
//     "7d": 0,
//     "14d": 1,
//     "1M": 2,
//     "3M": 6,
//     "6M": 12,
//     "12M": 24,
//   };

//   // Handle stake amount change based on percentage
//   const handleStakeAmountChange = (percentage: number) => {
//     if (balance !== null) {
//       const newStakeAmount = balance * (percentage / 100);
//       setStakeAmount(newStakeAmount);

//       // Recalculate veCHAN based on the selected period
//       const bonusPercentage = bonusPercentages[selectedPeriod] || 0;
//       const bonusMultiplier = 1 + bonusPercentage / 100;
//       const newReceiveAmount = parseFloat((newStakeAmount * bonusMultiplier).toFixed(2)); // Round to 2 decimals
//       setReceiveAmount(newReceiveAmount);
//     }
//   };

//   const handlePeriodChange = (period: string) => {
//     setSelectedPeriod(period);

//     // Recalculate veCHAN based on the new period
//     if (balance !== null) {
//       const bonusPercentage = bonusPercentages[period] || 0;
//       const bonusMultiplier = 1 + bonusPercentage / 100;
//       const newReceiveAmount = parseFloat((stakeAmount * bonusMultiplier).toFixed(2)); // Round to 2 decimals
//       setReceiveAmount(newReceiveAmount);
//     }
//   };

//   useEffect(() => {
//     if (balance !== null) {
//       const bonusPercentage = bonusPercentages[selectedPeriod] || 0;
//       const bonusMultiplier = 1 + bonusPercentage / 100;
//       const newReceiveAmount = parseFloat((stakeAmount * bonusMultiplier).toFixed(2)); // Round to 2 decimals
//       setReceiveAmount(newReceiveAmount);
//     } else {
//       setReceiveAmount(0); // If balance is null, set veCHAN to 0
//     }
//   }, [balance, selectedPeriod, stakeAmount]);

//   const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
//   const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";

//   return (
//     <div
//       className={`flex flex-col grow pb-3.5 w-full rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor} max-md:mt-3`}
//     >
//       <Header title="Stake" />
//       {connected ? (
//         <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
//           {isLoading ? (
//             <Skeleton className="h-6 w-full mb-4" />
//           ) : error ? (
//             <div className="text-red-500">{error}</div>
//           ) : (
//             <StakingInfo label="Staking" value={`${balance?.toLocaleString() ?? "0"} vCHAN`} />
//           )}

//           <StakeAmount
//             stakeAmount={stakeAmount}
//             setStakeAmount={setStakeAmount} // Add this line
//             onPercentageChange={handleStakeAmountChange}
//           />
//           <PeridoInfo label="For period of" />
//           <PeriodSelection selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
//           <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
//           <ReceiveInfo receiveAmount={receiveAmount} />
//           <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
//           <AdditionalInfo baseAPR="Coming soon" pointBoost="Coming soon" apr="Coming soon" />

//           {/* Add this button here */}
//           <button className="mt-4 py-3 bg-pink-500 text-white text-center rounded">Stake</button>
//         </div>
//       ) : (
//         <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
//           <Skeleton className="h-6 w-full mb-4" />
//           <Skeleton className="h-20 w-full mb-4" />
//           <Skeleton className="h-12 w-full mb-4" />
//           <Skeleton className="h-12 w-full mb-4" />
//           <Skeleton className="h-20 w-full" />
//         </div>
//       )}
//     </div>
//   );
// };

// const fetchTokenBalance = async (walletAddress: PublicKey, tokenMintAddress: PublicKey) => {
//   const connection = new Connection(MEMECHAN_RPC_ENDPOINT, "confirmed");

//   try {
//     // Get the associated token address
//     // const tokenAccount = await getAssociatedTokenAddress(tokenMintAddress, walletAddress, true, TOKEN_2022_PROGRAM_ID);
//     const tokenAccount = await getAssociatedTokenAddress(tokenMintAddress, walletAddress, true, TOKEN_PROGRAM_ID);

//     console.log("Token account address:", tokenAccount.toBase58());

//     // Check if the account exists
//     const accountInfo = await connection.getAccountInfo(tokenAccount);
//     if (!accountInfo) {
//       console.log("Token account not found. Balance is likely 0.");
//       return { amount: "0", decimals: 0, uiAmount: 0, uiAmountString: "0" };
//     }

//     // If the account exists, fetch the balance
//     const tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
//     console.log("Token balance:", tokenAmount.value);

//     return tokenAmount.value;
//   } catch (error) {
//     console.error("Error fetching token balance:", error);
//     return null;
//   }
// };

// export const useVChanBalance = () => {
//   const { publicKey } = useWallet();
//   const [balance, setBalance] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getBalance = async () => {
//       if (!publicKey) {
//         setBalance(null);
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         // const tokenMintAddress = new PublicKey(process.env.NEXT_PUBLIC_VECHAN_TOKEN_ADDRESS!);
//         const tokenMintAddress = new PublicKey(process.env.NEXT_PUBLIC_VCHAN_TOKEN_ADDRESS!); //prod
//         const tokenAmount = await fetchTokenBalance(publicKey, tokenMintAddress);
//         console.log("tokenAmount vCHAN: ", tokenAmount);

//         if (tokenAmount) {
//           setBalance(Number(tokenAmount.amount) / Math.pow(10, tokenAmount.decimals));
//         } else {
//           setBalance(0); // Set balance to 0 if tokenAmount is null
//         }
//       } catch (err) {
//         console.error("Error in useVChanBalance:", err);
//         setBalance(0); // Set balance to 0 if there's an error
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getBalance();
//   }, [publicKey]);

//   return { balance, isLoading, error };
// };

// export default StakeForm;
