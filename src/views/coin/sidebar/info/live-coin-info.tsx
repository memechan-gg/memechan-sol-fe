import { MEMECHAN_QUOTE_MINT } from "@avernikoz/memechan-sol-sdk";
import { LiveCoinInfoProps } from "../../coin.types";

export const LiveCoinInfo = ({ metadata, livePoolAddress }: LiveCoinInfoProps) => {
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
      {socialLinks && (
        <div className="grid grid-cols-2 gap-4 my-4">
          {socialLinks.discord && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Discord</div>
              <div className="text-xs font-normal text-regular truncate hover:underline">
                <a href={socialLinks.discord} target="_blank">
                  {socialLinks.discord}
                </a>
              </div>
            </div>
          )}
          {socialLinks.twitter && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Twitter</div>
              <div className="text-xs font-normal text-regular truncate hover:underline">
                <a href={socialLinks.twitter} target="_blank">
                  {socialLinks.twitter}
                </a>
              </div>
            </div>
          )}
          {socialLinks.telegram && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Telegram</div>
              <div className="text-xs font-normal text-regular truncate hover:underline">
                <a href={socialLinks.telegram} target="_blank">
                  {socialLinks.telegram}
                </a>
              </div>
            </div>
          )}
          {socialLinks.website && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Website</div>
              <div className="text-xs font-normal text-regular truncate hover:underline">
                <a href={socialLinks.website} target="_blank">
                  {socialLinks.website}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-1 text-regular font-bold my-2">
        <span>Trade on:</span>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-normal text-regular truncate hover:underline">
            <a
              href={`https://raydium.io/swap/?inputMint=${MEMECHAN_QUOTE_MINT}&outputMint=${metadata.address}`}
              target="_blank"
            >
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
