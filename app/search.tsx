import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SearchBox } from '@/components/SearchBox';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
  matchScore: number;
  icon: string;
}

export default function SearchScreen() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Popular stocks for quick access
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  ];

  const handleSearchResult = (result: SearchResult) => {
    // Add to recent searches
    const updatedRecent = [result.symbol, ...recentSearches.filter(s => s !== result.symbol)].slice(0, 5);
    setRecentSearches(updatedRecent);
    
    // Navigate to stock details
    router.push(`/stock-details?symbol=${result.symbol}`);
  };

  const handlePopularStockPress = (symbol: string) => {
    // Add to recent searches
    const updatedRecent = [symbol, ...recentSearches.filter(s => s !== symbol)].slice(0, 5);
    setRecentSearches(updatedRecent);
    
    // Navigate to stock details
    router.push(`/stock-details?symbol=${symbol}`);
  };

  const handleRecentSearchPress = (symbol: string) => {
    router.push(`/stock-details?symbol=${symbol}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Stocks</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Search Box */}
        <View style={styles.searchSection}>
          <SearchBox 
            placeholder="Search stocks, companies, symbols..."
            onResultSelect={handleSearchResult}
          />
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipContainer}>
              {recentSearches.map((symbol, index) => (
                <TouchableOpacity
                  key={`recent-${symbol}-${index}`}
                  style={styles.recentChip}
                  onPress={() => handleRecentSearchPress(symbol)}
                >
                  <MaterialIcons name="history" size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.recentChipText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Popular Stocks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Stocks</Text>
            <MaterialIcons name="trending-up" size={20} color={Colors.light.tint} />
          </View>
          <View style={styles.popularStocksGrid}>
            {popularStocks.map((stock, index) => (
              <TouchableOpacity
                key={`popular-${stock.symbol}-${index}`}
                style={styles.popularStockCard}
                onPress={() => handlePopularStockPress(stock.symbol)}
                activeOpacity={0.7}
              >
                <View style={styles.popularStockIcon}>
                  <MaterialIcons name="business" size={24} color={Colors.light.tint} />
                </View>
                <Text style={styles.popularStockSymbol}>{stock.symbol}</Text>
                <Text style={styles.popularStockName} numberOfLines={2}>
                  {stock.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <MaterialIcons name="lightbulb-outline" size={20} color={Colors.light.tint} />
              <Text style={styles.tipText}>
                Search by company name, stock symbol, or ticker
              </Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="search" size={20} color={Colors.light.tint} />
              <Text style={styles.tipText}>
                Use partial names for quick results (e.g., "micro" for Microsoft)
              </Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="trending-up" size={20} color={Colors.light.tint} />
              <Text style={styles.tipText}>
                Results are sorted by relevance and match score
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    zIndex: 999997,
    overflow: 'visible',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  clearText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.tint,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    gap: 6,
  },
  recentChipText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
  },
  popularStocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  popularStockCard: {
    width: '48%',
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    alignItems: 'center',
  },
  popularStockIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularStockSymbol: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  popularStockName: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
}); 