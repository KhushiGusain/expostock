import axios from 'axios';
import { cacheManager, CACHE_EXPIRY, CACHE_KEYS } from '@/utils/cache';

// Use environment variable for API key or fallback to demo
const ALPHA_VANTAGE_API_KEY = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Types for API responses
export interface TopGainersLosersResponse {
  metadata: string;
  last_updated: string;
  top_gainers: StockQuote[];
  top_losers: StockQuote[];
  most_actively_traded: StockQuote[];
}

export interface StockQuote {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

export interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  DividendDate: string;
  ExDividendDate: string;
}

export interface SearchResult {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

export interface SymbolSearchResponse {
  bestMatches: SearchResult[];
}

// API service class
class ApiService {
  private apiKey: string;

  constructor(apiKey: string = ALPHA_VANTAGE_API_KEY) {
    this.apiKey = apiKey;
  }

  // Cache utility methods
  async clearCache(): Promise<void> {
    await cacheManager.clear();
    console.log('API cache cleared');
  }

  async clearStockCache(symbol: string): Promise<void> {
    await Promise.all([
      cacheManager.remove(CACHE_KEYS.COMPANY_OVERVIEW(symbol)),
      cacheManager.remove(CACHE_KEYS.QUOTE(symbol)),
      cacheManager.remove(CACHE_KEYS.DAILY_DATA(symbol)),
    ]);
    console.log(`Cache cleared for ${symbol}`);
  }

  async getCacheStats(): Promise<{ size: number }> {
    const size = await cacheManager.getSize();
    return { size };
  }

  // Get top gainers and losers
  async getTopGainersLosers(): Promise<TopGainersLosersResponse> {
    const cacheKey = CACHE_KEYS.TOP_GAINERS_LOSERS;
    
    try {
      // Check cache first
      const cachedData = await cacheManager.get<TopGainersLosersResponse>(cacheKey);
      if (cachedData) {
        console.log('Returning cached top gainers/losers data');
        return cachedData;
      }

      console.log('Fetching fresh top gainers/losers data');
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TOP_GAINERS_LOSERS',
          apikey: this.apiKey,
        },
        timeout: 10000, // 10 second timeout
      });

      // Check if we got an error response
      if (response.data.Note) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      if (response.data.Information) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      // Cache the response for 2 minutes (market data changes frequently)
      await cacheManager.set(cacheKey, response.data, CACHE_EXPIRY.SHORT * 2);

      return response.data;
    } catch (error) {
      console.error('Error fetching top gainers/losers:', error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
      }
      throw new Error('Failed to fetch market data. Please try again.');
    }
  }

  // Get company overview
  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    const cacheKey = CACHE_KEYS.COMPANY_OVERVIEW(symbol);
    
    try {
      // Check cache first
      const cachedData = await cacheManager.get<CompanyOverview>(cacheKey);
      if (cachedData) {
        console.log(`Returning cached company overview for ${symbol}`);
        return cachedData;
      }

      console.log(`Fetching fresh company overview for ${symbol}`);
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'OVERVIEW',
          symbol: symbol,
          apikey: this.apiKey,
        },
      });

      // Cache for 30 minutes (company info doesn't change frequently)
      await cacheManager.set(cacheKey, response.data, CACHE_EXPIRY.LONG);

      return response.data;
    } catch (error) {
      console.error(`Error fetching company overview for ${symbol}:`, error);
      throw new Error(`Failed to fetch data for ${symbol}`);
    }
  }

  // Get real-time price quote
  async getQuote(symbol: string): Promise<any> {
    const cacheKey = CACHE_KEYS.QUOTE(symbol);
    
    try {
      // Check cache first
      const cachedData = await cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log(`Returning cached quote for ${symbol}`);
        return cachedData;
      }

      console.log(`Fetching fresh quote for ${symbol}`);
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.apiKey,
        },
      });

      // Cache for 1 minute (price data changes frequently)
      await cacheManager.set(cacheKey, response.data, CACHE_EXPIRY.SHORT);

      return response.data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }

  // Get daily time series data for charts
  async getDailyData(symbol: string): Promise<any> {
    const cacheKey = CACHE_KEYS.DAILY_DATA(symbol);
    
    try {
      // Check cache first
      const cachedData = await cacheManager.get<any>(cacheKey);
      if (cachedData) {
        console.log(`Returning cached daily data for ${symbol}`);
        return cachedData;
      }

      console.log(`Fetching fresh daily data for ${symbol}`);
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: this.apiKey,
        },
      });

      // Cache for 5 minutes (daily data doesn't change during trading day)
      await cacheManager.set(cacheKey, response.data, CACHE_EXPIRY.MEDIUM);

      return response.data;
    } catch (error) {
      console.error(`Error fetching daily data for ${symbol}:`, error);
      throw new Error(`Failed to fetch daily data for ${symbol}`);
    }
  }

  // Search for stocks with symbol search
  async searchStocks(query: string): Promise<SymbolSearchResponse> {
    try {
      // Don't search if query is too short
      if (!query || query.trim().length < 1) {
        return { bestMatches: [] };
      }

      const cacheKey = CACHE_KEYS.SEARCH(query);
      
      // Check cache first
      const cachedData = await cacheManager.get<SymbolSearchResponse>(cacheKey);
      if (cachedData) {
        console.log(`Returning cached search results for "${query}"`);
        return cachedData;
      }

      console.log(`Fetching fresh search results for "${query}"`);
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query.trim(),
          apikey: this.apiKey,
        },
        timeout: 8000, // 8 second timeout
      });

      // Check for API errors
      if (response.data.Note) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      if (response.data.Information) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      // Return empty results if no matches found
      if (!response.data.bestMatches) {
        return { bestMatches: [] };
      }

      // Cache search results for 5 minutes
      await cacheManager.set(cacheKey, response.data, CACHE_EXPIRY.MEDIUM);

      return response.data;
    } catch (error) {
      console.error(`Error searching stocks with query ${query}:`, error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Search request timed out. Please try again.');
        }
        if (error.response?.status === 429) {
          throw new Error('Search rate limit exceeded. Please try again later.');
        }
      }
      throw new Error('Failed to search stocks. Please try again.');
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Helper function to format stock data from API response
export function formatStockData(quote: StockQuote): any {
  const changePercent = parseFloat(quote.change_percentage.replace('%', ''));
  const price = parseFloat(quote.price);
  
  return {
    symbol: quote.ticker,
    name: quote.ticker, // Alpha Vantage doesn't provide company names in this endpoint
    price: price.toFixed(2),
    change: quote.change_percentage,
    isPositive: changePercent >= 0,
    icon: getDefaultIcon(quote.ticker),
  };
}

// Helper function to format search results for UI
export function formatSearchResult(result: SearchResult) {
  return {
    symbol: result['1. symbol'],
    name: result['2. name'],
    type: result['3. type'],
    region: result['4. region'],
    currency: result['8. currency'],
    matchScore: parseFloat(result['9. matchScore']),
    icon: getDefaultIcon(result['1. symbol']),
  };
}

// Helper function to get default icon based on ticker or sector
function getDefaultIcon(ticker: string): string {
  // Simple mapping based on common ticker patterns
  const iconMap: { [key: string]: string } = {
    // Tech companies
    'AAPL': 'laptop',
    'MSFT': 'laptop',
    'GOOGL': 'laptop',
    'AMZN': 'laptop',
    'META': 'laptop',
    'NVDA': 'laptop',
    'TSLA': 'directions-car',
    // Banks
    'JPM': 'account-balance',
    'BAC': 'account-balance',
    'WFC': 'account-balance',
    'GS': 'account-balance',
    'MS': 'account-balance',
    // Default
    'default': 'business'
  };

  return iconMap[ticker] || iconMap['default'];
} 