import {
  Bar,
  DatafeedConfiguration,
  ErrorCallback,
  HistoryCallback,
  IDatafeedChartApi,
  IDatafeedQuotesApi,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SubscribeBarsCallback,
} from "../../common/charting_library";

class MockDataFeed implements IDatafeedChartApi, IDatafeedQuotesApi {
  onReady(callback: OnReadyCallback): void {
    const config: DatafeedConfiguration = {
      supported_resolutions: ["1D", "1W", "1M"] as ResolutionString[], // Ensure the array is typed correctly
    };
    setTimeout(() => callback(config), 0);
  }

  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: (symbols: SearchSymbolResultItem[]) => void,
  ): void {
    setTimeout(() => {
      onResult([
        {
          symbol: "AAPL",
          full_name: "Apple Inc.",
          description: "Apple Inc.",
          exchange: "NASDAQ",
          ticker: "AAPL",
          type: "stock",
        },
      ]);
    }, 0);
  }

  resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void {
    const symbolInfo: LibrarySymbolInfo = {
      ticker: "AAPL",
      name: "Apple Inc.",
      description: "Apple Inc.",
      type: "stock",
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: "NASDAQ",
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      has_no_volume: false,
      supported_resolutions: ["1D", "1W", "1M"] as ResolutionString[],
      full_name: "",
      listed_exchange: "",
      format: "price",
    };
    setTimeout(() => onResolve(symbolInfo), 0);
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean,
  ): void {
    const bars: Bar[] = [
      {
        time: 1716635866389,
        open: 0.000016,
        high: 0.000017,
        low: 0.000015,
        close: 0.0000165,
        volume: 50000,
      },
      {
        time: 1716636243252,
        open: 0.0000152734,
        high: 0.0000152734,
        low: 0.0000152734,
        close: 0.0000152734,
        volume: 1000,
      },
      {
        time: 1716636301924,
        open: 0.0000152634,
        high: 0.0000152634,
        low: 0.0000152634,
        close: 0.0000152634,
        volume: 2000,
      },
      {
        time: 1716636362160,
        open: 0.0000152634,
        high: 0.0000152634,
        low: 0.0000152634,
        close: 0.0000152634,
        volume: 3000,
      },
      {
        time: 1716636421851,
        open: 0.0000152734,
        high: 0.0000152734,
        low: 0.0000152734,
        close: 0.0000152734,
        volume: 5000,
      },
      {
        time: 1716636481450,
        open: 0.0000152634,
        high: 0.0000152634,
        low: 0.0000152634,
        close: 0.0000152634,
        volume: 3000,
      },
      {
        time: 1716636541245,
        open: 0.0000152634,
        high: 0.0000152634,
        low: 0.0000152634,
        close: 0.0000152634,
        volume: 3000,
      },
      {
        time: 1716636601233,
        open: 0.0000152634,
        high: 0.0000152634,
        low: 0.0000152634,
        close: 0.0000152634,
        volume: 4000,
      },
      {
        time: 1716636661867,
        open: 0.0000152753,
        high: 0.0000152753,
        low: 0.0000152753,
        close: 0.0000152753,
        volume: 6000,
      },
      {
        time: 1716636721554,
        open: 0.0000152753,
        high: 0.0000152753,
        low: 0.0000152753,
        close: 0.0000152753,
        volume: 7000,
      },
      {
        time: 1716636781780,
        open: 0.0000152634,
        high: 0.0000152634,
        low: 0.0000152634,
        close: 0.0000152634,
        volume: 8000,
      },
      {
        time: 1716636842159,
        open: 0.0000152753,
        high: 0.0000152753,
        low: 0.0000152753,
        close: 0.0000152753,
        volume: 9000,
      },
      {
        time: 1716636902416,
        open: 0.0000152753,
        high: 0.0000152753,
        low: 0.0000152753,
        close: 0.0000152753,
        volume: 10000,
      },
      {
        time: 1716636961764,
        open: 0.0000152753,
        high: 0.0000152753,
        low: 0.0000152753,
        close: 0.0000152753,
        volume: 1000,
      },
      {
        time: 1716637022046,
        open: 0.00001519865,
        high: 0.00001519865,
        low: 0.00001519865,
        close: 0.00001519865,
        volume: 2000,
      },
      {
        time: 1716637082400,
        open: 0.0000152753,
        high: 0.0000152753,
        low: 0.0000152753,
        close: 0.0000152753,
        volume: 3000,
      },
      {
        time: 1716637142293,
        open: 0.00001519865,
        high: 0.00001519865,
        low: 0.00001519865,
        close: 0.00001519865,
        volume: 4000,
      },
      {
        time: 1716637201867,
        open: 0.00001519865,
        high: 0.00001519865,
        low: 0.00001519865,
        close: 0.00001519865,
        volume: 6000,
      },
      {
        time: 1716637261976,
        open: 0.00001519865,
        high: 0.00001519865,
        low: 0.00001519865,
        close: 0.00001519865,
        volume: 1000,
      },
      {
        time: 1716637321577,
        open: 0.00001519865,
        high: 0.00001519865,
        low: 0.00001519865,
        close: 0.00001519865,
        volume: 2000,
      },
      {
        time: 1716637381554,
        open: 0.00001519865,
        high: 0.00001519865,
        low: 0.00001519865,
        close: 0.00001519865,
        volume: 3000,
      },
      {
        time: 1716637417656,
        open: 0.00001516155,
        high: 0.00001516155,
        low: 0.00001516155,
        close: 0.00001516155,
        volume: 1500,
      },
    ];
    setTimeout(() => onResult(bars, { noData: false }), 0);
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    // Implement if needed
  }

  unsubscribeBars(subscriberUID: string): void {
    // Implement if needed
  }

  getQuotes(
    symbols: string[],
    onDataCallback: (data: any) => void, // Replace with the correct type if available
    onErrorCallback: ErrorCallback,
  ): void {
    // Implement if needed
  }

  subscribeQuotes(
    symbols: string[],
    fastSymbols: string[],
    onRealtimeCallback: (data: any) => void, // Replace with the correct type if available
    listenerGUID: string,
  ): void {
    // Implement if needed
  }

  unsubscribeQuotes(listenerGUID: string): void {
    // Implement if needed
  }
}

export default MockDataFeed;
