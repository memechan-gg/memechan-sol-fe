import { ApiClient } from "./api-client";
import { toSymbolInfo } from "./chart";
import {
  ErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolveCallback,
  ServerTimeCallback,
  SubscribeBarsCallback,
} from "./libs/charting_library";
import { Bar, DatafeedConfiguration, ResolutionString } from "./libs/datafeed-api";
import { SUPPORTED_CHART_RESOLUTIONS, resolutionToMs } from "./resolutions";
import { Settings } from "./settings";

interface LastBarData {
  readonly bar: Bar;
  readonly resolution: ResolutionString;
}

interface RealtimeUpdater {
  readonly timer: any;
  readonly listener: string;
}

/**
 * @link https://www.tradingview.com/charting-library-docs/latest/connecting_data/Datafeed-API
 */
export class ChartFeed implements IBasicDataFeed {
  private lastBar: LastBarData | null = null;

  private priceLoader: RealtimeUpdater | null = null;
  private currentResolution: ResolutionString | null = null;

  constructor(
    private readonly apiClient: ApiClient,
    private readonly settings: Settings,
  ) {}

  resolveSymbol(symbolName: string, onResolve: ResolveCallback): void {
    // we have a single symbol per each iframe invocation, so we
    // can store contract name in settings for simplicity
    setTimeout(() =>
      onResolve(toSymbolInfo(symbolName, this.settings.contractName, this.settings.priceDigitsAfterComma)),
    );
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback,
  ): void {
    if (this.lastBar != null && this.lastBar.resolution != resolution) {
      this.lastBar = null;
    }
    this.currentResolution = resolution;
    console.log("Current resolution", resolution);

    this.apiClient
      .loadBars(symbolInfo.name, periodParams.from, periodParams.to, resolution)
      .then((res) => {
        const chartBars: Bar[] = (res?.bars || []).map((bar: any) => {
          const timeAligned = bar.time - (bar.time % resolutionToMs(resolution));
          return {
            close: bar.close,
            high: bar.high,
            low: bar.low,
            open: bar.open,
            time: timeAligned,
            volume: bar.volume,
          } as Bar;
        });

        if (chartBars.length > 0) {
          const last = chartBars[chartBars.length - 1];
          if (this.lastBar == null) {
            this.lastBar = {
              bar: last,
              resolution: resolution,
            };
          } else if (this.lastBar.bar.time < last.time) {
            this.lastBar = {
              bar: last,
              resolution: resolution,
            };
          }
          console.log(`Set last bar time to ${new Date(this.lastBar.bar.time)}`, this.lastBar);
        }

        onResult(chartBars, { noData: chartBars.length <= 0 });
      })
      .catch((e) => {
        onError(e.message);
      });
  }

  getVolumeProfileResolutionForPeriod?(): ResolutionString {
    console.log("getVolumeProfileResolutionForPeriod");
    throw new Error("Method not implemented.");
  }

  config: DatafeedConfiguration = {
    supported_resolutions: SUPPORTED_CHART_RESOLUTIONS,
    supports_time: true,
  };

  getMarks?(): void {
    console.log("getMarks");
    throw new Error("Method not implemented.");
  }

  getTimescaleMarks?(): void {
    console.log("getTimescaleMarks");
    throw new Error("Method not implemented.");
  }

  getServerTime?(callback: ServerTimeCallback): void {
    // todo should use correct backend value
    callback(new Date().getTime() / 1000);
  }

  searchSymbols(): void {
    console.log("searchSymbols");
    throw new Error("Method not implemented.");
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
  ): void {
    this.currentResolution = resolution;
    console.log("Current resolution", resolution);

    if (this.priceLoader) {
      clearInterval(this.priceLoader.timer);
      console.log(`Stopped realtime price loader for guid: ${this.priceLoader.listener}`);
      this.priceLoader = null;
    }
    // this.lastBar = null;

    const updatePrice = () => {
      this.apiClient
        .loadPrice(symbolInfo.name)
        .then((p) => {
          // todo the time for last price should be set on server and delivered in response
          const now = Date.now();
          const nowAligned = now - (now % resolutionToMs(this.lastBar?.resolution || resolution));
          if (this.lastBar && this.lastBar.bar.time >= nowAligned) {
            this.lastBar = {
              bar: {
                ...this.lastBar.bar,
                close: p.price,
                high: Math.max(p.price, this.lastBar.bar.high),
                low: Math.min(p.price, this.lastBar.bar.low),
              },
              resolution: resolution,
            };
            console.log(`updated last bar ${new Date(nowAligned)}`, this.lastBar);
          } else {
            this.lastBar = {
              bar: {
                open: p.price,
                close: p.price,
                high: p.price,
                low: p.price,
                volume: 0,
                time: nowAligned,
              },
              resolution: resolution,
            };
            console.log(`appended new bar for date ${new Date(nowAligned)}`, this.lastBar);
          }
          onTick(this.lastBar.bar);
        })
        .catch((e) => {
          console.warn("Failed to fetch realtime data", e);
        });
    };
    this.priceLoader = {
      timer: setInterval(() => updatePrice(), this.settings.realtimeReloadInterval),
      listener: listenerGuid,
    };
    updatePrice();
    console.log(`Started realtime price loader for resolution ${resolution}, guid: ${listenerGuid}`);
  }

  unsubscribeBars(listenerGuid: string): void {
    if (this.priceLoader && this.priceLoader.listener === listenerGuid) {
      clearInterval(this.priceLoader.timer);
      console.log(`Stopped realtime price loader for guid: ${this.priceLoader.listener}`);
      this.priceLoader = null;
    }
  }

  onReady(callback: OnReadyCallback): void {
    console.log("Widget is ready");
    setTimeout(() => callback({ ...this.config }));
  }

  subscribeDepth(): string {
    console.log("subscribeDepth");
    return "";
  }

  unsubscribeDepth(): void {
    console.log("unsubscribeDepth");
  }
}
