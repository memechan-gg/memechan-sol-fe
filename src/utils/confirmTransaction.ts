import { TX_CONFIRMATION_TIMEOUT_IN_MS } from "@/config/config";
import { Connection } from "@solana/web3.js";

export const confirmTransaction = async ({ connection, signature }: { connection: Connection; signature: string }) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TX_CONFIRMATION_TIMEOUT_IN_MS);

  const swapTxResult = await connection.confirmTransaction(
    {
      signature: signature,
      blockhash: blockhash,
      lastValidBlockHeight: lastValidBlockHeight,
      abortSignal: signal,
    },
    "confirmed",
  );

  clearTimeout(timeoutId);

  if (swapTxResult.value.err) {
    throw new Error(`[Transaction Confirmation] Failed: ${JSON.stringify(swapTxResult, null, 2)}`);
  }
};
