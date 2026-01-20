export const API_CONFIG = {
  BASE_URL: "https://api.binance.com/api/v3",
  ORDERBOOK_LIMIT: 20,
  POLL_INTERVAL: 1500,
  TIMEOUT: 5000,
} as const;

export const DISPLAY_CONFIG = {
  VISIBLE_LEVELS: 10,
  PRICE_DECIMALS: 2,
  QUANTITY_DECIMALS: 5,
} as const;

export class ApiConfig {
  static getBaseUrl(): string {
    return API_CONFIG.BASE_URL;
  }

  static getOrderbookLimit(): number {
    return API_CONFIG.ORDERBOOK_LIMIT;
  }

  static getPollInterval(): number {
    return API_CONFIG.POLL_INTERVAL;
  }

  static getTimeout(): number {
    return API_CONFIG.TIMEOUT;
  }

  static getVisibleLevels(): number {
    return DISPLAY_CONFIG.VISIBLE_LEVELS;
  }
}
