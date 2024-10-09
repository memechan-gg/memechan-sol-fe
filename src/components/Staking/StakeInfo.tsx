import { AnchorProvider } from "@coral-xyz/anchor";
import { VeChanStakingClient } from "@rinegade/memechan-sol-sdk";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useAnchorWallet, useConnection, useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sleep } from "./utils";

type ParsedReward = any;
type UserRewards = any;

type UserStakeJSON = {
  owner: string;
  mint: string;
  vault: string;
  stakingState: string;
  amount: string;
  veAmount: string;
  stakedAt: string;
  lockedUntilTs: string;
  withdrawnAt: string;
  padding: number[];
};

type UserStake = {
  owner: PublicKey;
  mint: PublicKey;
  vault: PublicKey;
  stakingState: PublicKey;
  amount: BN;
  veAmount: BN;
  stakedAt: BN;
  lockedUntilTs: BN;
  withdrawnAt: BN;
  padding: number[];
  toJSON(): UserStakeJSON;
};

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

const DetailCard = ({
  label,
  value,
  action,
  stake,
  client,
}: {
  label: string;
  value: string;
  action?: string;
  stake?: any;
  client?: any;
}) => {
  const { theme } = useTheme();
  const { connection } = useConnection();

  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const actionColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  const { publicKey, signTransaction } = useWallet();
  const [unstakeError, setUnstakeError] = useState<string | null>(null);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const wallet = useWallet();

  async function initializeWalletAccounts(wallet: WalletContextState, connection: Connection) {
    if (!wallet.publicKey) throw new Error("Wallet not connected");

    const vChanMint = new PublicKey(process.env.NEXT_PUBLIC_VCHAN_TOKEN_ADDRESS!);
    const veChanMint = new PublicKey(process.env.NEXT_PUBLIC_VECHAN_TOKEN_ADDRESS!);

    const userVAcc = await getAssociatedTokenAddress(vChanMint, wallet.publicKey);
    const userVeAcc = await getAssociatedTokenAddress(veChanMint, wallet.publicKey, false, TOKEN_2022_PROGRAM_ID);

    const initAccountsTx = new Transaction();

    initAccountsTx.add(
      createAssociatedTokenAccountIdempotentInstruction(wallet.publicKey, userVAcc, wallet.publicKey, vChanMint),
    );

    initAccountsTx.add(
      createAssociatedTokenAccountIdempotentInstruction(
        wallet.publicKey,
        userVeAcc,
        wallet.publicKey,
        veChanMint,
        TOKEN_2022_PROGRAM_ID,
      ),
    );

    const latestBlockhash = await connection.getLatestBlockhash();
    initAccountsTx.recentBlockhash = latestBlockhash.blockhash;
    initAccountsTx.feePayer = wallet.publicKey;

    try {
      if (!wallet.signTransaction) {
        throw new Error("Wallet does not support transaction signing or is not connected");
      }

      const signedTx = await wallet.signTransaction(initAccountsTx);
      const txId = await connection.sendRawTransaction(signedTx.serialize());

      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: txId,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      console.log("Wallet accounts initialized. Transaction ID:", txId);
      return { userVAcc, userVeAcc };
    } catch (error) {
      console.error("Error initializing wallet accounts:", error);
      throw error;
    }
  }

  const handleUnstake = async () => {
    if (!wallet.publicKey || !stake || !client || !connection) {
      setUnstakeError("Missing required data for unstaking");
      return;
    }

    setIsUnstaking(true);
    setUnstakeError(null);

    try {
      console.log("Initializing wallet accounts...");
      const { userVAcc, userVeAcc } = await initializeWalletAccounts(wallet, connection);
      console.log("Wallet accounts initialized successfully.");

      console.log("Preparing Unstake Tokens Transaction...");
      console.log("Stake object:", stake);

      if (!stake.address) {
        throw new Error("Stake address is undefined");
      }

      const unstakeTokensTx = await client.buildUnstakeTokensTransaction(wallet.publicKey, stake.address);

      unstakeTokensTx.feePayer = wallet.publicKey;

      const { blockhash } = await connection.getLatestBlockhash();
      unstakeTokensTx.recentBlockhash = blockhash;

      console.log("Sending Unstake Tokens Transaction...");

      if (!wallet.connected || typeof wallet.signTransaction !== "function") {
        throw new Error("Wallet is not connected or doesn't support signing");
      }

      try {
        const unstakeTokensTxId = await wallet.sendTransaction(unstakeTokensTx, connection);
        console.log("Tokens unstaked successfully. Transaction signature:", unstakeTokensTxId);

        // Wait for the transaction confirmation
        const latestBlockhash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction({
          signature: unstakeTokensTxId,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        if (confirmation.value.err) {
          throw new Error("Transaction failed: " + JSON.stringify(confirmation.value.err));
        } else {
          toast.success(`Unstaking successful. Transaction ID: ${unstakeTokensTxId}`);
          sleep(1500).then(() => {
            window.location.reload();
          });
        }
      } catch (transactionError) {
        console.error("Error during transaction:", transactionError);

        if (transactionError instanceof Error) {
          toast.error(`Unstaking transaction failed: ${transactionError.message}`);
          setUnstakeError(`Unstaking transaction failed: ${transactionError.message}`);
        } else {
          toast.error("An unknown error occurred during the transaction");
          setUnstakeError("An unknown error occurred during the transaction");
        }
      }
    } catch (error) {
      console.error("Error unstaking tokens:", error);

      if (error instanceof Error) {
        if (error.message.includes("custom program error: Unlock timestamp has not yet passed")) {
          toast.error("Unstaking failed: Unlock timestamp has not yet passed.");
          setUnstakeError("Unstaking failed: Unlock timestamp has not yet passed.");
        } else {
          toast.error(`Unstaking failed: ${error.message}`);
          setUnstakeError(`Unstaking failed: ${error.message}`);
        }
      } else {
        toast.error("An unknown error occurred during unstaking");
        setUnstakeError("An unknown error occurred during unstaking");
      }
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div className={`flex flex-col flex-1 p-4 rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor}`}>
      <div className="flex justify-between text-sm">
        <div className={textColor}>{label}</div>
        {action && (
          <div
            className={`underline cursor-pointer ${actionColor}`}
            onClick={() => {
              if (action === "Unstake") {
                handleUnstake();
              } else {
                console.log(`${action} clicked for ${label}`);
              }
            }}
          >
            {action}
          </div>
        )}
      </div>
      <div className={`mt-5 text-base font-bold ${textColor}`}>{value}</div>
    </div>
  );
};

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

const Earnings = ({ label, value, action }: { label: string; value: string; action?: string }) => {
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

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}></div>
);

const StakeInfo = () => {
  const { theme } = useTheme();
  const { connected } = useWallet();
  const { stakeData, isLoading, error, client } = useStakeData();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter out stakes where withdrawnAt is not equal to "0"
  const filteredStakes = stakeData?.userStakes.filter((stake: any) => {
    return stake.data.withdrawnAt?.toString() === "0";
  });

  const paginatedStakes = filteredStakes?.slice(startIndex, endIndex);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat().format(amount);
  };

  const calculateAPR = () => {
    return "Coming soon";
  };

  const getRewardsAmount = (rewards: ParsedReward[], userStake: UserStake | undefined, userRewards: UserRewards) => {};

  const getLockedUntil = (timestamp: number) => {
    if (timestamp === 0) {
      return "No lock";
    }
    return new Date(timestamp * 1000).toLocaleDateString();
  };

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
      {connected && stakeData ? (
        filteredStakes?.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-3 mx-4 mt-4">
              {paginatedStakes.map((stake: any, index: number) => {
                const amountInNumber: number = stake.data?.amount?.toNumber() ?? 0;
                const formattedAmount = formatAmount(amountInNumber / 1e9);

                return (
                  <div key={index} className="w-full sm:w-[calc(33.33%-0.5rem)]">
                    <DetailCard
                      label="Staked"
                      value={`${formattedAmount} vCHAN`}
                      action="Unstake"
                      stake={stake}
                      client={client}
                    />
                    <DetailCard
                      label="Locked Until"
                      value={getLockedUntil(stake.data?.lockedUntilTs?.toNumber() ?? 0)}
                    />
                    <DetailCard label="Current APR" value={calculateAPR()} />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 mr-2 text-sm font-semibold ${currentPage === 1 ? "text-gray-400" : "text-pink-500"}`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={endIndex >= filteredStakes?.length}
                className={`px-4 py-2 text-sm font-semibold ${endIndex >= filteredStakes?.length ? "text-gray-400" : "text-pink-500"}`}
              >
                Next
              </button>
            </div>
            <Warning message="Earn or buy more Points to boost APR!" />
            {(() => {
              const rewardsAmount = getRewardsAmount(stakeData.rewards, filteredStakes[0]?.data, stakeData.userRewards);
              return <Earnings label="SOL Earned" value="Coming soon" />;
            })()}
          </>
        ) : (
          <div className="p-4 text-center">
            <p>You don&apos;t have any active stakes.</p>
            {/* You might want to add a button or link here to guide users on how to stake */}
          </div>
        )
      ) : (
        <div className="p-4">
          {connected ? (
            <div className="flex flex-wrap gap-3 mb-4">
              <Skeleton className="h-20 w-full sm:w-[calc(33.33%-0.5rem)]" />
              <Skeleton className="h-20 w-full sm:w-[calc(33.33%-0.5rem)]" />
              <Skeleton className="h-20 w-full sm:w-[calc(33.33%-0.5rem)]" />
            </div>
          ) : (
            <p className="text-center">Please connect your wallet to view your stake information.</p>
          )}
        </div>
      )}
    </div>
  );
};

const useStakeData = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [stakeData, setStakeData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [client, setClient] = useState<VeChanStakingClient | null>(null);

  useEffect(() => {
    const fetchStakeData = async () => {
      if (!publicKey || !anchorWallet) return;

      setIsLoading(true);
      setError(null);

      try {
        const programId = process.env.NEXT_PUBLIC_MEMECHAN_PROGRAM_ID_STAKING;

        if (!programId) {
          throw new Error("NEXT_PUBLIC_MEMECHAN_PROGRAM_ID_STAKING is not defined");
        }

        const provider = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
        const client = new VeChanStakingClient(new PublicKey(programId), provider);

        setClient(client);

        const userStakes = await client.fetchStakesForUser(publicKey);
        const rewards = await client.fetchUserRewardsForStakes(userStakes.map((el: any) => el.address));
        const userRewards = await client.fetchRewards();

        console.log("Fetched rewards:", rewards);
        console.log("userStakes", userStakes);
        console.log("userRewards", userRewards);

        setStakeData({ userStakes, rewards, userRewards });
      } catch (err) {
        console.error("Error fetching stake data:", err);
        setError("Failed to fetch stake data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakeData();
  }, [publicKey, connection, anchorWallet]);

  return { stakeData, isLoading, error, client };
};

export default StakeInfo;
