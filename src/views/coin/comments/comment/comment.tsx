import { SocialApiInstance } from "@/common/solana";
import { handleAuthentication } from "@/views/create-coin/create-coin.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CoinThreadWithParsedMessage } from "../../coin.types";
import { PostReplyDialog } from "../../post-reply/dialog";
import { getSlicedAddress } from "../../sidebar/holders/utils";
import { EmptyLikeIconSvgComponent } from "../likes/empty-like-icon";
import { FullLikeIconSvgComponent } from "../likes/full-like-icon";
import classes from "./comment.module.css";

export function Comment({
  thread: {
    coinType,
    creator,
    creationDate,
    id,
    message: { message, replyTo, image },
    likeCounter,
  },
  updateThreads,
  coinCreator,
  isLiked,
  refetchLikedThreads,
}: {
  thread: CoinThreadWithParsedMessage;
  updateThreads: () => void;
  coinCreator: string;
  isLiked: boolean;
  refetchLikedThreads: () => {};
}) {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likeCounter);
  const [isPostReplyDialogOpen, setIsPostReplyDialogOpen] = useState(false);

  const { publicKey, signMessage } = useWallet();

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const openPostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(true);
  }, []);

  const closePostReplyDialog = useCallback(() => {
    setIsPostReplyDialogOpen(false);
  }, []);

  const handleLikeEvent = useCallback(async () => {
    if (!publicKey || !signMessage) {
      return toast.error("Please connect your wallet");
    }

    try {
      await handleAuthentication(publicKey.toString(), signMessage);

      if (liked) {
        setLiked(false);
        setLikesCount((curCount) => curCount - 1);
        await SocialApiInstance.unlike({ coinType, threadId: id });
      } else {
        setLiked(true);
        setLikesCount((curCount) => curCount + 1);
        await SocialApiInstance.like({ coinType, threadId: id });
      }

      refetchLikedThreads();
    } catch (error) {
      console.error(error);
    }
  }, [publicKey, liked, signMessage, coinType, id, refetchLikedThreads]);

  const handleReplyThreadEvent = () => {
    openPostReplyDialog();
  };

  const isUsersComment = publicKey?.toString() === creator;
  const devsComment = coinCreator === creator;
  const slicedAddress = getSlicedAddress(creator);

  return (
    <>
      <div id={id} className="flex flex-col gap-3">
        <div className="bg-title flex flex-row gap-4 bg-opacity-30 p-4 rounded-xl">
          <div className="flex flex-col gap-2">
            <div className="text-xs flex flex-row gap-1.5 font-bold text-regular">
              <Link className="hover:underline" href={`/profile/${creator}`}>
                {slicedAddress} {isUsersComment ? "(me)" : ""} {devsComment ? "(dev)" : ""}
              </Link>
              <div className="text-xs font-medium text-regular">{new Date(creationDate).toLocaleString()}</div>
              <div className="text-xs font-medium flex flex-row gap-1 cursor-pointer" onClick={handleLikeEvent}>
                {liked ? <FullLikeIconSvgComponent /> : <EmptyLikeIconSvgComponent />} {likesCount}
              </div>
              <div className={classes["hover-underline"] + " text-xs font-medium"} onClick={handleReplyThreadEvent}>
                #{id} reply
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                <div className="text-xs text-regular">
                  <span className="text-regular font-bold cursor-pointer">
                    {replyTo ? <a className="hover:underline" href={`#${replyTo}`}>{`#${replyTo} `}</a> : ""}
                  </span>
                  {message}
                </div>
              </div>
            </div>
            {image && (
              <div>
                <img
                  src={image}
                  alt="picture"
                  className="mt-1 w-[150px] max-h-[250px] object-cover object-center border border-regular"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isPostReplyDialogOpen && (
        <PostReplyDialog
          onClose={closePostReplyDialog}
          coinType={coinType}
          replyThreadId={id}
          updateThreads={updateThreads}
        />
      )}
    </>
  );
}
