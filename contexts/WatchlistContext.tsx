import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { cacheManager, CACHE_KEYS, CACHE_EXPIRY } from '@/utils/cache';

export interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
  createdAt: Date;
}

interface WatchlistContextType {
  watchlists: Watchlist[];
  isLoaded: boolean;
  addWatchlist: (name: string) => string;
  removeWatchlist: (id: string) => void;
  addStockToWatchlist: (watchlistId: string, stock: Stock) => void;
  removeStockFromWatchlist: (watchlistId: string, stockSymbol: string) => void;
  isStockInAnyWatchlist: (stockSymbol: string) => boolean;
  clearWatchlistCache: () => Promise<void>;
  refreshWatchlists: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlists from cache on mount
  useEffect(() => {
    loadWatchlists();
  }, []);

  // Save watchlists to cache whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveWatchlists();
    }
  }, [watchlists, isLoaded]);

  const loadWatchlists = async () => {
    try {
      const cached = await cacheManager.get<Watchlist[]>(CACHE_KEYS.WATCHLISTS);
      if (cached) {
        setWatchlists(cached);
        console.log('Loaded watchlists from cache:', cached.length);
      }
    } catch (error) {
      console.error('Error loading watchlists from cache:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveWatchlists = async () => {
    try {
      await cacheManager.set(CACHE_KEYS.WATCHLISTS, watchlists, CACHE_EXPIRY.WEEK);
      console.log('Saved watchlists to cache:', watchlists.length);
    } catch (error) {
      console.error('Error saving watchlists to cache:', error);
    }
  };

  const addWatchlist = (name: string): string => {
    const newWatchlist: Watchlist = {
      id: Date.now().toString(),
      name,
      stocks: [],
      createdAt: new Date(),
    };
    setWatchlists(prev => [...prev, newWatchlist]);
    return newWatchlist.id;
  };

  const removeWatchlist = (id: string) => {
    setWatchlists(prev => prev.filter(watchlist => watchlist.id !== id));
  };

  const addStockToWatchlist = (watchlistId: string, stock: Stock) => {
    setWatchlists(prev =>
      prev.map(watchlist =>
        watchlist.id === watchlistId
          ? {
              ...watchlist,
              stocks: [...watchlist.stocks.filter(s => s.symbol !== stock.symbol), stock],
            }
          : watchlist
      )
    );
  };

  const removeStockFromWatchlist = (watchlistId: string, stockSymbol: string) => {
    setWatchlists(prev =>
      prev.map(watchlist =>
        watchlist.id === watchlistId
          ? {
              ...watchlist,
              stocks: watchlist.stocks.filter(stock => stock.symbol !== stockSymbol),
            }
          : watchlist
      )
    );
  };

  const isStockInAnyWatchlist = (stockSymbol: string): boolean => {
    return watchlists.some(watchlist =>
      watchlist.stocks.some(stock => stock.symbol === stockSymbol)
    );
  };

  const clearWatchlistCache = async (): Promise<void> => {
    try {
      await cacheManager.remove(CACHE_KEYS.WATCHLISTS);
      console.log('Watchlist cache cleared');
    } catch (error) {
      console.error('Error clearing watchlist cache:', error);
    }
  };

  const refreshWatchlists = async (): Promise<void> => {
    await loadWatchlists();
  };

  const value: WatchlistContextType = {
    watchlists,
    isLoaded,
    addWatchlist,
    removeWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,
    isStockInAnyWatchlist,
    clearWatchlistCache,
    refreshWatchlists,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
} 