export interface Settings {
  readonly historicalPricesEndpoint: string;
  readonly currentPriceEndpoint: string;
  readonly address: string;
  readonly symbol: string;
  readonly contractName: string;
  readonly realtimeReloadInterval: number;
  readonly priceDigitsAfterComma: number;
}
