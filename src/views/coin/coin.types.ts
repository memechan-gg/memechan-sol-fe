import { CoinMetadata } from "@/types/coin";
import {
  AddLiquidityParams,
  GetSwapOutputAmountParams,
  GetSwapTransactionParams,
  QuoteAddLiquidityParams,
  QuoteRemoveLiquidityParams,
  RemoveLiquidityParams,
} from "@/types/hooks";
import { LivePoolData, PoolStatus, SeedPoolData } from "@/types/pool";
import { GetBuyMemeTransactionOutput, ParsedMemeTicket } from "@avernikoz/memechan-sol-sdk";
import { StakingPool } from "@avernikoz/memechan-ts-sdk";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export type UseQueryCoinParams = {
  mint: string;
};

export type UnavailableTicketsToSellDialogParams = {
  unavailableTickets: ParsedMemeTicket[];
  symbol: string;
};

export type PresaleCoinSwapProps = {
  tokenSymbol: string;
  pool: SeedPoolData | LivePoolData;
};

export type SwapComponentParams = {
  tokenSymbol: string;
  pool: SeedPoolData | LivePoolData;
  status: PoolStatus;
  swapMethods: {
    getSwapTransaction: (params: GetSwapTransactionParams) => Promise<GetBuyMemeTransactionOutput | undefined>;
    getSwapOutputAmount: (params: GetSwapOutputAmountParams) => Promise<string | undefined>;
  };
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

export type HoldersProps = {
  poolAddress: string;
  coinMetadata: CoinMetadata;
};

export type SidebarProps = {
  pool: SeedPoolData | LivePoolData;
  coinMetadata: CoinMetadata;
  swapMethods: {
    getSwapTransaction: (params: GetSwapTransactionParams) => Promise<GetBuyMemeTransactionOutput | undefined>;
    getSwapOutputAmount: (params: GetSwapOutputAmountParams) => Promise<string | undefined>;
  };
};

export type InfoProps = {
  metadata: CoinMetadata;
  poolAddress: string;
};

export type LiquidityProps = {
  memeBalance: string;
  tokenSymbol: string;
  lpCoinType?: string;
  quoteAddLiquidity: (params: QuoteAddLiquidityParams) => Promise<string>;
  addLiquidity: (params: AddLiquidityParams) => Promise<TransactionBlock>;
  quoteRemoveLiquidity: (params: QuoteRemoveLiquidityParams) => Promise<string[]>;
  removeLiquidity: (params: RemoveLiquidityParams) => Promise<TransactionBlock>;
};

export type ActualLiquidityProps = {
  memeBalance: string;
  tokenSymbol: string;
  lpCoinType: string;
  quoteAddLiquidity: (params: QuoteAddLiquidityParams) => Promise<string>;
  addLiquidity: (params: AddLiquidityParams) => Promise<TransactionBlock>;
  quoteRemoveLiquidity: (params: QuoteRemoveLiquidityParams) => Promise<string[]>;
  removeLiquidity: (params: RemoveLiquidityParams) => Promise<TransactionBlock>;
};

export type AddLiquidityDialogProps = {
  memeBalance: string;
  tokenSymbol: string;
  lpCoinBalance: string;
  quoteAddLiquidity: (params: QuoteAddLiquidityParams) => Promise<string>;
  addLiquidity: (params: AddLiquidityParams) => Promise<TransactionBlock>;
};

export type RemoveLiquidityDialogProps = {
  tokenSymbol: string;
  lpCoinBalance: string;
  quoteRemoveLiquidity: (params: QuoteRemoveLiquidityParams) => Promise<string[]>;
  removeLiquidity: (params: RemoveLiquidityParams) => Promise<TransactionBlock>;
};

export type UnstakeDialogProps = {
  tokenSymbol: string;
  ticketBalance: string;
  stakingPool: StakingPool;
};

export type WithdrawFeesDialogProps = {
  stakingPool: StakingPool;
  tokenSymbol: string;
  ticketBalance: string;
};

export type StakingPoolProps = {
  coinType: string;
  ticketBalance: string;
  tokenSymbol: string;
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

export type CoinThreadParsedMessage = { message: string; replyTo?: string };

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
