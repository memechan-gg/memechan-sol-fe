import { PresaleCoinInfoProps } from "../../coin.types";
import { SocialLinks } from "./social-links/social-links";
import { getBoundPoolProgress } from "./utils";

export const PresaleCoinInfo = ({ metadata, boundPool, tokenInfo }: PresaleCoinInfoProps) => {
  const { name, symbol, description, image, socialLinks } = metadata;
  const { progress, slerfIn, limit } = boundPool
    ? getBoundPoolProgress(boundPool)
    : {
        progress: "0",
        slerfIn: "0",
        limit: "0",
      };

  const poolIsMigratingToLive = boundPool?.locked || boundPool === null;

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
                flow exclusively to Raydium Liquidity Pool and be held securely for generating fees.
              </div>
              <div>
                Presently, there is {Number(slerfIn).toLocaleString()}{" "}
                <span className="!normal-case">{tokenInfo.displayName}</span>.
              </div>
              <div>Happy trading :)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
