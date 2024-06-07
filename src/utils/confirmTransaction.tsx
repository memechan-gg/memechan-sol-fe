import { TransactionConfirmationErrorNotification } from "@/components/notifications/transaction-confirmation-error-notification";
import { TX_CONFIRMATION_TIMEOUT_IN_MS } from "@/config/config";
import { Connection, TransactionExpiredTimeoutError } from "@solana/web3.js";
import toast from "react-hot-toast";

export const confirmTransaction = async ({ connection, signature }: { connection: Connection; signature: string }) => {
  const controller = new AbortController();

  try {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

    const confirmationPromise = connection.confirmTransaction(
      {
        signature: signature,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      },
      "confirmed",
    );

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => {
        controller.abort();
        reject(new TransactionExpiredTimeoutError(signature, TX_CONFIRMATION_TIMEOUT_IN_MS));
      }, TX_CONFIRMATION_TIMEOUT_IN_MS),
    );

    const swapTxResult = await Promise.race([confirmationPromise, timeoutPromise]);

    if (swapTxResult.value.err) {
      throw new Error(`[Transaction Confirmation] Failed: ${JSON.stringify(swapTxResult, null, 2)}`);
    }

    return true;
  } catch (e) {
    console.log("e instanceof TransactionExpiredTimeoutError:", e instanceof TransactionExpiredTimeoutError);
    if (e instanceof TransactionExpiredTimeoutError) {
      toast(
        () => (
          <TransactionConfirmationErrorNotification signature={signature} timeoutInMs={TX_CONFIRMATION_TIMEOUT_IN_MS} />
        ),
        { duration: 5_000 },
      );

      return false;
    } else {
      throw e;
    }
  }
};
