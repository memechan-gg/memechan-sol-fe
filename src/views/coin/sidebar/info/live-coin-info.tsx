import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { timeSince } from "@/utils/timeSpents";
import Link from "next/link";
import toast from "react-hot-toast";
import { LiveCoinInfoProps } from "../../coin.types";

export const LiveCoinInfo = ({ metadata }: LiveCoinInfoProps) => {
  const { creator, address, creationTime } = metadata;
  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Card>
      <Card.Header>
        <Typography variant="h4" color="mono-600">
          Info
        </Typography>
      </Card.Header>
      <Card.Body additionalStyles="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <Typography variant="body" color="mono-500">
            Created
          </Typography>
          <Typography variant="body" color="mono-600">
            {timeSince(creationTime)} ago
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="body" color="mono-500">
            Creator
          </Typography>
          <div className="flex gap-x-2 items-baseline">
            <Link href={`/profile/${creator}`}>
              <Typography variant="body" color="mono-600" underline>
                {creator.slice(0, 4)}...{creator.slice(-4)}
              </Typography>
            </Link>
            <Typography variant="body" color="primary-100" underline onClick={() => handleCopy(creator)}>
              Copy
            </Typography>
          </div>
        </div>
        <div className="flex justify-between">
          <Typography variant="body" color="mono-500">
            CA
          </Typography>
          <div className="flex gap-x-2 items-baseline">
            <a href={`https://solscan.io/token/${address}`} target="_blank">
              <Typography variant="body" color="mono-600" underline>
                {address.slice(0, 4)}...{address.slice(-4)}
              </Typography>
            </a>
            <Typography variant="body" color="primary-100" underline onClick={() => handleCopy(address)}>
              Copy
            </Typography>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// <div className="flex flex-col gap-2">
//       <div className="flex flex-row gap-2">
//         <img
//           className="w-32 border border-regular h-32 rounded-lg object-cover object-center"
//           src={image}
//           alt="token-image"
//         />
//         <div className="flex flex-col gap-1 overflow-hidden">
//           <div className="flex-col text-xs font-bold text-regular">
//             <span className="flex">{name}</span>
//             <span className="flex">(symbol: {symbol})</span>
//           </div>
//           <div className="text-xs text-regular">{description}</div>
//         </div>
//       </div>
//       <SocialLinks socialLinks={socialLinks} />
//       <div className="flex flex-col gap-1 text-regular font-bold my-2">
//         <span>Trade on:</span>
//         <div className="flex flex-col gap-1">
//           <div className="text-xs font-normal text-regular truncate sm:hover:underline">
//             {/* TEST:2 */}
//             <a href={`https://app.meteora.ag/pools/${livePoolAddress}`} target="_blank">
//               Meteora.ag
//             </a>
//           </div>
//         </div>
//         <div className="flex flex-col gap-1">
//           <div className="text-xs font-normal text-regular truncate sm:hover:underline">
//             <a href={`https://birdeye.so/token/${metadata.address}/${livePoolAddress}?chain=solana`} target="_blank">
//               Birdeye.so
//             </a>
//           </div>
//         </div>
//         <div className="flex flex-col gap-1">
//           <div className="text-xs font-normal text-regular truncate sm:hover:underline">
//             <a href={`https://dexscreener.com/solana/${livePoolAddress}`} target="_blank">
//               Dexscreener.com
//             </a>
//           </div>
//         </div>
//       </div>
//       <div className="flex w-full flex-col gap-1">
//         <div className="text-regular mt-2">
//           Pool is now live on the {isV2 ? "Meteora" : "Raydium"}! You can now swap tokens! Happy trading :)
//         </div>
//       </div>
//     </div>
