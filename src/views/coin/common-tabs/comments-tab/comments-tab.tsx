import { track } from "@vercel/analytics";
import { useCallback, useState } from "react";
import { useSocialAPI } from "../../hooks/useSocialAPI";
import { Comments } from "./comments";
import { PostReply } from "./post-reply";
import { PostReplyDialog } from "./post-reply/dialog";

export interface CommentsTabProps {
  coinAddress: string;
  coinCreator: string;
}
export function CommentsTab({ coinAddress, coinCreator }: CommentsTabProps) {
  const [isPostReplyDialogOpen, setIsPostReplyDialogOpen] = useState(false);
  const { threads, updateThreads, loadMore, nextPageToken } = useSocialAPI({ coinType: coinAddress });

  const openPostReplyDialog = useCallback(() => {
    track("OpenReplyDialog", { coinAddress });
    setIsPostReplyDialogOpen(true);
  }, []);

  const closePostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(false);
  }, []);

  return (
    <>
      {threads && threads.length > 0 && <PostReply openDialog={openPostReplyDialog} />}
      <Comments threads={threads} updateThreads={updateThreads} coinCreator={coinCreator} coinType={coinAddress} />
      {nextPageToken && (
        <div onClick={loadMore} className="text-blue mt-2 cursor-pointer hover:underline w-fit">
          Load more
        </div>
      )}
      <PostReply openDialog={openPostReplyDialog} />
      {isPostReplyDialogOpen && (
        <PostReplyDialog onClose={closePostReplyDialog} updateThreads={updateThreads} coinType={coinAddress} />
      )}
    </>
  );
}
