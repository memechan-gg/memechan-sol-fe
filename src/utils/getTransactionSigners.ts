import { Keypair, PublicKey, Transaction } from "@solana/web3.js";

export const getTransactionSigners = ({
  extraSigners,
  transaction,
}: {
  extraSigners: Keypair[];
  transaction: Transaction;
}): Keypair[] => {
  const signerPubkeys = transaction.instructions.reduce((signersSet, instruction) => {
    instruction.keys.forEach((accountMeta) => accountMeta.isSigner && signersSet.add(accountMeta.pubkey));
    return signersSet;
  }, new Set<PublicKey>());
  const signerPubkeysArray = Array.from(signerPubkeys);

  const signers = extraSigners.reduce((signersArray, signer) => {
    if (signerPubkeysArray.some((pubkey) => pubkey.equals(signer.publicKey))) {
      signersArray.push(signer);
    }

    return signersArray;
  }, [] as Keypair[]);

  return signers;
};
