import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { ApiClient } from "./api-client";
import { createWidgetOptions } from "./chart";
import { ChartFeed } from "./chart-feed";
import { widget as ChartWidget, ResolutionString } from "./libs/charting_library";
import { EnvSettings, PropsSettings } from "./settings";

export const settings: EnvSettings = {
  historicalPricesEndpoint: process.env.NEXT_PUBLIC_CHART_HISTORICAL_PRICES_ENDPOINT || "",
  currentPriceEndpoint: process.env.NEXT_PUBLIC_CHART_CURRENT_PRICE_ENDPOINT || "",
  realtimeReloadInterval: Number(process.env.NEXT_PUBLIC_CHART_REALTIME_RELOAD_INTERVAL) || 3000,
  priceDigitsAfterComma: Number(process.env.NEXT_PUBLIC_CHART_PRICE_DIGITS_AFTER_COMMA) || 10,
  symbol: process.env.NEXT_PUBLIC_CHART_SYMBOL || "USD",
};

export const Chart = (settingsProps: PropsSettings) => {
  const mergedSettings = {
    ...settings,
    ...settingsProps,
    contractName: `${settingsProps.tokenName}/${settingsProps.symbol || settings.symbol}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(settingsProps)]);

  return (
    <div id="tv-wrapper" className={`h-[300px] md:h-[500px] w-full flex items-center justify-center`}>
      {!isLoaded && (
        <div className="w-full h-full">
          <Skeleton width="100%" height="100%" className="skeleton-custom" />
        </div>
      )}
    </div>
  );
};
