import { LiveCoinInfoProps } from "../../coin.types";

export const LiveCoinInfo = ({ metadata }: LiveCoinInfoProps) => {
  const { name, symbol, description, image, socialLinks } = metadata;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <img
          className="w-32 border border-regular h-32 rounded-lg object-cover object-center float-left"
          src={image}
          alt="token-image"
        />
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold text-regular">
            {name} (symbol: {symbol})
          </div>
          <div className="text-xs text-regular">
            {description.slice(0, 300) + (description.length > 300 ? "..." : "")}
          </div>
        </div>
      </div>
      {socialLinks && (
        <div className="flex flex-wrap flex-row gap-4 gap-x-6 my-3">
          {socialLinks.discord && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Discord</div>
              <div className="text-xs font-normal text-regular">{socialLinks.discord}</div>
            </div>
          )}
          {socialLinks.twitter && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Twitter</div>
              <div className="text-xs font-normal text-regular">{socialLinks.twitter}</div>
            </div>
          )}
          {socialLinks.telegram && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Telegram</div>
              <div className="text-xs font-normal text-regular">{socialLinks.telegram}</div>
            </div>
          )}
          {socialLinks.website && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-regular">Website</div>
              <div className="text-xs font-normal text-regular">{socialLinks.website}</div>
            </div>
          )}
        </div>
      )}
      <div className="flex w-full flex-col gap-1">
        <div className="text-regular mt-2">
          Pool is now live on the Raydium! You can now swap tokens! Happy trading :)
        </div>
      </div>
    </div>
  );
};
