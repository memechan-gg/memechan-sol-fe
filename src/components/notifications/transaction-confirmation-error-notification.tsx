import { getExplorerTransactionLink } from "@/utils/getExplorerLink";
import BigNumber from "bignumber.js";

export const TransactionConfirmationErrorNotification = ({
  signature,
  timeoutInMs,
}: {
  signature: string;
  timeoutInMs: number;
}) => {
  const timeoutInS = new BigNumber(timeoutInMs).div(1_000).toString();

  return (
    <span>
      <a href={getExplorerTransactionLink(signature)} target="_blank" className="sm:hover:underline text-blue">
        Transaction
      </a>{" "}
      was not confirmed in {timeoutInS} seconds. It is unknown if it succeeded or failed. Check{" "}
      <a href={getExplorerTransactionLink(signature)} target="_blank" className="sm:hover:underline text-blue">
        transaction
      </a>{" "}
      using the Solana Explorer.
    </span>
  );
};
