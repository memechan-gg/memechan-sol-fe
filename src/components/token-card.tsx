import { parseChainValue } from "@/utils/parseChainValue";
import Link from "next/link";
import { useState } from "react";

export function TokenCard({ token:  }) {
  console.log(token);
  const { name, address, image, marketcap, symbol, description, status, holdersCount } = token;
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="card-shadow card-bg border border-monochrome-400 rounded-sm min-h-[218px] max-h-[218px]">
      <div className=" h-8 flex justify-between items-center bg-monochrome-400 p-4">
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
              <span className=" text-monochrome-500">{">> "}</span>
              {description}
            </div>
          </div>
        </div>
      </div>
      {status === "LIVE" ? (
        <div className=" pt-2 p-4  flex flex-row  text-sm text-white mt-2">
          <div className=" mr-4 flex gap-1 flex-col items-start text-xs-custom text-monochrome-500">
            <span>Market Cap</span>
            <span className="text-white font-bold">${parseChainValue(marketcap, 0, 2)}</span>
          </div>
          <div className="flex gap-1 flex-col items-start text-xs-custom text-monochrome-500">
            <span>Holders</span>
            <span className="text-white font-bold">{holdersCount}</span>
          </div>
          {/* <div className="flex gap-1 flex-col items-start text-xs-custom text-gradient-gold">
            <span>Gen. Fees</span>
            <span className="font-bold">$123</span>
          </div>
          <div className="flex gap-1 flex-col items-start text-xs-custom text-monochrome-500">
            <span>24h Volume</span>
            <span className="text-white font-bold">$456</span>
          </div> */}
        </div>
      ) : (
        //TODO IMPLEMENT LOGIC FOR PRESALE CARD DATA
        <div className=" pt-2 p-4  flex flex-row text-sm text-white mt-2">
          <div className=" mr-4 flex gap-1 flex-col items-start text-xs-custom text-monochrome-500">
            <span>Market Cap</span>
            <span className="text-white font-bold">${parseChainValue(marketcap, 0, 2)}</span>
          </div>
          <div className="flex gap-1 flex-col items-start text-xs-custom text-monochrome-500">
            <span>Holders</span>
            <span className="text-white font-bold">{holdersCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}
