import { useLiveCoinUniqueHoldersFromBE } from "@/hooks/live/useLiveCoinUniqueHoldersFromBE";
import { useBoundPool } from "@/hooks/presale/useBoundPool";
import { usePresaleCoinUniqueHoldersFromBE } from "@/hooks/presale/usePresaleCoinUniqueHoldersFromBE";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPoolClient } from "@/hooks/staking/useStakingPoolClient";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useTickets } from "@/hooks/useTickets";
import { CoinMetadata } from "@/types/coin";
import { LivePoolData, SeedPoolData } from "@/types/pool";
import { ParsedMemeTicket } from "@avernikoz/memechan-sol-sdk";

export type UnavailableTicketsToSellDialogParams = {
  unavailableTickets: ParsedMemeTicket[];
  symbol: string;
};

export type PresaleCoinSwapProps = {
  tokenSymbol: string;
  pool: SeedPoolData;
  boundPool: ReturnType<typeof useBoundPool>;
  ticketsData: ReturnType<typeof useTickets>;
};

export type LiveCoinSwapProps = {
  tokenSymbol: string;
  pool: LivePoolData;
};

export type SwapButtonProps = {
  slerfToMeme: boolean;
  onClick: () => void;
  label: string;
};

export type PresaleCoinSidebarProps = {
  coinMetadata: CoinMetadata;
  pool: SeedPoolData;
  uniqueHoldersData: ReturnType<typeof usePresaleCoinUniqueHoldersFromBE>;
  ticketsData: ReturnType<typeof useTickets>;
};

export type LiveCoinSidebarProps = {
  pool: LivePoolData;
  coinMetadata: CoinMetadata;
  uniqueHoldersData: ReturnType<typeof useLiveCoinUniqueHoldersFromBE>;
  seedPoolData: ReturnType<typeof useSeedPool>;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>;
};

export type HoldersProps = {
  poolAddress: string;
  coinMetadata: CoinMetadata;
  uniqueHoldersData: ReturnType<typeof usePresaleCoinUniqueHoldersFromBE>;
};

export type LiveCoinHoldersProps = {
  coinMetadata: CoinMetadata;
  uniqueHoldersData: ReturnType<typeof useLiveCoinUniqueHoldersFromBE>;
};

export type LiveCoinInfoProps = {
  metadata: CoinMetadata;
  livePoolAddress: string;
};

export type PresaleCoinInfoProps = {
  metadata: CoinMetadata;
  boundPool: ReturnType<typeof useBoundPool>;
};

export type UnstakeDialogProps = Omit<StakingPoolProps, "memeMint"> & {
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>;
  stakingPoolClient: ReturnType<typeof useStakingPoolClient>;
};

export type WithdrawFeesDialogProps = Omit<UnstakeDialogProps, "stakingPoolFromApi">;

export type StakingPoolProps = {
  tokenSymbol: string;
  livePoolAddress: string;
  ticketsData: ReturnType<typeof useTickets>;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>;
};

export type CoinThread = {
  message: string;
  type: "THREAD";
  creator: string;
  coinType: string;
  creationDate: number;
  id: string;
  likeCounter: number;
  replyCounter: number;
};

export type CoinThreadParsedMessage = { message: string; replyTo?: string; image?: string };

export type CoinThreadWithParsedMessage = {
  message: CoinThreadParsedMessage;
  type: "THREAD";
  creator: string;
  coinType: string;
  creationDate: number;
  id: string;
  likeCounter: number;
  replyCounter: number;
};
