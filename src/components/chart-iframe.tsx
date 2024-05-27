import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ChartIframeProps {
  address: string;
  symbol: string;
  chartsApiUrl: string;
}

export const ChartIframe = ({ address, symbol, chartsApiUrl }: ChartIframeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [address, symbol, chartsApiUrl]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div style={{ height: "38rem" }} className={`w-full flex items-center justify-center`}>
      {!hasError ? (
        <>
          <iframe
            allowFullScreen
            style={{ borderWidth: 0, display: isLoaded ? "block" : "none" }}
            src={`https://${chartsApiUrl}/?address=${address}&symbol=${symbol}`}
            width="100%"
            height="100%"
            onLoad={handleLoad}
            onError={handleError}
          />
          {!isLoaded && (
            <div className="w-full h-full">
              <Skeleton width="100%" height="100%" className="skeleton-custom" />
            </div>
          )}
        </>
      ) : (
        <div>Error loading chart</div>
      )}
    </div>
  );
};
