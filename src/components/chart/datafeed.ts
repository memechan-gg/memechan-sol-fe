import {
  Bar,
  DatafeedConfiguration,
  DomeCallback,
  ErrorCallback,
  GetMarksCallback,
  HistoryCallback,
  HistoryDepth,
  IDatafeedChartApi,
  IDatafeedQuotesApi,
  LibrarySymbolInfo,
  Mark,
  QuotesCallback,
  ResolutionBackValues,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  ServerTimeCallback,
  SubscribeBarsCallback,
  TimescaleMark,
} from "../../common/charting_library";

interface ExtendedLibrarySymbolInfo extends LibrarySymbolInfo {
  address: string;
}

class MyDataFeed implements IDatafeedChartApi, IDatafeedQuotesApi {
  subscribeQuotes(
    symbols: string[],
    fastSymbols: string[],
    onRealtimeCallback: QuotesCallback,
    listenerGUID: string,
  ): void {
    throw new Error("Method not implemented.");
  }
  unsubscribeQuotes(listenerGUID: string): void {
    throw new Error("Method not implemented.");
  }
  calculateHistoryDepth?(
    resolution: ResolutionString,
    resolutionBack: ResolutionBackValues,
    intervalBack: number,
  ): HistoryDepth | undefined {
    throw new Error("Method not implemented.");
  }
  getMarks?(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString,
  ): void {
    throw new Error("Method not implemented.");
  }
  getTimescaleMarks?(
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
    resolution: ResolutionString,
  ): void {
    throw new Error("Method not implemented.");
  }
  getServerTime?(callback: ServerTimeCallback): void {
    throw new Error("Method not implemented.");
  }
  subscribeDepth?(symbol: string, callback: DomeCallback): string {
    throw new Error("Method not implemented.");
  }
  unsubscribeDepth?(subscriberUID: string): void {
    throw new Error("Method not implemented.");
  }
  onReady(callback: (config: DatafeedConfiguration) => void): void {
    const configuration: DatafeedConfiguration = {
      supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"] as ResolutionString[],
    };
    setTimeout(() => callback(configuration), 0);
  }

  resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: ResolveCallback,
    onResolveErrorCallback: ErrorCallback,
  ): void {
    const symbolInfo: ExtendedLibrarySymbolInfo = {
      ticker: symbolName,
      name: symbolName,
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_no_volume: false,
      supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"] as ResolutionString[],
      volume_precision: 2,
      full_name: symbolName,
      description: `${symbolName} description`,
      type: "stock",
      exchange: "NYSE",
      listed_exchange: "NYSE",
      format: "price",
      address: "",
    };
    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    from: number,
    to: number,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback,
    firstDataRequest: boolean,
  ): void {
    const address = (symbolInfo as ExtendedLibrarySymbolInfo).address;
    //  `https://14r6b4r6kf.execute-api.us-east-1.amazonaws.com/prod?chart?address=9yNaVhmMFiwTkPcBRLcgyHnq8zZEKfg8MDZhsDXiwuQi&symbol=USD&from=0&to=1716637420135&resolution=5m`,
    fetch(
      `https://14r6b4r6kf.execute-api.us-east-1.amazonaws.com/prod?chart?address=${address}?symbol=${symbolInfo.name}&from=${from}&to=${to}&resolution=${resolution}`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.s === "ok") {
          const bars: Bar[] = data.t.map((time: number, index: number) => ({
            time: time * 1000,
            low: data.l[index],
            high: data.h[index],
            open: data.o[index],
            close: data.c[index],
            volume: data.v[index],
          }));
          onHistoryCallback(bars, { noData: bars.length === 0 });
        } else {
          onErrorCallback(data.errmsg);
        }
      })
      .catch((err) => onErrorCallback(err));
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    // Implement subscription logic here
  }

  unsubscribeBars(subscriberUID: string): void {
    // Implement unsubscription logic here
  }

  getQuotes(symbols: string[], onDataCallback: (data: any) => void, onErrorCallback: (error: string) => void): void {
    // Implement quotes fetching logic here
  }

  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: (result: SearchSymbolResultItem[]) => void,
  ): void {
    // Implement symbol search logic here
  }
}

export default MyDataFeed;
