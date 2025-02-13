import { Typography } from "@/memechan-ui/Atoms/Typography";
import { CoinThreadWithParsedMessage } from "@/views/coin/coin.types";
import { useLikes } from "@/views/coin/hooks/useLikes";
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
  const { data: likesData, refetch: refetchLikes } = useLikes(coinType);

  if (!threads || threads.length === 0) {
    return (
      <div className="mb-[87%]">
        <Typography variant="h4">No comments yet.</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {threads.map((thread) => {
        const commentIsLiked = !!likesData?.result.find(({ id }) => id === thread.id);
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
