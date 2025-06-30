import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  addWatchlist: (name: string) => void;
  removeWatchlist: (id: string) => void;
  addStockToWatchlist: (watchlistId: string, stock: Stock) => void;
  removeStockFromWatchlist: (watchlistId: string, stockSymbol: string) => void;
  isStockInAnyWatchlist: (stockSymbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);

  const addWatchlist = (name: string) => {
    const newWatchlist: Watchlist = {
      id: Date.now().toString(),
      name,
      stocks: [],
      createdAt: new Date(),
    };
    setWatchlists(prev => [...prev, newWatchlist]);
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

  const value: WatchlistContextType = {
    watchlists,
    addWatchlist,
    removeWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,
    isStockInAnyWatchlist,
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