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
};

export type LiveCoinSidebarProps = {
  pool: LivePoolData;
  coinMetadata: CoinMetadata;
};

export type HoldersProps = {
  poolAddress: string;
  coinMetadata: CoinMetadata;
};

export type LiveCoinHoldersProps = {
  coinMetadata: CoinMetadata;
};

export type LiveCoinInfoProps = {
  metadata: CoinMetadata;
  livePoolAddress: string;
};

export type PresaleCoinInfoProps = { poolAddress: string; metadata: CoinMetadata };

export type UnstakeDialogProps = StakingPoolProps;

export type WithdrawFeesDialogProps = StakingPoolProps;

export type StakingPoolProps = {
  tokenSymbol: string;
  livePoolAddress: string;
  memeMint: string;
  ticketsData: ReturnType<typeof useTickets>;
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
