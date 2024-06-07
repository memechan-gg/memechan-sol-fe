import { useCallback, useState } from "react";
import { Comments } from "./comments";
import { useSocialAPI } from "./hooks/useSocialAPI";
import { PostReply } from "./post-reply";
import { PostReplyDialog } from "./post-reply/dialog";

export function CommentsPanel({ coinType, coinCreator }: { coinType: string; coinCreator: string }) {
  const [isPostReplyDialogOpen, setIsPostReplyDialogOpen] = useState(false);
  const { threads, updateThreads, loadMore, nextPageToken } = useSocialAPI({ coinType });

  const openPostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(true);
  }, []);

  const closePostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(false);
  }, []);

  return (
    <>
      {threads && threads.length > 0 && <PostReply openDialog={openPostReplyDialog} />}
      <Comments threads={threads} updateThreads={updateThreads} coinCreator={coinCreator} coinType={coinType} />
      {nextPageToken && (
        <div onClick={loadMore} className="text-blue mt-2 cursor-pointer hover:underline w-fit">
          Load more
        </div>
      )}
      <PostReply openDialog={openPostReplyDialog} />
      {isPostReplyDialogOpen && (
        <PostReplyDialog onClose={closePostReplyDialog} updateThreads={updateThreads} coinType={coinType} />
      )}
    </>
  );
}
