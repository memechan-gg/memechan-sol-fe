import { SocialApiInstance } from "@/common/solana";
import CustomDate from "@/components/custom-date";
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

interface CommentProps {
  thread: CoinThreadWithParsedMessage;
  updateThreads: () => void;
  coinCreator: string;
  isLiked: boolean;
  refetchLikedThreads: () => {};
}

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
}: CommentProps) {
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

      const session = localStorage.getItem("session");
      if (!session) {
        throw new Error("No active session found");
      }

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
      console.error("Error in handleLikeEvent:", error);
      toast.error("An error occurred while liking the comment");
    }
  }, [publicKey, liked, signMessage, coinType, id, refetchLikedThreads]);

  const handleReplyThreadEvent = () => {
    openPostReplyDialog();
  };

  const isUsersComment = publicKey?.toString() === creator;
  const devsComment = coinCreator === creator;
  const slicedAddress = getSlicedAddress(creator);

  return (
    <div className="flex flex-row gap-1">
      <span className="text-lightRose">{">>"}</span>
      <div id={id} className="flex flex-col gap-3 w-[fit-content]">
        <div className="bg-title flex flex-row gap-4 bg-opacity-20 p-2 border-solid border-[1px] border border-t-0 border-l-0 border-dustyPink">
          <div className="flex flex-col gap-2">
            <div className="text-xs flex flex-row gap-1.5 font-bold text-regular">
              <Link className="hover:underline text-customGreen" href={`/profile/${creator}`}>
                <span className="text-deepGreen">
                  {slicedAddress} {isUsersComment ? "(me)" : ""} {devsComment ? "(dev)" : ""}
                </span>
              </Link>
              <div className="text-xs font-medium text-regular">
                <CustomDate creationDate={new Date(creationDate)} />
              </div>
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
    </div>
  );
}
