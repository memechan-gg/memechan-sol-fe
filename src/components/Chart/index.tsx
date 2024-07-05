import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { ApiClient } from "./api-client";
import { createWidgetOptions } from "./chart";
import { ChartFeed } from "./chart-feed";
import { widget as ChartWidget, ResolutionString } from "./libs/charting_library";
import { Settings } from "./settings";

const settings: Settings = {
  historicalPricesEndpoint: "https://api.memechan.gg/chart",
  currentPriceEndpoint: "https://api.memechan.gg/price",
  address: "",
  realtimeReloadInterval: 3000,
  symbol: "USD",
  contractName: "USD",
  priceDigitsAfterComma: 10,
};

export const Chart = (settingsProps: Partial<Settings>) => {
  const mergedSettings = {
    ...settings,
    ...settingsProps,
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("initialising trading view with app settings", mergedSettings);
    setIsLoaded(false);

    const client = new ApiClient(mergedSettings);
    const chartFeed = new ChartFeed(client, mergedSettings);
    const widgetOptions = createWidgetOptions(mergedSettings.symbol, "5" as ResolutionString, chartFeed, "tv-wrapper");

    const chartWidget = new ChartWidget(widgetOptions);

    const handleLoad = () => {
      setIsLoaded(true);
    };

    chartWidget.subscribe("chart_loaded", handleLoad);

    return () => {
      chartWidget.unsubscribe("chart_loaded", handleLoad);
      chartWidget.remove();
    };
  }, [...Object.values(settingsProps)]);

  return (
    <div id="tv-wrapper" style={{ height: "38rem" }} className={`w-full flex items-center justify-center`}>
      {!isLoaded && (
        <div className="w-full h-full">
          <Skeleton width="100%" height="100%" className="skeleton-custom" />
        </div>
      )}
    </div>
  );
};
