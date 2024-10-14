import {
  COMPUTE_UNIT_PRICE,
  getStakingStatePDA,
  getStakingStateSigner,
  getUserStakeSigner,
  VeChanStakingClient,
} from "@avernikoz/memechan-sol-sdk";
import { AnchorProvider, BN as BNN } from "@coral-xyz/anchor";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ComputeBudgetProgram, Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
import { sleep } from "./utils";

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

const StakingInfo = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`flex justify-between w-full text-sm ${textColor}`}>
      <div>{label}</div>
      <div className="flex items-center text-right">
        <div className="mr-2">👛</div>
        <div>{value}</div>
      </div>
    </div>
  );
};

const PeridoInfo = ({ label }: { label: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`mt-4 flex justify-between w-full text-sm ${textColor}`}>
      <div>{label}</div>
    </div>
  );
};

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
  const secondaryTextColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

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
          type="number"
          className={`text-right ${textColor} font-bold w-full bg-transparent outline-none`}
          value={stakeAmount.toFixed(2)}
          onChange={(e) => {
            const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
            setStakeAmount(isNaN(value) ? 0 : parseFloat(value.toFixed(2)));
          }}
          onBlur={() => {
            setStakeAmount(Number(stakeAmount.toFixed(2)));
          }}
        />
      </div>
      <div className={`flex mt-2 w-full ${secondaryTextColor}`}>
        {["10%", "20%", "25%", "50%", "75%", "100%"].map((percentage, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-1 cursor-pointer border ${borderColor}`}
            onClick={() => onPercentageChange(parseInt(percentage))}
          >
            {percentage}
          </div>
        ))}
      </div>
    </div>
  );
};

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
          onClick={() => onPeriodChange(period)}
        >
          {period}
        </div>
      ))}
    </div>
  );
};

const ReceiveInfo = ({ receiveAmount }: { receiveAmount: number }) => {
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
        <div className={`text-right ${textColor} font-bold`}>{receiveAmount.toFixed(2)}</div>
      </div>
    </div>
  );
};

const AdditionalInfo = ({ baseAPR, pointBoost, apr }: { baseAPR: string; pointBoost: string; apr: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const highlightColor = theme === "light" ? "text-black" : "text-white";

  return (
    <div className={`mt-4 w-full ${textColor}`}>
      <div className="flex justify-between">
        <span>Base APR</span>
        <span className={`font-bold ${highlightColor}`}>{baseAPR}</span>
      </div>
      <div className="flex justify-between mt-2">
        <span>Your Point Boost</span>
        <span className={`font-bold ${highlightColor}`}>{pointBoost}</span>
      </div>
      <div className="flex justify-between mt-2 text-green-700">
        <span>Your APR</span>
        <span className="font-bold">{apr}</span>
      </div>
    </div>
  );
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}></div>
);

const StakeForm = () => {
  const [rewardState, setRewardState] = useState<PublicKey | null>(null);

  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12M");
  const [receiveAmount, setReceiveAmount] = useState<number>(0);
  const { theme } = useTheme();
  const { connected } = useWallet();
  const { balance, isLoading, error } = useVChanBalance();

  const [isStaking, setIsStaking] = useState(false);
  const [stakeError, setStakeError] = useState<string | null>(null);
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [isCreatingState, setIsCreatingState] = useState(false);
  const [createStateError, setCreateStateError] = useState<string | null>(null);

  const TOKEN_INFOS = {
    vCHAN: {
      mint: new PublicKey(process.env.NEXT_PUBLIC_VCHAN_TOKEN_ADDRESS!),
    },
    veCHAN: {
      mint: new PublicKey(process.env.NEXT_PUBLIC_VECHAN_TOKEN_ADDRESS!),
    },
  };

  const initializeWalletAccounts = async (wallet: any, connection: any) => {
    const userVAcc = await getAssociatedTokenAddress(TOKEN_INFOS.vCHAN.mint, wallet.publicKey, false, TOKEN_PROGRAM_ID);
    const userVeAcc = await getAssociatedTokenAddress(
      TOKEN_INFOS.veCHAN.mint,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
    );

    const transaction = new Transaction();

    const userVAccInfo = await connection.getAccountInfo(userVAcc);
    if (!userVAccInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          userVAcc,
          wallet.publicKey,
          TOKEN_INFOS.vCHAN.mint,
          TOKEN_PROGRAM_ID,
        ),
      );
    }

    const userVeAccInfo = await connection.getAccountInfo(userVeAcc);
    if (!userVeAccInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          userVeAcc,
          wallet.publicKey,
          TOKEN_INFOS.veCHAN.mint,
          TOKEN_2022_PROGRAM_ID,
        ),
      );
    }

    if (transaction.instructions.length > 0) {
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTransaction = await wallet.signTransaction(transaction);
      await connection.sendRawTransaction(signedTransaction.serialize(), { skipPreflight: false });
      await connection.confirmTransaction(signedTransaction.signature);
    }

    return { userVAcc, userVeAcc };
  };

  const handleStake = async () => {
    if (!anchorWallet || !connection || stakeAmount <= 0) {
      setStakeError("Please connect your wallet and enter a valid stake amount.");
      return;
    }

    setIsStaking(true);
    setStakeError(null);

    try {
      console.log("Initializing wallet accounts...");
      const { userVAcc, userVeAcc } = await initializeWalletAccounts(anchorWallet, connection);
      console.log("Wallet accounts initialized successfully.");

      const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
      const programId = new PublicKey(process.env.NEXT_PUBLIC_MEMECHAN_PROGRAM_ID_V2!);
      const client = new VeChanStakingClient(programId, provider);

      const lockDuration = getLockDuration(selectedPeriod);

      const vChanMint = new PublicKey(process.env.NEXT_PUBLIC_VCHAN_TOKEN_ADDRESS!);
      const veChanMint = new PublicKey(process.env.NEXT_PUBLIC_VECHAN_TOKEN_ADDRESS!);

      const stakingState = getStakingStatePDA(vChanMint, veChanMint);
      const stakingStateSigner = getStakingStateSigner(stakingState);

      const { transaction: stakeTokensTx, stake } = await buildStakeTokensTransaction(
        new BN(lockDuration),
        new BN(Math.floor(stakeAmount * 1e9)),
        anchorWallet.publicKey,
        userVAcc,
        userVeAcc,
        null,
        vChanMint,
        veChanMint,
        stakingState,
        stakingStateSigner,
        client.program,
      );

      const latestBlockhash = await connection.getLatestBlockhash();

      stakeTokensTx.recentBlockhash = latestBlockhash.blockhash;
      stakeTokensTx.feePayer = anchorWallet.publicKey;

      stakeTokensTx.partialSign(stake);

      const signedTx = await anchorWallet.signTransaction(stakeTokensTx);

      if (!signedTx.signatures.every((sig) => sig.signature)) {
        throw new Error("Not all required signatures are present.");
      }

      const txId = await connection.sendRawTransaction(signedTx.serialize());

      await connection.confirmTransaction({
        signature: txId,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      console.log("Staking successful. Transaction ID:", txId);
      toast.success(`Staking successful. Transaction ID: ${txId}`); // Add toast notification here
      setStakeAmount(0);
      setReceiveAmount(0);
      sleep(1500).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error staking tokens:", error);
      toast.error("Error staking");
      setStakeError(`Staking failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsStaking(false);
    }
  };
  const getLockDuration = (period: string): number => {
    const durations: { [key: string]: number } = {
      "7d": 7 * 24 * 60 * 60,
      "14d": 14 * 24 * 60 * 60,
      "1M": 30 * 24 * 60 * 60,
      "3M": 90 * 24 * 60 * 60,
      "6M": 180 * 24 * 60 * 60,
      "12M": 365 * 24 * 60 * 60,
    };
    return durations[period] || 0;
  };

  const bonusPercentages: { [key: string]: number } = {
    "7d": 0,
    "14d": 1,
    "1M": 2,
    "3M": 6,
    "6M": 12,
    "12M": 24,
  };

  const handleStakeAmountChange = (percentage: number) => {
    if (balance !== null) {
      const newStakeAmount = balance * (percentage / 100);
      setStakeAmount(newStakeAmount);

      const bonusPercentage = bonusPercentages[selectedPeriod] || 0;
      const bonusMultiplier = 1 + bonusPercentage / 100;
      const newReceiveAmount = parseFloat((newStakeAmount * bonusMultiplier).toFixed(2));
      setReceiveAmount(newReceiveAmount);
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);

    if (balance !== null) {
      const bonusPercentage = bonusPercentages[period] || 0;
      const bonusMultiplier = 1 + bonusPercentage / 100;
      const newReceiveAmount = parseFloat((stakeAmount * bonusMultiplier).toFixed(2));
      setReceiveAmount(newReceiveAmount);
    }
  };

  useEffect(() => {
    if (balance !== null) {
      const bonusPercentage = bonusPercentages[selectedPeriod] || 0;
      const bonusMultiplier = 1 + bonusPercentage / 100;
      const newReceiveAmount = parseFloat((stakeAmount * bonusMultiplier).toFixed(2));
      setReceiveAmount(newReceiveAmount);
    } else {
      setReceiveAmount(0);
    }
  }, [balance, selectedPeriod, stakeAmount]);

  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";

  return (
    <div
      className={`flex flex-col grow pb-3.5 w-full rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor} max-md:mt-3`}
    >
      <Header title="Stake" />
      {connected ? (
        <div className="flex flex-col mx-4 mt-4 max-md:mx-2.5">
          {isLoading ? (
            <Skeleton className="h-6 w-full mb-4" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <StakingInfo label="Staking" value={`${balance?.toLocaleString() ?? "0"} vCHAN`} />
          )}

          <StakeAmount
            stakeAmount={stakeAmount}
            setStakeAmount={setStakeAmount}
            onPercentageChange={handleStakeAmountChange}
          />
          <PeridoInfo label="For period of" />
          <PeriodSelection selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
          <ReceiveInfo receiveAmount={receiveAmount} />
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
          <AdditionalInfo baseAPR="Coming soon" pointBoost="Coming soon" apr="Coming soon" />

          <button
            className={`mt-4 py-3 text-white text-center rounded ${isStaking ? "bg-gray-400" : "bg-pink-500"}`}
            onClick={handleStake}
            disabled={isStaking}
          >
            {isStaking ? "Staking..." : "Stake"}
          </button>

          {stakeError && <div className="mt-2 text-red-500">{stakeError}</div>}
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

const fetchTokenBalance = async (walletAddress: PublicKey, tokenMintAddress: PublicKey) => {
  const connection = new Connection(MEMECHAN_RPC_ENDPOINT, "confirmed");

  try {
    const tokenAccount = await getAssociatedTokenAddress(tokenMintAddress, walletAddress, true, TOKEN_PROGRAM_ID);

    console.log("Token account address:", tokenAccount.toBase58());

    const accountInfo = await connection.getAccountInfo(tokenAccount);
    if (!accountInfo) {
      console.log("Token account not found. Balance is likely 0.");
      return { amount: "0", decimals: 0, uiAmount: 0, uiAmountString: "0" };
    }

    const tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
    console.log("Token balance:", tokenAmount.value);

    return tokenAmount.value;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return null;
  }
};

export const useVChanBalance = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tokenMintAddress = new PublicKey(process.env.NEXT_PUBLIC_VCHAN_TOKEN_ADDRESS!);
        const tokenAmount = await fetchTokenBalance(publicKey, tokenMintAddress);
        console.log("tokenAmount vCHAN: ", tokenAmount);

        if (tokenAmount) {
          setBalance(Number(tokenAmount.amount) / Math.pow(10, tokenAmount.decimals));
        } else {
          setBalance(0);
        }
      } catch (err) {
        console.error("Error in useVChanBalance:", err);
        setBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    getBalance();
  }, [publicKey]);

  return { balance, isLoading, error };
};
async function buildStakeTokensTransaction(
  time: BNN,
  amount: BNN,
  userPublicKey: PublicKey,
  userVAcc: PublicKey,
  userVeAcc: PublicKey,
  vesting: PublicKey | null,
  vChanMint: PublicKey,
  veChanMint: PublicKey,
  stakingState: PublicKey,
  stakingStateSigner: PublicKey,
  program: any,
): Promise<{ transaction: Transaction; stake: Keypair }> {
  const stake = Keypair.generate();
  const stakeSigner = getUserStakeSigner(stake.publicKey);
  const vault = getAssociatedTokenAddressSync(vChanMint, stakeSigner, true);

  const vaultCTX = createAssociatedTokenAccountIdempotentInstruction(userPublicKey, vault, stakeSigner, vChanMint);

  const userVeAccCIx = createAssociatedTokenAccountIdempotentInstruction(
    userPublicKey,
    userVeAcc,
    userPublicKey,
    veChanMint,
    TOKEN_2022_PROGRAM_ID,
  );

  const stakeTokensInstruction = await program.methods
    .stakeTokens(time, amount)
    .accounts({
      signer: userPublicKey,
      stake: stake.publicKey,
      stakeSigner: stakeSigner,
      stakingState: stakingState,
      stakingStateSigner: stakingStateSigner,
      vesting,
      userVAcc,
      userVeAcc,
      vault: vault,
      vMint: vChanMint,
      veMint: veChanMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      token2022: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: COMPUTE_UNIT_PRICE,
  });

  const transaction = new Transaction().add(addPriorityFee, vaultCTX, userVeAccCIx, stakeTokensInstruction);

  return { transaction, stake };
}

export default StakeForm;
