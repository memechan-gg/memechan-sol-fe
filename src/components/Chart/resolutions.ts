import { ResolutionString } from "./libs/datafeed-api";

// resolutions in trading view format:
// https://www.tradingview.com/charting-library-docs/latest/api/modules/Charting_Library#resolutionstring
export const SUPPORTED_CHART_RESOLUTIONS: ResolutionString[] = [
  "5" as ResolutionString,
  "15" as ResolutionString,
  "60" as ResolutionString,
  "D" as ResolutionString,
];

export function resolutionToApi(r: string): string {
  switch (r) {
    case "5":
      return "5m";
    case "15":
      return "15m";
    case "60":
      return "1h";
    case "D":
      return "1d";
    default:
      throw new Error("Unsupported resolution: " + r);
  }
}
export function resolutionToMs(r: string): number {
  switch (r) {
    case "5":
      return 5 * 60 * 1000;
    case "15":
      return 15 * 60 * 1000;
    case "60":
      return 60 * 60 * 1000;
    case "D":
      return 24 * 60 * 60 * 1000;
    default:
      throw new Error("Unsupported resolution: " + r);
  }
}
