import { useStakingPool } from "@/hooks/staking/useStakingPool";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { timeSince, timeSinceExpanded } from "@/utils/timeSpents";
import BigNumber from "bignumber.js";
import { format, parse, roundToNearestMinutes } from "date-fns";
import { useTheme } from "next-themes";
import Link from "next/link";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { LiveCoinInfoProps } from "../../coin.types";

export const LiveCoinInfo = ({ metadata, stakingPoolFromApi, livePool }: LiveCoinInfoProps) => {
  const { data: stakingPool } = useStakingPool(stakingPoolFromApi?.address);
  const { creator, address, creationTime, symbol } = metadata;
  const { theme } = useTheme();
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
  let startVestingTime: string | undefined = undefined;
  let endVestingTime: string | undefined = undefined;
  let startVestingTimeInMs: number = 0;
  let endVestingTimeInMs: number = 0;

  if (stakingPool) {
    startVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.cliffTs.toString()).multipliedBy(1000).toNumber();
    endVestingTimeInMs = new BigNumber(stakingPool.vestingConfig.endTs.toString()).multipliedBy(1000).toNumber();
    startVestingTime = new Date(startVestingTimeInMs).toLocaleString();
    endVestingTime = new Date(endVestingTimeInMs).toLocaleString();
  }

  function formatDates(dateStr1: string, dateStr2: string) {
    function parseRoundAndFormat(dateStr: string) {
      const date = parse(dateStr, "dd/MM/yyyy, HH:mm:ss", new Date());
      const roundedDate = roundToNearestMinutes(date, { nearestTo: 1 });

      try {
        return format(roundedDate, "dd MMM, HH:mm");
      } catch (e) {
        return undefined;
      }
    }

    const formattedDate1 = parseRoundAndFormat(dateStr1);
    const formattedDate2 = parseRoundAndFormat(dateStr2);
    if (!formattedDate1 || !formattedDate2) return undefined;

    return `${formattedDate1} - ${formattedDate2}`;
  }

  return (
    <Card>
      <Card.Header>
        <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"}>
          Info
        </Typography>
      </Card.Header>
      <Card.Body additionalStyles="flex flex-col gap-y-2 mt-1">
        <div className="flex justify-between items-center">
          <Typography variant="body" color="mono-500">
            Created
          </Typography>
          <Typography variant="body" color="mono-600">
            {timeSince(creationTime)} ago
          </Typography>
        </div>
        <div className="flex justify-between items-center mt-1">
          <Typography variant="body" color="mono-500">
            Bonding curve completed
          </Typography>
          <Typography variant="body" color="mono-600">
            within {timeSinceExpanded(creationTime)}
          </Typography>
        </div>
        {startVestingTime && endVestingTime && formatDates(startVestingTime, endVestingTime) && (
          <div className="flex justify-between items-center text-end mt-1">
            <Typography variant="body" color="mono-500">
              Vesting Period
            </Typography>
            <div>
              <Typography variant="body" color="mono-600">
                {startVestingTime && endVestingTime && formatDates(startVestingTime, endVestingTime) ? (
                  <div>{formatDates(startVestingTime, endVestingTime)}</div>
                ) : (
                  <Skeleton width={35} baseColor="#ac8383" highlightColor="#979797" />
                )}
              </Typography>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
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
        <div className="flex justify-between items-center">
          <Typography variant="body" color="mono-500">
            Pool
          </Typography>
          <div className="flex gap-x-2 items-baseline">
            <a href={`https://app.meteora.ag/pools/${livePool.id}`} target="_blank">
              <Typography variant="body" color="mono-600" underline>
                {livePool.id.slice(0, 4)}...{livePool.id.slice(-4)}
              </Typography>
            </a>
            <Typography variant="body" color="primary-100" underline onClick={() => handleCopy(livePool.id)}>
              Copy
            </Typography>
          </div>
        </div>
        <div className="flex justify-between items-center">
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
