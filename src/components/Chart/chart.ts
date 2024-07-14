import {
  ChartingLibraryFeatureset,
  ChartingLibraryWidgetOptions,
  IBasicDataFeed,
  LanguageCode,
  LibrarySymbolInfo,
  ResolutionString,
} from "./libs/charting_library";
import { SUPPORTED_CHART_RESOLUTIONS } from "./resolutions";

const LIB_PATH = "/libs/";

export const INTRADAY_MULTIPLIERS = ["1", "5", "15", "30", "60", "240", "D"];

export function createWidgetOptions(
  contract: string,
  initialInterval: ResolutionString,
  datafeed: IBasicDataFeed,
  containerId: string,
  isMobile = false,
  isCompact = false,
  locale: LanguageCode = "en",
): ChartingLibraryWidgetOptions {
  return {
    symbol: contract,
    datafeed,
    interval: initialInterval,
    container: containerId,
    library_path: LIB_PATH,
    locale,
    disabled_features: [
      "chart_property_page_timezone_sessions",
      "go_to_date",
      isMobile || isCompact ? "left_toolbar" : null,
      "header_symbol_search",
      "header_undo_redo",
      "header_compare",
      "display_market_status",
      "charting_library_debug_mode",
      isMobile ? "legend_widget" : null,
      "create_volume_indicator_by_default",
      isMobile || isCompact ? "header_indicators" : null,
    ]
      .filter((_) => !!_)
      .map((x) => x as ChartingLibraryFeatureset),
    enabled_features: ["move_logo_to_main_pane", "use_localstorage_for_settings"],
    fullscreen: false,
    autosize: true,
    toolbar_bg: "#404040",
    auto_save_delay: 2,
    theme: "dark",
    debug: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as any,
    // custom_css_url: '/assets/tradingview-override.css?2',
    loading_screen: { backgroundColor: "transparent" },
  };
}

export function toSymbolInfo(
  symbolName: string,
  contractName: string,
  priceDigitsAfterComma: number,
): LibrarySymbolInfo {
  const symbolInfo: LibrarySymbolInfo = {
    name: symbolName,
    timezone: "Etc/UTC",
    minmov: 1,
    session: "24x7",
    has_intraday: true,
    visible_plots_set: "ohlcv",
    description: contractName,
    type: "index",
    supported_resolutions: SUPPORTED_CHART_RESOLUTIONS,
    full_name: contractName,
    pricescale: Math.pow(10, priceDigitsAfterComma),
    ticker: symbolName,
    exchange: "Memechan.gg Chart",
    has_daily: true,
    format: "price",

    listed_exchange: "Memechan.gg Chart",
    // has_empty_bars: true,
    intraday_multipliers: INTRADAY_MULTIPLIERS,
    // volume_precision: 3,
    data_status: "streaming",
    // expired: false,
    // expiration_date: null,
    delay: 0,
  };

  return symbolInfo;
}
