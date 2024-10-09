import { AnchorProvider, BN, Wallet } from "@coral-xyz/anchor";
import {
  getUserStakeSigner,
  TOKEN_INFOS,
  VeChanStakingClient,
  VESTING_PROGRAM_ID,
} from "@rinegade/memechan-sol-sdk";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";

function getAssociatedTokenAddressSync(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): PublicKey {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) {
    throw new Error("Owner cannot be off curve");
  }

  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId,
  )[0];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function veChanStakingExample(connection: Connection, payer: Keypair) {
  try {
    const provider = new AnchorProvider(connection, new Wallet(payer), {
      commitment: "confirmed",
    });
    const client = new VeChanStakingClient(VESTING_PROGRAM_ID, provider);
    const userPublicKey = payer.publicKey;

    console.log("VESTING_PROGRAM_ID:", VESTING_PROGRAM_ID.toBase58());
    console.log("vCHAN Mint:", TOKEN_INFOS.vCHAN.mint.toBase58());
    console.log("VeCHAN Mint:", TOKEN_INFOS.veCHAN.mint.toBase58());
    console.log("User public key:", userPublicKey.toBase58());

    console.log("Preparing Stake Tokens Transaction...");
    const stakeDuration = new BN(3); // 3 seconds
    const stakeAmount = new BN(500000000); // 0.5 tokens with 9 decimals

    const userVAcc = getAssociatedTokenAddressSync(TOKEN_INFOS.vCHAN.mint, userPublicKey);
    console.log("User vAcc:", userVAcc.toBase58());

    const userVeAcc = getAssociatedTokenAddressSync(TOKEN_INFOS.veCHAN.mint, userPublicKey);
    console.log("User veAcc:", userVeAcc.toBase58());

    const { transaction: stakeTokensTx, stake } = await client.buildStakeTokensTransaction(
      stakeDuration,
      stakeAmount,
      userPublicKey,
      userVAcc,
      userVeAcc,
      null,
    );

    console.log("Stake public key:", stake.publicKey.toBase58());

    const stakeSigner = getUserStakeSigner(stake.publicKey);
    console.log("Stake signer:", stakeSigner.toBase58());

    const vault = getAssociatedTokenAddressSync(TOKEN_INFOS.vCHAN.mint, stakeSigner, true);
    console.log("Vault:", vault.toBase58());

    console.log("Sending Stake Tokens Transaction...");
    const stakeTokensTxId = await sendAndConfirmTransaction(connection, stakeTokensTx, [payer, stake], {
      commitment: "confirmed",
    });
    console.log("Tokens staked. Transaction ID:", stakeTokensTxId);

    console.log("Waiting for 5 seconds before unstaking...");
    await sleep(5000);

    console.log("\nPreparing Unstake Tokens Transaction...");
    const unstakeTokensTx = await client.buildUnstakeTokensTransaction(userPublicKey, stake.publicKey);

    console.log("Sending Unstake Tokens Transaction...");
    const unstakeTokensTxId = await sendAndConfirmTransaction(connection, unstakeTokensTx, [payer]);
    console.log("Tokens unstaked. Transaction ID:", unstakeTokensTxId);

    return {
      stakeTokensTxId,
      unstakeTokensTxId,
    };
  } catch (error) {
    console.error("An error occurred during the staking process:", error);
    throw error;
  }
}
