import { CoinMetadata } from "@/types/coin";
import {
  AddLiquidityParams,
  QuoteAddLiquidityParams,
  QuoteRemoveLiquidityParams,
  QuoteSwapParams,
  RemoveLiquidityParams,
  SwapParams,
} from "@/types/hooks";
import { StakedLpObject, StakingPool } from "@avernikoz/memechan-ts-sdk";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export type UseQueryCoinParams = {
  mint: string;
};

export type AvailableTicketToSellDialogParams = {
  availableTickets: StakedLpObject[];
  symbol: string;
};

export type SwapComponentParams = {
  tokenSymbol: string;
  pool: PoolResponse;
  memeBalance: string;
  swap: (params: SwapParams) => Promise<TransactionBlock | undefined>;
  quoteSwap: (params: QuoteSwapParams) => Promise<string>;
};

export type SwapButtonProps = {
  isXToY: boolean;
  onClick: () => void;
  label: string;
};

export type SidebarProps = {
  pool: PoolResponse;
  memeBalance: string;
  coinMetadata: CoinMetadata;
  // TODO: Remove CLAMM from SidebarProps
  CLAMM: any;
};

export type InfoProps = {
  metadata: CoinMetadata;
  poolAddress: string;
};

export type HoldersProps = {
  holders: {
    address: string;
    percentage: string;
    type: "bonding_curve" | "dev" | string | undefined;
  }[];
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
