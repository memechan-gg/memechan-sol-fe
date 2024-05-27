import { useEffect, useState } from "react";

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
    <div className={`h-96 w-full flex items-center justify-center ${!isLoaded ? "bg-regular" : ""}`}>
      {!hasError ? (
        <iframe
          allowFullScreen
          style={{ borderWidth: 0 }}
          src={`https://${chartsApiUrl}/?address=${address}&symbol=${symbol}`}
          width="100%"
          height="100%"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <div>Error loading chart</div>
      )}
      {!isLoaded && !hasError && <div>Loading...</div>}
    </div>
  );
};
