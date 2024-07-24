/* eslint-disable @next/next/no-img-element */
import { useMedia } from "@/hooks/useMedia";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import { LiveContent } from "./LiveContent";
import { PresaleContent } from "./PresaleContent";

interface TokenCardProps {
  token: SolanaToken;
}
const socialLinks = {
  discord: "https://x.com/home?lang=en",
  telegram: "https://x.com/home?lang=en",
  twitter: "https://x.com/home?lang=en",
  website: "https://x.com/home?lang=en",
};

export function TokenCard({ token }: TokenCardProps) {
  const { name, address, image, symbol, description, status, socialLinks: test } = token;
  const router = useRouter();
  const media = useMedia();
  // We dont need checked for v1 of redesign
  // const [isChecked, setIsChecked] = useState(false);

  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  // };
  const renderFooter = socialLinks?.discord || socialLinks?.telegram || socialLinks?.twitter || socialLinks?.website;
  const handleCardClick = () => {
    const tab = media.isSmallDevice ? "info" : "chart";
    router.push({
      pathname: `/coin/[coinType]`,
      query: { coinType: address, tab: tab },
    });
  };
  return (
    <div onClick={() => handleCardClick()} className="cursor-pointer">
      <Card>
        <Card.Header>
          <div className="flex justify-between w-full">
            {/* <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="mr-2" /> */}
            <div className="flex text-left gap-2 min-w-40 mr-2">
              <div className="flex max-w-[50%] text-left">
                <Typography align="left" truncate color="green-100" variant="h4">
                  {name}
                </Typography>
              </div>
              <div className="flex w-2/4">
                <Typography variant="h4" truncate>
                  {symbol}
                </Typography>
              </div>
            </div>
            <Typography variant="h4" color="primary-100">
              [{status === "LIVE" ? "Live" : status === "PRESALE" ? "Presale" : "Unknown Status"}]
            </Typography>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex">
            <Link href={`/coin/${address}`}>
              <img
                className="w-[102px] h-[102px] object-cover object-center border border-mono-300"
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
          </div>
          {status === "PRESALE" ? <PresaleContent token={token} /> : <LiveContent token={token} />}
        </Card.Body>
        {/* LATER IN V2 */}
        {/* {renderFooter && socialLinks && (
        <Card.Footer>
          <div className="flex justify-evenly h-8 items-center w-full">
            {Object.keys(socialLinks).map((key, index, array) => (
              <div className="flex items-center gap-4 justify-between h-full" key={key}>
                <a
                  href={socialLinks[key as keyof typeof socialLinks]}
                  className="cursor-pointer underline h-full text-mono-500 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography variant="text-button" color="mono-500">
                    {key}
                  </Typography>
                </a>
                {array.length !== index + 1 && <Divider vertical />}
              </div>
            ))}
          </div>
        </Card.Footer>
      )} */}
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
