import { Connection, PublicKey } from "@solana/web3.js";
import { isParsedTokenAccount } from "./type-guards";
import { ParsedTokenAccount } from "./types";

type GetTokenAccountsArgs = {
  tokenAddress: PublicKey;
  ownerAddress: PublicKey;
  connection: Connection;
};

export async function getTokenAccount(params: GetTokenAccountsArgs): Promise<ParsedTokenAccount | null> {
  const { connection, ownerAddress, tokenAddress } = params;
  const accounts = await connection.getParsedTokenAccountsByOwner(ownerAddress, { mint: tokenAddress });

  if (accounts.value.length === 0) {
    return null;
  }

  const parsedAccountData = accounts.value[0].account.data.parsed;

  if (isParsedTokenAccount(parsedAccountData)) {
    return parsedAccountData;
  }

  return null;
}
