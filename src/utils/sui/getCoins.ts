import { Connection } from '@solana/web3.js';


type GetCoinArgs = {
  coin: string;
  address: string;
  provider: Connection;
};

export async function getCoins(params: GetCoinArgs) {
  const { coin, address, provider } = params;
  let hasNextPage = true;
  let cursor: string | null | undefined = null;

  return [];
}

type GetCoinDecimalsArgs = {
  coin: string;
  address: string;
  provider: Connection;
  decimals: number;
};

export async function getCoinsAndNormalizeWithDecimals(params: GetCoinDecimalsArgs) {
  const coinStructs = await getCoins(params);

  return {
    raw: 0,
    formatted: 0,
  };
}
