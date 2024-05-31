import { Connection, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { isParsedTokenAccount } from "./type-guards";
import { ParsedTokenAccount } from "./types";

type GetTokenAccountsArgs = {
  tokenAddress: PublicKey;
  ownerAddress: PublicKey;
  connection: Connection;
};

export async function getTokenAccounts(
  params: GetTokenAccountsArgs,
): Promise<{ tokenAccounts: ParsedTokenAccount[]; amount: string } | null> {
  const { connection, ownerAddress, tokenAddress } = params;
  const accounts = await connection.getParsedTokenAccountsByOwner(ownerAddress, { mint: tokenAddress });

  const parsedAccounts = accounts.value.reduce((accountsArray, accountData) => {
    const parsedAccountData = accountData.account.data.parsed;

    if (isParsedTokenAccount(parsedAccountData)) {
      accountsArray.push(parsedAccountData);
    }

    return accountsArray;
  }, [] as ParsedTokenAccount[]);

  const tokenUiAmount = parsedAccounts.reduce(
    (amount, accountData) => amount.plus(accountData.info.tokenAmount.uiAmount),
    new BigNumber(0),
  );

  return { tokenAccounts: parsedAccounts, amount: tokenUiAmount.toString() };
}
