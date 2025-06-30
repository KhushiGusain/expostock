// API Constants
export const API_CONFIG = {
  ALPHA_VANTAGE_BASE_URL: 'https://www.alphavantage.co/query',
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
} as const;

// App Colors
export const COLORS = {
  PRIMARY: '#10B981',
  PRIMARY_DARK: '#059669',
  PRIMARY_LIGHT: '#34D399',
  
  SUCCESS: '#16A34A',
  SUCCESS_BG: '#DCFCE7',
  
  ERROR: '#DC2626',
  ERROR_BG: '#FEE2E2',
  
  WARNING: '#F59E0B',
  WARNING_BG: '#FEF3C7',
  
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

// Font Sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
} as const;

// Font Weights
export const FONT_WEIGHTS = {
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  '2XL': 24,
  '3XL': 32,
  '4XL': 40,
  '5XL': 48,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  SM: 6,
  MD: 8,
  LG: 12,
  XL: 16,
  '2XL': 20,
  FULL: 9999,
} as const;

// Icon Mappings for different stock sectors
export const STOCK_ICONS = {
  TECHNOLOGY: 'laptop',
  AUTOMOTIVE: 'directions-car',
  BANKING: 'account-balance',
  HEALTHCARE: 'local-hospital',
  ENERGY: 'flash-on',
  RETAIL: 'shopping-cart',
  TELECOM: 'phone',
  FINANCE: 'account-balance-wallet',
  REAL_ESTATE: 'home',
  CONSUMER_GOODS: 'shopping-bag',
  INDUSTRIALS: 'precision-manufacturing',
  MATERIALS: 'build',
  UTILITIES: 'electrical-services',
  DEFAULT: 'business',
} as const;

// Market Status
export const MARKET_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PRE_MARKET: 'PRE_MARKET',
  AFTER_HOURS: 'AFTER_HOURS',
} as const;

// Chart Time Ranges
export const CHART_RANGES = [
  { label: '1D', value: '1D' },
  { label: '5D', value: '5D' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: 'MAX', value: 'MAX' },
] as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'StockWatch',
  VERSION: '1.0.0',
  BUNDLE_ID: 'com.yourcompany.stockwatch',
  MAX_WATCHLISTS: 10,
  MAX_STOCKS_PER_WATCHLIST: 50,
  REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// Cache Keys
export const CACHE_KEYS = {
  TOP_GAINERS_LOSERS: 'top_gainers_losers',
  STOCK_QUOTE: 'stock_quote',
  COMPANY_OVERVIEW: 'company_overview',
  DAILY_DATA: 'daily_data',
  SEARCH_RESULTS: 'search_results',
  WATCHLISTS: 'watchlists',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  API_LIMIT: 'API limit reached. Please try again later.',
  INVALID_SYMBOL: 'Invalid stock symbol. Please try a different symbol.',
  GENERAL: 'Something went wrong. Please try again.',
  CACHE_ERROR: 'Failed to save data locally.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  STOCK_ADDED: 'Stock added to watchlist successfully!',
  STOCK_REMOVED: 'Stock removed from watchlist successfully!',
  WATCHLIST_CREATED: 'Watchlist created successfully!',
  WATCHLIST_DELETED: 'Watchlist deleted successfully!',
} as const; 