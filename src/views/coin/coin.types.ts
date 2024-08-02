import { useLiveCoinUniqueHoldersFromBE } from "@/hooks/live/useLiveCoinUniqueHoldersFromBE";
import { usePresaleCoinUniqueHoldersFromBE } from "@/hooks/presale/usePresaleCoinUniqueHoldersFromBE";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useTickets } from "@/hooks/useTickets";
import { LivePoolData, SeedPoolData } from "@/types/pool";
import {
  BoundPoolClient,
  BoundPoolClientV2,
  ParsedMemeTicket,
  SolanaToken,
  TokenInfo,
  getBoundPoolClientFromId,
} from "@avernikoz/memechan-sol-sdk";

type BoundPool = Awaited<ReturnType<typeof getBoundPoolClientFromId>>["boundPoolInstance"]["poolObjectData"] | null;

export type UnavailableTicketsToSellDialogParams = {
  unavailableTickets: ParsedMemeTicket[];
  symbol: string;
};

export type PresaleCoinSwapProps = {
  tokenSymbol: string;
  pool: SeedPoolData;
  boundPool?: BoundPool;
  ticketsData: ReturnType<typeof useTickets>;
  memeImage: string;
  livePoolAddress?: string;
  stakingPoolFromApi?: ReturnType<typeof useStakingPoolFromApi>["data"];
  onClose?: () => void;
};

export type LiveCoinSwapProps = {
  tokenSymbol: string;
  pool: LivePoolData;
  memeImage: string;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
  seedPoolAddress?: string;
  onClose?: () => void;
};

export type SwapButtonProps = {
  coinToMeme: boolean;
  onClick: () => void;
  label: string;
};

export type PresaleCoinSidebarProps = {
  coinMetadata: SolanaToken;
  pool: SeedPoolData;
  uniqueHoldersData: ReturnType<typeof usePresaleCoinUniqueHoldersFromBE>["data"];
  ticketsData: ReturnType<typeof useTickets>;
  boundPoolClient:
    | {
        boundPoolInstance: BoundPoolClientV2;
        version: string;
      }
    | {
        boundPoolInstance: BoundPoolClient;
        version: string;
      };
};

export type LiveCoinSidebarProps = {
  pool: LivePoolData;
  coinMetadata: SolanaToken;
  uniqueHoldersData: ReturnType<typeof useLiveCoinUniqueHoldersFromBE>["data"];
  seedPoolData: ReturnType<typeof useSeedPool>["data"];
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
};

export type HoldersProps = {
  poolAddress: string;
  coinMetadata: SolanaToken;
  uniqueHoldersData: ReturnType<typeof usePresaleCoinUniqueHoldersFromBE>["data"];
};

export type LiveCoinHoldersProps = {
  coinMetadata: SolanaToken;
  uniqueHoldersData: ReturnType<typeof useLiveCoinUniqueHoldersFromBE>["data"];
  livePool: LivePoolData;
};

export type LiveCoinInfoProps = {
  metadata: SolanaToken;
  quoteMint: string;
  livePoolAddress: string;
};

export type PresaleCoinInfoProps = {
  metadata: SolanaToken;
  boundPool?: BoundPool;
  tokenInfo: TokenInfo;
};

export type UnstakeDialogProps = Omit<StakingPoolProps, "memeMint"> & {
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
  closePopUp?: () => void;
};

export type WithdrawFeesDialogProps = UnstakeDialogProps;

export type StakingPoolProps = {
  tokenSymbol: string;
  livePoolAddress: string;
  ticketsData: ReturnType<typeof useTickets>;
  stakingPoolFromApi: ReturnType<typeof useStakingPoolFromApi>["data"];
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
