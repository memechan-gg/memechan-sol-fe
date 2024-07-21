/* eslint-disable @next/next/no-img-element */
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import Link from "next/link";
import { LiveContent } from "./LiveContent";
import { PresaleContent } from "./PresaleContent";

interface TokenCardProps {
  token: SolanaToken;
}

export function TokenCard({ token }: TokenCardProps) {
  const { name, address, image, symbol, description, status, socialLinks } = token;
  // We dont need checked for v1 of redesign
  // const [isChecked, setIsChecked] = useState(false);

  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  // };

  return (
    <div className="card-shadow card-bg border border-mono-400 rounded-sm min-h-[218px] max-h-[218px]">
      <div className=" h-8 flex justify-between items-center bg-mono-400 p-4">
        <div className="flex items-center truncate">
          {/* <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className="mr-2" /> */}
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
      </div>

      <div className="flex pt-4 px-4">
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
      </div>

      {status === "PRESALE" ? <PresaleContent token={token} /> : <LiveContent token={token} />}
      {/* TODO:EDO */}
      {/* https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=231-12581&t=tSyCMMETT9vEPKHy-4 */}
      {/* Ask denis what to do if no social links */}
      <div>
        {socialLinks &&
          Object.keys(socialLinks).map((key) => {
            return socialLinks[key as keyof typeof socialLinks];
          })}
      </div>
    </div>
  );
}
