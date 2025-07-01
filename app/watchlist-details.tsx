import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar,
  Alert,
  RefreshControl
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StockCard } from '@/components/StockCard';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';
import { useWatchlist, Watchlist, Stock } from '@/contexts/WatchlistContext';

export default function WatchlistDetailsScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { watchlists, removeStockFromWatchlist } = useWatchlist();
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundWatchlist = watchlists.find(w => w.id === id);
      setWatchlist(foundWatchlist || null);
    }
  }, [id, watchlists]);

  const handleRemoveStock = (stockSymbol: string, stockName: string) => {
    Alert.alert(
      'Remove Stock',
      `Remove ${stockName} from "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            if (id) {
              removeStockFromWatchlist(id, stockSymbol);
            }
          }
        }
      ]
    );
  };

  const navigateToStock = (symbol: string) => {
    router.push(`/stock-details?symbol=${symbol}`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Refresh logic here if needed
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!watchlist) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
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
            <Text style={styles.headerTitle}>Watchlist Not Found</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.centerContainer}>
            <MaterialIcons name="error-outline" size={48} color={Colors.light.danger} />
            <Text style={styles.errorText}>Watchlist not found</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
        <Text style={styles.headerTitle} numberOfLines={1}>{decodeURIComponent(name || '')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stocks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>
            {watchlist.stocks.length} {watchlist.stocks.length === 1 ? 'stock' : 'stocks'} in this watchlist
          </Text>
          
          {watchlist.stocks.length > 0 ? (
            <View style={styles.stockGrid}>
              {watchlist.stocks.map((stock, index) => (
                <View key={`${stock.symbol}-${index}`} style={styles.stockCardContainer}>
                  <StockCard
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    isPositive={stock.isPositive}
                    icon={stock.icon as keyof typeof MaterialIcons.glyphMap}
                    onPress={() => navigateToStock(stock.symbol)}
                  />
                  
                  {/* Remove Button Overlay */}
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveStock(stock.symbol, stock.name)}
                  >
                    <MaterialIcons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="bookmark-border" size={48} color={Colors.light.textTertiary} />
              <Text style={styles.emptyStateText}>No stocks in this watchlist</Text>
              <Text style={styles.emptyStateSubtext}>Add stocks from the stock details pages</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.danger,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
    marginBottom: 20,
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stockCardContainer: {
    width: '48%',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.danger,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
}); 