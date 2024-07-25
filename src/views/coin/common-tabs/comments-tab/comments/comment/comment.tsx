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
  // functionality for reply and like
  return (
    <div className="flex flex-row gap-1 w-full" id={id}>
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center w-full leading-5">
            <div className="flex gap-2 items-center">
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-mono-600" />
              <Link className="hover:underline text-green-100" href={`/profile/${creator}`} >
                {slicedAddress} {isUsersComment ? "(me)" : ""} {devsComment ? "(dev)" : ""}
              </Link>
            </div>
            <div className="flex items-center text-right">
              <CustomDate creationDate={new Date(creationDate)} />
              <div className={classes["hover-underline"] + " text-[13px] font-normal leading-5 text-mono-500"}>&nbsp;#{id}</div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
            {image && (
              <div className="flex-1">
                <img
                  src={image}
                  alt="picture"
                  className="w-full max-h-[100vw] object-cover object-center primary-border"
                />
              </div>
            )}
            {<Typography className="flex-1">
              if we killed all mosquitoes would that fuck up the food chain in the same way as the great leap forward
            </Typography> }
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex justify-between w-full">
          <div  onClick={handleReplyThreadEvent}>
            <span>
              <Typography color="mono-500" variant="text-button" underline={true}>
                {">>Reply"}
              </Typography>
            </span>
          </div>
          {replyTo ? (
            <a className="hover:underline" href={`#${replyTo}`}>
              Reply
            </a>
          ) : (
            ""
          )}
          {liked ? (
            <Typography variant="text-button" color="mono-500">Like </Typography>
          ) : (
            <div>
              <Typography variant="text-button" color="primary-100">Liked ({likesCount})</Typography>
            </div>
          )}
          </div>
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
