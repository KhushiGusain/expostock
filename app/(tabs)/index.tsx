import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StockCard } from '@/components/StockCard';
import { SearchBox } from '@/components/SearchBox';
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

export default function HomeScreen() {
  const [topGainersData, setTopGainersData] = useState<FormattedStockData[]>([]);
  const [topLosersData, setTopLosersData] = useState<FormattedStockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getTopGainersLosers();
      
      // Format the data for our UI components
      const formattedGainers = response.top_gainers.slice(0, 4).map(formatStockData);
      const formattedLosers = response.top_losers.slice(0, 4).map(formatStockData);
      
      setTopGainersData(formattedGainers);
      setTopLosersData(formattedLosers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(errorMessage);
      console.error('Error fetching market data:', err);
      
      // Show alert for errors
      Alert.alert(
        'Error',
        errorMessage,
        [
          { text: 'Retry', onPress: () => fetchMarketData() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const onRefresh = () => {
    fetchMarketData(true);
  };

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={Colors.light.tint} />
      <Text style={styles.loadingText}>Loading market data...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <MaterialIcons name="error-outline" size={48} color={Colors.light.danger} />
      <Text style={styles.errorText}>Failed to load market data</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchMarketData()}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && topGainersData.length === 0) {
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
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image 
              source={require('../../assets/externalassets/profile image placeholder.png')}
              style={styles.profileImage}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.userName}>Sophia Calzoni</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Image 
              source={require('../../assets/externalassets/notification bell.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBox placeholder="Search stocks, companies..." />
        </View>

        {error && !loading && (
          <View style={styles.errorBanner}>
            <MaterialIcons name="warning" size={20} color={Colors.light.danger} />
            <Text style={styles.errorBannerText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <MaterialIcons name="close" size={20} color={Colors.light.danger} />
            </TouchableOpacity>
          </View>
        )}

        {/* Top Gainers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Gainers</Text>
            <TouchableOpacity onPress={() => router.push('/top-gainers')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {topGainersData.length > 0 ? (
            <View style={styles.stockGrid}>
              {topGainersData.map((stock, index) => (
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
              <Text style={styles.emptyStateText}>No gainers data available</Text>
            </View>
          )}
        </View>

        {/* Top Losers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Losers</Text>
            <TouchableOpacity onPress={() => router.push('/top-losers')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {topLosersData.length > 0 ? (
            <View style={styles.stockGrid}>
              {topLosersData.map((stock, index) => (
                <View key={`loser-${stock.symbol}-${index}`} style={styles.stockCardContainer}>
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
              <Text style={styles.emptyStateText}>No losers data available</Text>
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
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#E6F4F8',
  },
  welcomeText: {
    flex: 1,
  },
  welcomeBack: {
    fontSize: 13,
    color: Colors.light.textTertiary,
    fontFamily: FontFamily.regular,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    letterSpacing: -0.2,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationIcon: {
    width: 22,
    height: 22,
    tintColor: Colors.light.textSecondary,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    zIndex: 999999,
    elevation: 1000,
  },
  searchBarPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: FontFamily.regular,
  },
  section: {
    marginBottom: 24,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: '#5367ff',
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  stockCardContainer: {
    width: '48%',
  },
});
