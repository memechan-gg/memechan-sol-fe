/* eslint-disable @next/next/no-img-element */
import { useReferrerContext } from "@/context/ReferrerContext";
import { useMedia } from "@/hooks/useMedia";
import Checkbox from "@/memechan-ui/Atoms/CheckBox/CheckBox";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState } from "react";
import { ImageComponent } from "../image-component";
import { LiveContent } from "./LiveContent";
import { PresaleContent } from "./PresaleContent";

interface TokenCardProps {
  token: SolanaToken;
  onClick?: () => void;
  progressInfo?: {
    progress?: number;
    totalQuoteAmount?: string;
    currentQuoteAmount?: string;
    participactsAmount?: string;
    timeFromCreation?: string;
  };
  showLinks?: boolean;
  showCheckmark?: boolean;
  showOnClick?: boolean;
  disableContent?: boolean;
}

export function TokenCard({
  token,
  onClick,
  progressInfo,
  showLinks = false,
  showCheckmark = false,
  showOnClick = false,
  disableContent,
}: TokenCardProps) {
  const referrer = useReferrerContext();
  const { theme } = useTheme();
  const { name, address, image, symbol, description, status, socialLinks } = token;
  const router = useRouter();
  const media = useMedia();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const renderFooter = socialLinks?.discord || socialLinks?.telegram || socialLinks?.twitter || socialLinks?.website;
  const handleCardClick = () => {
    const tab = media.isSmallDevice ? "Info" : "Chart";
    if (referrer.referrer) {
      router.push(
        {
          pathname: `/coin/[coinType]`,
          query: { coinType: address, tab: tab, referrer: referrer.referrer },
        },
        undefined,
        { shallow: true },
      );
    } else {
      router.push(
        {
          pathname: `/coin/[coinType]`,
          query: { coinType: address, tab: tab },
        },
        undefined,
        { shallow: true },
      );
    }
    if (onClick) onClick();
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div
      onClick={showOnClick ? () => handleCardClick() : undefined}
      className={showOnClick ? "cursor-pointer h-full min-h-[212px]" : "h-full min-h-[212px]"}
    >
      <Card
        additionalStyles={`card-shadow bg-mono-200 h-full ${showOnClick ? "sm:hover:border-primary-100" : "sm:hover:none"}`}
      >
        <Card.Header>
          <div className="flex justify-between w-full">
            <div className="flex text-left gap-2 min-w-40 mr-2 items-center justify-center">
              {showCheckmark && (
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange();
                  }}
                />
              )}
              <div className="flex max-w-[50%] text-left">
                <Typography align="left" truncate color="green-100" variant="h4">
                  {name}
                </Typography>
              </div>
              <div className="flex w-2/4">
                <Typography variant="body" color={theme === "light" ? "mono-200" : "mono-600"} truncate>
                  {symbol}
                </Typography>
              </div>
            </div>
            <Typography variant="h4" color={theme === "light" ? "mono-200" : "primary-100"}>
              [{status === "LIVE" ? "Live" : status === "PRESALE" ? "Presale" : "Unknown Status"}]
            </Typography>
          </div>
        </Card.Header>
        <Card.Body additionalStyles="p-[0px]">
          <div className="p-4">
            <div className="flex">
              <ImageComponent
                className="w-[102px] h-[102px] object-cover object-center border border-mono-300"
                imageUrl={image}
                altText={`${name} Image`}
              />
              <div className="ml-4 flex-1 min-w-0">
                <div className="text-black text-sm">
                  <div className={showOnClick ? "line-clamp" : "break-words"}>
                    <div className="text-mono-600">
                      <span className=" text-mono-500">{">> "}</span>
                      {description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {disableContent ? null : status === "PRESALE" ? (
              <PresaleContent token={token} progressInfo={progressInfo} />
            ) : (
              <LiveContent token={token} />
            )}
          </div>
          {showLinks && renderFooter && socialLinks && (
            <div
              className={`flex custom-inner-shadow h-9 items-center rounded-tl-[2px] rounded-tr-[2px] border border-mono-400 justify-between w-full`}
            >
              {Object.keys(socialLinks).map(
                (key, index, array) =>
                  socialLinks[key as keyof typeof socialLinks] !== "" && (
                    <div className="flex w-full sm:hover:bg-mono-300 active:bg-mono-400 h-full" key={key}>
                      <a
                        href={socialLinks[key as keyof typeof socialLinks] ?? undefined}
                        className="w-full h-full flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography variant="text-button" color="mono-500" underline>
                          {capitalizeFirstLetter(key)}
                        </Typography>
                      </a>
                      {array.length !== index + 1 && <Divider vertical />}
                    </div>
                  ),
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

// Header
{
  /* <div className=" h-8 flex justify-between items-center bg-mono-400 p-4">
  <div className="flex items-center truncate">
    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="mr-2" />
    <h2 className="text-sm dont-bold mr-2 font-bold text-green truncate">{name}</h2>
    <Link href={`/coin/${address}`}>
      <div className="text-white text-sm font-normalflex flex-col">
        <div>{symbol}</div>
      </div>
    </Link>
  </div>
  <span className="text-sm font-bold text-primary-100">
    [{status === "LIVE" ? "Live" : status === "PRESALE" ? "Presale" : "Unknown Status"}]
  </span>{" "}
</div> */
}

// Body
{
  /* <div className="flex pt-4 px-4">
  <Link href={`/coin/${address}`}>
    <img
      className="w-[102px] h-[102px] object-cover object-center border border-gray-300 rounded"
      src={image}
      alt={`${name} Image`}
    />
  </Link>
  <div className="ml-4 flex-1 min-w-0">
    <div className="text-white text-sm">
      <div className="line-clamp">
        <span className=" text-mono-500">{">> "}</span>
        {description}
      </div>
    </div>
  </div>
</div> */
}
{
  /* {status === "PRESALE" ? <PresaleContent token={token} /> : <LiveContent token={token} />} */
}

// Footer
{
  /* TODO:EDO */
}
{
  /* https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=231-12581&t=tSyCMMETT9vEPKHy-4 */
}
{
  /* Ask denis what to do if no social links */
}
{
  /* <div>
  {socialLinks &&
    Object.keys(socialLinks).map((key) => {
      return socialLinks[key as keyof typeof socialLinks];
    })}
</div> */
}
