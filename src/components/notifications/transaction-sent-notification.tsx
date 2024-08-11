import { getExplorerTransactionLink } from "@/utils/getExplorerLink";

export const TransactionSentNotification = ({ signature }: { signature: string }) => {
  return (
    <span>
      <a href={getExplorerTransactionLink(signature)} target="_blank" className="sm:hover:underline text-blue">
        Transaction
      </a>{" "}
      is sent, waiting for confirmation...
    </span>
  );
};
