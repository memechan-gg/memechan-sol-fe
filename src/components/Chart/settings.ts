export interface Settings {
  readonly historicalPricesEndpoint: string;
  readonly currentPriceEndpoint: string;
  readonly address: string;
  readonly symbol: string;
  readonly contractName: string;
  readonly realtimeReloadInterval: number;
  readonly priceDigitsAfterComma: number;
}

export interface EnvSettings {
  readonly historicalPricesEndpoint: string;
  readonly currentPriceEndpoint: string;
  readonly realtimeReloadInterval: number;
  readonly priceDigitsAfterComma: number;
}

export interface PropsSettings {
  readonly address: string;
  readonly symbol: string;
  readonly contractName: string;
}
