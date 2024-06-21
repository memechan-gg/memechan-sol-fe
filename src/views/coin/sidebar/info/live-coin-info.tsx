import { LiveCoinInfoProps } from "../../coin.types";
import { SocialLinks } from "./social-links/social-links";

export const LiveCoinInfo = ({ metadata, livePoolAddress, quoteMint }: LiveCoinInfoProps) => {
  const { name, symbol, description, image, socialLinks } = metadata;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <img
          className="w-32 border border-regular h-32 rounded-lg object-cover object-center"
          src={image}
          alt="token-image"
        />
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="flex-col text-xs font-bold text-regular">
            <span className="flex">{name}</span>
            <span className="flex">(symbol: {symbol})</span>
          </div>
          <div className="text-xs text-regular">{description}</div>
        </div>
      </div>
      <SocialLinks socialLinks={socialLinks} />
      <div className="flex flex-col gap-1 text-regular font-bold my-2">
        <span>Trade on:</span>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-normal text-regular truncate hover:underline">
            {/* TEST:2 */}
            <a href={`https://raydium.io/swap/?inputMint=${quoteMint}&outputMint=${metadata.address}`} target="_blank">
              Raydium.io
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-normal text-regular truncate hover:underline">
            <a href={`https://birdeye.so/token/${metadata.address}/${livePoolAddress}?chain=solana`} target="_blank">
              Birdeye.so
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-normal text-regular truncate hover:underline">
            <a href={`https://dexscreener.com/solana/${livePoolAddress}`} target="_blank">
              Dexscreener.com
            </a>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="text-regular mt-2">
          Pool is now live on the Raydium! You can now swap tokens! Happy trading :)
        </div>
      </div>
    </div>
  );
};
