import { SocialApiInstance } from "@/common/solana";
import FileInput from "@/memechan-ui/Atoms/Input/FileInput";
import { handleAuthentication, uploadImageToIPFS } from "@/views/create-coin/create-coin.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CoinThreadParsedMessage } from "../../coin.types";

export function PostReplyDialog({
  onClose,
  updateThreads,
  coinType,
  replyThreadId,
}: {
  onClose: () => void;
  updateThreads: () => void;
  coinType: string;
  replyThreadId?: string;
}) {
  const [replyText, setReplyText] = useState("");
  const { publicKey, signMessage } = useWallet();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleReplyChange = (event: any) => {
    setReplyText(event.target.value);
  };

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

      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to post a reply. Please, try again");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, coinType, signMessage, onClose, replyText, replyThreadId, updateThreads, file]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50"></div>

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
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
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={handleReplyChange}
            className="w-full text-base h-24 border border-regular rounded-lg p-2 mb-3 focus:border-2 focus:border-regular focus:outline-none"
          ></textarea>
          <FileInput file={file} setFile={setFile} />
          <div className="flex flex-row justify-between items-center">
            <button
              disabled={isLoading}
              onClick={handleSendReply}
              className="text-blue py-2 rounded-lg text-sm hover:underline"
            >
              {isLoading ? "Loading..." : "Send a reply"}
            </button>
            <button onClick={onClose} className="text-regular text-sm hover:underline">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
