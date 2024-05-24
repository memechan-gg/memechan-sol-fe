import { useBoundPoolProgress } from "@/hooks/solana/useBoundPoolProgress";
import { InfoProps } from "../coin.types";

export const Info = ({ metadata, poolAddress }: InfoProps) => {
  const { name, symbol, description, image, socialLinks, status } = metadata;
  const { progress, slerfIn, limit } = useBoundPoolProgress(poolAddress);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <img className="w-32 border border-regular h-auto rounded-lg" src={image} alt="token-image" />
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold text-regular">
            {name} (symbol: {symbol})
          </div>
          <div className="text-xs text-regular">{description}</div>
        </div>
      </div>
      {socialLinks && (
        <div className="flex flex-row gap-4">
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
          {status === "PRESALE" && (
            <div className="flex flex-col gap-2">
              <div>
                When the pool reaches {limit} <span className="!normal-case">SLERF</span>, liquidity from the bonding
                curve will flow exclusively to Raydium Liquidity Pool and be held securely for generating fees.
              </div>
              <div>
                Presently, there is {slerfIn} <span className="!normal-case">SLERF</span>.
              </div>
              <div>Happy trading :)</div>
            </div>
          )}
          {status === "LIVE" && "Pool is now live on the Raydium! You can now swap tokens! Happy trading :)"}
        </div>
      </div>
    </div>
  );
};
