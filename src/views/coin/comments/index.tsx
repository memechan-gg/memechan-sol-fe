import { CoinThreadWithParsedMessage } from "../coin.types";
import { useLikes } from "../hooks/useLikes";
import { Comment } from "./comment/comment";

export const Comments = ({
  updateThreads,
  threads,
  coinCreator,
  coinType,
}: {
  updateThreads: () => void;
  threads?: CoinThreadWithParsedMessage[];
  coinCreator: string;
  coinType: string;
}) => {
  const { likesData, refetch: refetchLikes } = useLikes(coinType);

  if (!threads || threads.length === 0) {
    return <div className="text-xs font-bold text-regular">No comments yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-bold text-regular">Comments</div>
      {threads.map((thread) => {
        const commentIsLiked = !!likesData?.find(({ id }) => id === thread.id);

        return (
          <Comment
            key={thread.id}
            thread={thread}
            updateThreads={updateThreads}
            coinCreator={coinCreator}
            isLiked={commentIsLiked}
            refetchLikedThreads={refetchLikes}
          />
        );
      })}
    </div>
  );
};
