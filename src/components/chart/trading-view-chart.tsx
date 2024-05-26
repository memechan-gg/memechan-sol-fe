import { useEffect, useRef } from "react";
import { ChartingLibraryWidgetOptions, ResolutionString, widget } from "../../common/charting_library";
import MockDataFeed from "./mock-data-feed"; // Import MockDataFeed

const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const containerId = "chart_container";
      chartContainerRef.current.id = containerId;

      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: "AAPL",
        datafeed: new MockDataFeed(), // Currently uses mock data - change to actual data for prod
        interval: "D" as ResolutionString,
        container_id: containerId,
        library_path: "src/charting_library/",
        locale: "en",
        disabled_features: [
          "use_localstorage_for_settings",
          "show_object_tree",
          "save_chart_properties_to_local_storage",
          "header_saveload",
          "open_account_manager",
          "header_layouttoggle",
          "order_panel",
          "trading_account_manager",
        ],
        enabled_features: ["header_quick_search"],
        charts_storage_url: "https://saveload.tradingview.com",
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        theme: "Dark", // Enable dark theme
        overrides: {
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor": "#AAA",
        },
        studies_overrides: {
          "volume.volume.color.0": "#00FFFF",
          "volume.volume.color.1": "#0000FF",
          "volume.volume.transparency": 70,
          "volume.volume ma.color": "#FF0000",
          "volume.volume ma.transparency": 30,
          "volume.volume ma.linewidth": 5,
          "volume.show ma": true,
        },
      };

      console.log("Initializing TradingView widget: ", widgetOptions);

      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        console.log("Chart has been initialized"); //Logging
      });
    }
  }, []);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "500px" }} />;
};

export default Chart;
