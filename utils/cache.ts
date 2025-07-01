import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // in milliseconds
}

class CacheManager {
  private static instance: CacheManager;

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Store data in cache
  async set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Get data from cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (!cachedData) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;

      if (isExpired) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Check if cache has valid data
  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  // Remove item from cache
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Get cache size
  async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.length;
    } catch (error) {
      console.error('Cache size error:', error);
      return 0;
    }
  }

  // Helper method to get cache key for API calls
  static getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `cache_${endpoint}_${paramString}`;
  }

  // Get all cache keys with pattern
  async getKeysWithPattern(pattern: string): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.includes(pattern));
    } catch (error) {
      console.error('Cache pattern search error:', error);
      return [];
    }
  }

  // Remove all cache entries matching pattern
  async removePattern(pattern: string): Promise<void> {
    try {
      const matchingKeys = await this.getKeysWithPattern(pattern);
      await AsyncStorage.multiRemove(matchingKeys);
      console.log(`Removed ${matchingKeys.length} cache entries matching pattern: ${pattern}`);
    } catch (error) {
      console.error('Cache pattern remove error:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ totalItems: number; totalSize: string; oldestEntry: Date | null }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      let oldestTimestamp: number | null = null;

      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += data.length;
          try {
            const cacheItem = JSON.parse(data);
            if (cacheItem.timestamp) {
              if (!oldestTimestamp || cacheItem.timestamp < oldestTimestamp) {
                oldestTimestamp = cacheItem.timestamp;
              }
            }
          } catch {
            // Ignore non-cache items
          }
        }
      }

      return {
        totalItems: keys.length,
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
        oldestEntry: oldestTimestamp ? new Date(oldestTimestamp) : null
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { totalItems: 0, totalSize: '0 KB', oldestEntry: null };
    }
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Cache expiry constants
export const CACHE_EXPIRY = {
  SHORT: 1 * 60 * 1000, // 1 minute - for real-time data like quotes
  MEDIUM: 5 * 60 * 1000, // 5 minutes - for daily data, search results
  LONG: 30 * 60 * 1000, // 30 minutes - for company info, static data
  DAY: 24 * 60 * 60 * 1000, // 24 hours - for rarely changing data
  WEEK: 7 * 24 * 60 * 60 * 1000, // 1 week - for very static data
} as const;

// Cache keys for different data types
export const CACHE_KEYS = {
  TOP_GAINERS_LOSERS: 'top_gainers_losers',
  COMPANY_OVERVIEW: (symbol: string) => `company_overview_${symbol}`,
  QUOTE: (symbol: string) => `quote_${symbol}`,
  DAILY_DATA: (symbol: string) => `daily_data_${symbol}`,
  SEARCH: (query: string) => `search_${query.trim().toLowerCase()}`,
  WATCHLISTS: 'watchlists_data',
} as const; 