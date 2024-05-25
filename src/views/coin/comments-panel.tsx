import { useCallback, useState } from "react";
import { Comments } from "./comments";
import { useSocialAPI } from "./hooks/useSocialAPI";
import { PostReply } from "./post-reply";
import { PostReplyDialog } from "./post-reply/dialog";

export function CommentsPanel({ coinType }: { coinType: string }) {
  const [isPostReplyDialogOpen, setIsPostReplyDialogOpen] = useState(false);
  const { threads, updateThreads } = useSocialAPI({ coinType });

  const openPostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(true);
  }, []);

  const closePostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(false);
  }, []);

  return (
    <>
      {threads && threads.length > 0 && <PostReply openDialog={openPostReplyDialog} />}
      <Comments threads={threads} updateThreads={updateThreads} />
      <PostReply openDialog={openPostReplyDialog} />
      {isPostReplyDialogOpen && (
        <PostReplyDialog onClose={closePostReplyDialog} updateThreads={updateThreads} coinType={coinType} />
      )}
    </>
  );
}
