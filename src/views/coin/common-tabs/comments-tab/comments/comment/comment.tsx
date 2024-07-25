import { SocialApiInstance } from "@/common/solana";
import CustomDate from "@/components/custom-date";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { CoinThreadWithParsedMessage } from "@/views/coin/coin.types";
import { getSlicedAddress } from "@/views/coin/sidebar/holders/utils";
import { handleAuthentication } from "@/views/create-coin/create-coin.utils";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PostReplyDialog } from "../../post-reply/dialog";
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

  // FIX - CSS EDO2
  return (
    <div className="flex flex-row gap-1 w-full" id={id}>
      <Card>
        <Card.Header>
          <div>
            <FontAwesomeIcon icon={faEllipsisVertical} className="text-mono-600" />
            <Link className="hover:underline text-customGreen" href={`/profile/${creator}`} />
            {slicedAddress} {isUsersComment ? "(me)" : ""} {devsComment ? "(dev)" : ""}
            <CustomDate creationDate={new Date(creationDate)} />
            <div className={classes["hover-underline"] + " text-xs font-medium"}>#{id}</div>
          </div>
        </Card.Header>
        <Card.Body>
          {image && (
            <div>
              <img
                src={image}
                alt="picture"
                className="mt-1 w-[150px] max-h-[250px] object-cover object-center border border-regular"
              />
            </div>
          )}
          {message}
        </Card.Body>
        <Card.Footer>
          <div onClick={handleReplyThreadEvent}>
            {" "}
            <span className="text-primary-100">{">>"}</span>
          </div>
          {replyTo ? (
            <a className="hover:underline" href={`#${replyTo}`}>
              Reply
            </a>
          ) : (
            ""
          )}
          {liked ? (
            <Typography variant="body">Like</Typography>
          ) : (
            <div>
              <Typography variant="body">Liked</Typography>
              {likesCount}
            </div>
          )}
        </Card.Footer>
      </Card>
      {isPostReplyDialogOpen && (
        <PostReplyDialog
          onClose={closePostReplyDialog}
          coinType={coinType}
          replyThreadId={id}
          updateThreads={updateThreads}
          isStatic={false}
        />
      )}
    </div>
  );
}
