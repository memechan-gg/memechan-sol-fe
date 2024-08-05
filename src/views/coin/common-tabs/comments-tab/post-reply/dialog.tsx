import { SocialApiInstance } from "@/common/solana";
import { WithConnectedWallet } from "@/components/WithConnectedWallet";
import { Button } from "@/memechan-ui/Atoms";
import FileInput from "@/memechan-ui/Atoms/Input/FileInput";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { CoinThreadParsedMessage } from "@/views/coin/coin.types";
import { handleAuthentication, uploadImageToIPFS } from "@/views/create-coin/create-coin.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export type PostReplyDialogProps =
  | {
      isStatic: true;
      onClose?: () => void;
      updateThreads: () => void;
      coinType: string;
      replyThreadId?: string;
    }
  | {
      isStatic: false;
      onClose: () => void;
      updateThreads: () => void;
      coinType: string;
      replyThreadId?: string;
    };

export function PostReplyDialog({ isStatic, onClose, updateThreads, coinType, replyThreadId }: PostReplyDialogProps) {
  const [replyText, setReplyText] = useState("");
  const { publicKey, signMessage } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { connected } = useWallet();

  const handleSendReply = useCallback(async () => {
    try {
      setIsLoading(true);

      const trimmedReplyText = replyText.trim();
      const trackObj = { file: !!file, text: !!trimmedReplyText };

      if (trimmedReplyText === "") {
        return toast.error("Message is clean");
      }

      track("Reply", trackObj);

      if (!publicKey || !signMessage) {
        return toast.error("Please connect your wallet");
      }

      const messageObject: CoinThreadParsedMessage = { message: trimmedReplyText };

      if (replyThreadId) {
        messageObject.replyTo = replyThreadId;
      }

      await handleAuthentication(publicKey.toString(), signMessage);

      if (file) {
        const ipfsUrl = await uploadImageToIPFS(file);
        messageObject.image = ipfsUrl;
      }

      const stringifiedMessage = JSON.stringify(messageObject);
      await SocialApiInstance.createThread({ message: stringifiedMessage, coinType });

      track("Reply_Sent", trackObj);

      updateThreads();
      setReplyText("");
      toast.success("Reply posted successfully!");

      if (!isStatic) {
        onClose();
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to post a reply. Please, try again");
    } finally {
      setIsLoading(false);
    }
  }, [replyText, file, publicKey, signMessage, replyThreadId, coinType, updateThreads, isStatic, onClose]);

  return (
    <>
      {isStatic ? (
        <Card>
          <Card.Header>
            <div>
              <Typography variant="h4" color="mono-600">
                Post a comment
              </Typography>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col gap-3">
              <TextInput
                value={replyText}
                setValue={setReplyText}
                placeholder="Comment"
                className="primary-border p-[15px] custom-inner-shadow rounded-b-none"
              />
              <div className="flex justify-between items-center gap-3">
                <FileInput file={file} setFile={setFile} />
                <Button
                  className="py-[18px] pr-0 pl-0 max-w-[181px]"
                  variant="primary"
                  onClick={handleSendReply}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Post"}
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>
            <div>
              <Typography variant="h4" color="mono-600">
                Post a comment
              </Typography>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col gap-3">
              <TextInput
                value={replyText}
                setValue={setReplyText}
                placeholder="Comment"
                className="primary-border p-[15px] custom-inner-shadow rounded-b-none"
              />
              <div className="flex justify-between items-center gap-3">
                <FileInput file={file} setFile={setFile} />
                <WithConnectedWallet
                  className="py-[18px] pr-0 pl-0 max-w-[181px]"
                  variant="primary"
                  onClick={handleSendReply}
                  disabled={isLoading}
                >
                  {connected && isLoading ? "Loading..." : "Post"}
                </WithConnectedWallet>
                {/* <Button
                  className="py-[18px] pr-0 pl-0 max-w-[181px]"
                  variant="primary"
                  onClick={handleSendReply}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Post"}
                </Button> */}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      {/* <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="gradient-bg p-4 border border-gray-300 rounded-lg w-1/3">
          <h2 className="text-sm mb-1 text-regular">
            message
            {replyThreadId && (
              <span>
                {" "}
                to <span className="text-regular font-bold">{replyThreadId ? `#${replyThreadId}` : ""}</span>
              </span>
            )}
          </h2>
          <div className="flex flex-row justify-between items-center">
            <button
              
              onClick={handleSendReply}
              className="text-blue py-2 rounded-lg text-sm sm:hover:underline"
            >
            </button>
            <button onClick={onClose} className="text-regular text-sm sm:hover:underline">
              Close
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
}
