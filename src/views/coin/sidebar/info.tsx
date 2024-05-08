import { InfoProps } from "../coin.types";

export const Info = ({ metadata, progressData }: InfoProps) => {
  const { name, symbol, description, image, socialLinks, status } = metadata;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <img className="w-32 border border-regular h-auto rounded-lg" src={image} alt="token-image" />
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold text-regular">
            {name} (ticker: {symbol})
          </div>
          <div className="text-xs text-regular">{description}</div>
        </div>
      </div>
      {socialLinks && (
        <div className="flex flex-row gap-3">
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
        </div>
      )}
      <div className="flex w-full flex-col gap-1">
        <div className="text-xs flex flex-row gap-2 font-bold text-regular">
          Presale Progress
          <div className="text-xs font-bold text-regular">{progressData.progress}%</div>
        </div>
        <div className="w-full bg-white h-4 rounded-lg">
          <div
            className="bg-regular h-full rounded-lg"
            style={{
              width: `${progressData.progress}%`,
            }}
          ></div>
        </div>
        <div className="text-regular mt-2">
          {status === "PRESALE" && "Presale text"}
          {status === "LIVE" && "Live text"}
        </div>
      </div>
    </div>
  );
};
