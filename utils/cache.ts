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
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Cache expiry constants
export const CACHE_EXPIRY = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  DAY: 24 * 60 * 60 * 1000, // 24 hours
} as const; 