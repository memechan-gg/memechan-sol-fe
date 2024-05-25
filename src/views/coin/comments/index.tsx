import { CoinThreadWithParsedMessage } from "../coin.types";
import { Comment } from "./comment/comment";

export const Comments = ({
  updateThreads,
  threads,
}: {
  updateThreads: () => void;
  threads?: CoinThreadWithParsedMessage[];
}) => {
  if (!threads || threads.length === 0) {
    return <div className="text-xs font-bold text-regular">No comments yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-bold text-regular">Comments</div>
      {threads.map((thread) => (
        <Comment key={thread.id} thread={thread} updateThreads={updateThreads} />
      ))}
    </div>
  );
};
