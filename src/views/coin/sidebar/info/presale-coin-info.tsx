import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { timeSince } from "@/utils/timeSpents";
import Link from "next/link";
import toast from "react-hot-toast";
import { PresaleCoinInfoProps } from "../../coin.types";

export const PresaleCoinInfo = ({ metadata }: PresaleCoinInfoProps) => {
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

{
  /* <div className="flex flex-row gap-2">
        <img
          className="w-32 border border-regular h-32 rounded-lg object-cover object-center float-left"
          src={image}
          alt="token-image"
        />
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold text-regular">
            {name} (symbol: {symbol})
          </div>
          <div className="text-xs text-regular">{description}</div>
        </div>
      </div>
      <SocialLinks socialLinks={socialLinks} />
      {!poolIsMigratingToLive && (
        <div className="flex w-full flex-col gap-1">
          <div className="text-xs flex flex-row gap-2 font-bold text-regular">
            Presale Progress
            <div className="text-xs font-bold text-regular">{progress}%</div>
          </div>
          <div className="w-full bg-white h-4 rounded-lg">
            <div
              className="bg-regular h-full rounded-lg"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
          <div className="text-regular mt-2">
            <div className="flex flex-col gap-2">
              <div>
                When the pool reaches {Number(limit).toLocaleString()}{" "}
                <span className="!normal-case">{tokenInfo.displayName}</span>, liquidity from the bonding curve will
                flow exclusively to {isV2 ? "Meteora" : "Raydium"} Liquidity Pool and be held securely for generating
                fees.
              </div>
              <div>
                Presently, there is {Number(slerfIn).toLocaleString()}{" "}
                <span className="!normal-case">{tokenInfo.displayName}</span>.
              </div>
              <div>Happy trading :)</div>
            </div>
          </div>
        </div>
      )} */
}
