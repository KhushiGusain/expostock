import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StockCard } from '@/components/StockCard';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';
import { apiService, formatStockData, StockQuote } from '@/services/api';

interface FormattedStockData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export default function TopGainersScreen() {
  const [stockData, setStockData] = useState<FormattedStockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopGainers = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getTopGainersLosers();
      
      // Format all top gainers data for our UI components
      const formattedGainers = response.top_gainers.map(formatStockData);
      
      setStockData(formattedGainers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top gainers data';
      setError(errorMessage);
      console.error('Error fetching top gainers:', err);
      
      // Show alert for errors
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Retry', onPress: () => fetchTopGainers() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTopGainers();
  }, []);

  const onRefresh = () => {
    fetchTopGainers(true);
  };

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.light.tint} />
      <Text style={styles.loadingText}>Loading top gainers...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={48} color={Colors.light.danger} />
      <Text style={styles.errorText}>Failed to load top gainers</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchTopGainers()}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && stockData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Top Gainers</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && !loading && (
          <View style={styles.errorBanner}>
            <MaterialIcons name="warning" size={20} color={Colors.light.danger} />
            <Text style={styles.errorBannerText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <MaterialIcons name="close" size={20} color={Colors.light.danger} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stocks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>
            {stockData.length} stocks are gaining today
          </Text>
          {stockData.length > 0 ? (
            <View style={styles.stockGrid}>
              {stockData.map((stock, index) => (
                <View key={`gainer-${stock.symbol}-${index}`} style={styles.stockCardContainer}>
                  <StockCard
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    isPositive={stock.isPositive}
                    icon={stock.icon as keyof typeof MaterialIcons.glyphMap}
                    onPress={() => router.push(`/stock-details?symbol=${stock.symbol}`)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="trending-up" size={48} color={Colors.light.textTertiary} />
              <Text style={styles.emptyStateText}>No gainers data available</Text>
            </View>
          )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.danger,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.danger,
    fontFamily: FontFamily.regular,
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
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
}); 