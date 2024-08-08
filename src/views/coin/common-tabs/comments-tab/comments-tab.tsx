import { useSocialAPI } from "../../hooks/useSocialAPI";
import { Comments } from "./comments";
import { PostReplyDialog } from "./post-reply/dialog";

export interface CommentsTabProps {
  coinAddress: string;
  coinCreator: string;
}
export function CommentsTab({ coinAddress, coinCreator }: CommentsTabProps) {
  const { threads, updateThreads, loadMore, nextPageToken } = useSocialAPI({ coinType: coinAddress });
  return (
    <div className="flex flex-col gap-3">
      <PostReplyDialog isStatic updateThreads={updateThreads} coinType={coinAddress} />
      <Comments threads={threads} updateThreads={updateThreads} coinCreator={coinCreator} coinType={coinAddress} />
      {nextPageToken && (
        <div onClick={loadMore} className="text-blue mt-2 cursor-pointer sm:hover:underline w-fit">
          Load more
        </div>
      )}
    </div>
  );
}
