import { useMedia } from "@/hooks/useMedia";
import { useEffect, useState } from "react";
import StakeForm from "../../components/Staking/StakeForm";
import StakeInfo from "../../components/Staking/StakeInfo";

export function Staking() {
  const mediaQuery = useMedia();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a data fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center w-full min-w-80 px-3 pt-3 xl:px-0">
        <div className="w-full mt-3">
          <img
            src={mediaQuery.isSmallDevice ? "/short-banner-staking.png" : "/long-banner-staking.png"}
            alt="Banner"
            className="w-full"
          />
        </div>
        <div className="flex flex-col self-center mt-6 w-full max-w-[1241px] max-md:max-w-full">
          <div className="mt-6 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              {/* Left Section: StakeInfo */}
              <div className="flex flex-col w-[67%] max-md:w-full">
                <StakeInfo />
              </div>
              {/* Right Section: StakeForm and PointsMarket */}
              <div className="flex flex-col w-[33%] max-md:w-full">
                <StakeForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
