import { useTheme } from "next-themes";
import Button from "./Button";

// Header Component
const Header = ({ title }: { title: string }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-[#800000]" : "bg-neutral-700";
  const textColor = "text-white";

  return (
    <div className={`flex justify-start items-center px-4 py-1.5 w-full text-sm font-bold ${textColor} ${bgColor}`}>
      {title}
    </div>
  );
};

// WarningSection Component
const WarningSection = ({ message }: { message: string }) => {
  const { theme } = useTheme();
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";

  return (
    <div
      className={`flex gap-4 items-start px-4 py-2 w-full text-sm text-yellow-500 border border-solid ${borderColor}`}
    >
      <div>⚠️</div>
      <div className="flex-1 leading-5">{message}</div>
    </div>
  );
};

// PaySection Component
const PaySection = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`flex justify-between text-sm ${textColor} mt-4`}>
      <div>{label}</div>
      <div className="flex items-center">
        <div className="mr-2">👛</div>
        <div>{value}</div>
      </div>
    </div>
  );
};

// AmountDisplay Component
const AmountDisplay = ({
  iconSrc,
  label,
  amount,
  valueInUSD,
}: {
  iconSrc: string;
  label: string;
  amount: string;
  valueInUSD: string;
}) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const secondaryTextColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div
      className={`mt-2 flex justify-between items-center px-4 py-2 rounded-sm border shadow-sm ${bgColor} ${borderColor}`}
    >
      <div className={`flex items-center font-bold ${textColor}`}>
        <img loading="lazy" src={iconSrc} alt={`${label} icon`} className="w-6 h-6 mr-2" />
        <span>{label}</span>
      </div>
      <div className={`text-right font-bold ${textColor}`}>{amount}</div>
      <div className={`text-sm ${secondaryTextColor}`}>{valueInUSD}</div>
    </div>
  );
};

// PercentageSelection Component
const PercentageSelection = ({ onSelect }: { onSelect: (percentage: number) => void }) => {
  const { theme } = useTheme();
  const textColor = theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const borderColor = theme === "light" ? "border-neutral-300" : "border-neutral-700";

  return (
    <div className={`flex mt-2 ${textColor}`}>
      {["10%", "20%", "25%", "50%", "75%", "100%"].map((percentage, index) => (
        <div
          key={index}
          className={`flex-1 text-center py-1 cursor-pointer border ${borderColor}`}
          onClick={() => onSelect(parseInt(percentage))}
        >
          {percentage}
        </div>
      ))}
    </div>
  );
};

// ImageSection Component
const ImageSection = ({ iconSrc, bannerSrc }: { iconSrc: string; bannerSrc: string }) => (
  <div className="flex flex-col pb-3 mt-4">
    <img loading="lazy" src={iconSrc} alt="Icon" className="self-center w-6" />
    <img loading="lazy" src={bannerSrc} alt="Banner" className="w-full mt-4" />
  </div>
);

// PointsMarket Component
const PointsMarket = () => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-white" : "bg-neutral-800";
  const borderColor = theme === "light" ? "border-[#800000]" : "border-neutral-700";
  const buttonColor = theme === "light" ? "bg-[#7F0002]" : "bg-pink-500";

  const handleBuyPointsClick = () => {
    console.log("Buy Points button clicked");
  };

  return (
    <div
      className={`flex flex-col pb-3 mt-3 max-w-full rounded-sm border border-solid shadow-sm ${bgColor} ${borderColor} w-[406px]`}
    >
      <Header title="Points Market" />
      <div className="flex flex-col mx-4 mt-4">
        <WarningSection message="More points you have – the bigger revenue share you get. You can trade points." />
        <PaySection label="Pay" value="1.00 SOL" />
        <AmountDisplay
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/01a0b0916fda2f17a08f95f1875875a70319b63150160b5be215021cef862278?placeholderIfAbsent=true&apiKey=eb6ecc156c044c5d8658095d2908b55b"
          label="SOL"
          amount="0.01"
          valueInUSD="$14.24"
        />
        <PercentageSelection onSelect={(percentage) => console.log(`Selected ${percentage}%`)} />
        <ImageSection
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/47e41819572a9880b2d40dca19317a55baf0eb2ad29056179ffe44da6f941a82?placeholderIfAbsent=true&apiKey=eb6ecc156c044c5d8658095d2908b55b"
          bannerSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/e1ec88d310064d7639a5e7990cd35c2028c74b844358dbdac682cd7102be6cac?placeholderIfAbsent=true&apiKey=eb6ecc156c044c5d8658095d2908b55b"
        />
        <PaySection label="Receive" value="28,420 Points" />
        <AmountDisplay
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/bb0d8e360bbf3425ce978a991e625bdb23f481f8f11d2482d58389f19d9e7b74?placeholderIfAbsent=true&apiKey=eb6ecc156c044c5d8658095d2908b55b"
          label="Points"
          amount="10,000"
          valueInUSD="$14.24"
        />
        <Button onClick={handleBuyPointsClick} className={`mt-4 py-3 w-full text-white ${buttonColor} rounded-sm`}>
          Buy Points
        </Button>
      </div>
    </div>
  );
};

export default PointsMarket;
