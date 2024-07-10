import { resolutionToApi } from "./resolutions";
import { Settings } from "./settings";

export class ApiClient {
  constructor(private readonly settings: Settings) {}

  async loadBars(symbol: string, from: number, to: number, resolution: string) {
    const response = await fetch(
      this.settings.historicalPricesEndpoint +
        "?" +
        new URLSearchParams({
          address: this.settings.address,
          symbol: symbol,
          from: (from * 1000).toString(),
          to: (to * 1000).toString(),
          resolution: resolutionToApi(resolution),
        }),
    );
    // const response = await fetch('/mock/chart.json');
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  async loadPrice(symbol: string) {
    const response = await fetch(
      this.settings.currentPriceEndpoint +
        "?" +
        new URLSearchParams({
          address: this.settings.address,
          symbol: symbol,
          type: "seedPool",
        }),
    );
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
}
