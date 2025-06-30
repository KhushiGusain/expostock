import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';
import { apiService, CompanyOverview } from '@/services/api';
import { useWatchlist } from '@/contexts/WatchlistContext';

interface StockDetailsData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  marketCap: string;
  volume: string;
  peRatio: string;
  dayRange: string;
  weekHigh52: string;
  weekLow52: string;
  description: string;
  sector: string;
  industry: string;
  beta: string;
  eps: string;
  dividendYield: string;
  movingAvg50: string;
  movingAvg200: string;
}

interface ChartDataPoint {
  date: string;
  price: number;
}

// Helper functions to generate sample data
const getCompanyName = (symbol: string): string => {
  const companyNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'JPM': 'JPMorgan Chase & Co.',
    'JNJ': 'Johnson & Johnson',
    'V': 'Visa Inc.',
    'PG': 'Procter & Gamble',
    'HD': 'Home Depot Inc.',
    'UNH': 'UnitedHealth Group',
    'MA': 'Mastercard Inc.',
    'BAC': 'Bank of America Corp',
    'XOM': 'Exxon Mobil Corporation',
    'IBM': 'International Business Machines',
    'WMT': 'Walmart Inc.',
    'DIS': 'Walt Disney Company',
    'NFLX': 'Netflix Inc.',
  };
  return companyNames[symbol] || `${symbol} Corporation`;
};

const getSamplePrice = (symbol: string): string => {
  const base = symbol.charCodeAt(0) + symbol.charCodeAt(1);
  return (50 + (base % 400) + Math.random() * 50).toFixed(2);
};

const getSampleChange = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  const change = (base % 10) - 5 + Math.random() * 2;
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
};

const getSampleChangePercent = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  const percent = ((base % 10) - 5) * 0.5 + Math.random() * 1;
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
};

const getSampleMarketCap = (symbol: string): string => {
  const base = symbol.charCodeAt(0) + symbol.charCodeAt(1);
  const cap = 10 + (base % 500);
  return `₹${cap.toFixed(2)} Cr`;
};

const getSampleVolume = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  const volume = 1 + (base % 50);
  return `${volume.toFixed(1)}M`;
};

const getSamplePERatio = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  return (15 + (base % 20)).toFixed(1);
};

const getSampleDayRange = (symbol: string): string => {
  const price = parseFloat(getSamplePrice(symbol));
  const low = (price * 0.95).toFixed(2);
  const high = (price * 1.05).toFixed(2);
  return `₹${low}-₹${high}`;
};

const getSample52WeekHigh = (symbol: string): string => {
  const price = parseFloat(getSamplePrice(symbol));
  return (price * 1.3).toFixed(2);
};

const getSample52WeekLow = (symbol: string): string => {
  const price = parseFloat(getSamplePrice(symbol));
  return (price * 0.7).toFixed(2);
};

const getSampleDescription = (symbol: string): string => {
  return `${getCompanyName(symbol)} is a leading company in its sector, providing innovative solutions and services to customers worldwide. The company has demonstrated strong growth and continues to expand its market presence.`;
};

const getSampleSector = (symbol: string): string => {
  const sectors = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Goods', 'Energy', 'Industrials'];
  const base = symbol.charCodeAt(0);
  return sectors[base % sectors.length];
};

const getSampleIndustry = (symbol: string): string => {
  const industries = ['Software', 'Biotechnology', 'Banking', 'Retail', 'Oil & Gas', 'Manufacturing'];
  const base = symbol.charCodeAt(1) || symbol.charCodeAt(0);
  return industries[base % industries.length];
};

const getSampleBeta = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  return (0.5 + (base % 15) * 0.1).toFixed(2);
};

const getSampleEPS = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  return (1 + (base % 10)).toFixed(2);
};

const getSampleDividendYield = (symbol: string): string => {
  const base = symbol.charCodeAt(0);
  return `${(base % 5 + 0.5).toFixed(1)}%`;
};

const getSampleMovingAvg50 = (symbol: string): string => {
  const price = parseFloat(getSamplePrice(symbol));
  return (price * 0.98).toFixed(2);
};

const getSampleMovingAvg200 = (symbol: string): string => {
  const price = parseFloat(getSamplePrice(symbol));
  return (price * 0.92).toFixed(2);
};

export default function StockDetailsScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [stockData, setStockData] = useState<StockDetailsData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const { watchlists, addWatchlist, addStockToWatchlist, removeStockFromWatchlist, isStockInAnyWatchlist } = useWatchlist();
  
  const isWatchlisted = isStockInAnyWatchlist(symbol || '');
  
  // Get or create default watchlist
  const getDefaultWatchlist = () => {
    let defaultWatchlist = watchlists.find(w => w.name === 'My Watchlist');
    if (!defaultWatchlist) {
      addWatchlist('My Watchlist');
      defaultWatchlist = watchlists.find(w => w.name === 'My Watchlist');
    }
    return defaultWatchlist;
  };

  const timeframes = ['1D', '1W', '1M', '1Y', '5Y', 'ALL'];

  useEffect(() => {
    if (symbol) {
      fetchStockDetails();
    }
  }, [symbol]);

  const fetchStockDetails = async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      
      // First try to get company overview (most complete data)
      const overview = await apiService.getCompanyOverview(symbol);
      
      // Check if we got valid data from overview
      if (!overview.Symbol) {
        throw new Error('No data available for this symbol');
      }

      // Initialize price variables
      let price = 0;
      let change = 0;
      let changePercent = 0;
      
      // Try to get quote data for more current price info
      try {
        const quote = await apiService.getQuote(symbol);
        const quoteData = quote['Global Quote'] || {};
        
        if (quoteData['05. price']) {
          price = parseFloat(quoteData['05. price']);
          change = parseFloat(quoteData['09. change'] || '0');
          changePercent = parseFloat(quoteData['10. change percent']?.replace('%', '') || '0');
        }
      } catch (quoteError) {
        console.log('Quote data not available, using overview data');
      }

      // Try to get chart data
      try {
        const dailyData = await apiService.getDailyData(symbol);
        const timeSeries = dailyData['Time Series (Daily)'] || {};
        const chartPoints: ChartDataPoint[] = Object.entries(timeSeries)
          .slice(0, 30) // Get last 30 days
          .map(([date, data]: [string, any]) => ({
            date,
            price: parseFloat(data['4. close'])
          }))
          .reverse(); // Reverse to show chronological order
        setChartData(chartPoints);
      } catch (chartError) {
        console.log('Chart data not available');
        setChartData([]);
      }

      // Format the data with proper fallbacks
      const stockDetails: StockDetailsData = {
        symbol: overview.Symbol || symbol,
        name: overview.Name || getCompanyName(symbol),
        price: price > 0 ? price.toFixed(2) : getSamplePrice(symbol),
        change: change !== 0 ? `${change >= 0 ? '+' : ''}${change.toFixed(2)}` : getSampleChange(symbol),
        changePercent: changePercent !== 0 ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : getSampleChangePercent(symbol),
        isPositive: change >= 0,
        marketCap: formatMarketCap(overview.MarketCapitalization) !== 'N/A' ? formatMarketCap(overview.MarketCapitalization) : getSampleMarketCap(symbol),
        volume: overview.SharesOutstanding ? formatVolume(overview.SharesOutstanding) : getSampleVolume(symbol),
        peRatio: overview.PERatio && overview.PERatio !== 'None' ? overview.PERatio : getSamplePERatio(symbol),
        dayRange: (overview['52WeekLow'] && overview['52WeekHigh']) ? `₹${overview['52WeekLow']}-₹${overview['52WeekHigh']}` : getSampleDayRange(symbol),
        weekHigh52: overview['52WeekHigh'] && overview['52WeekHigh'] !== 'None' ? overview['52WeekHigh'] : getSample52WeekHigh(symbol),
        weekLow52: overview['52WeekLow'] && overview['52WeekLow'] !== 'None' ? overview['52WeekLow'] : getSample52WeekLow(symbol),
        description: overview.Description && overview.Description !== 'None' ? overview.Description : getSampleDescription(symbol),
        sector: overview.Sector && overview.Sector !== 'None' ? overview.Sector : getSampleSector(symbol),
        industry: overview.Industry && overview.Industry !== 'None' ? overview.Industry : getSampleIndustry(symbol),
        beta: overview.Beta && overview.Beta !== 'None' ? overview.Beta : getSampleBeta(symbol),
        eps: overview.EPS && overview.EPS !== 'None' ? overview.EPS : getSampleEPS(symbol),
        dividendYield: overview.DividendYield && overview.DividendYield !== 'None' ? `${(parseFloat(overview.DividendYield) * 100).toFixed(2)}%` : getSampleDividendYield(symbol),
        movingAvg50: overview['50DayMovingAverage'] && overview['50DayMovingAverage'] !== 'None' ? overview['50DayMovingAverage'] : getSampleMovingAvg50(symbol),
        movingAvg200: overview['200DayMovingAverage'] && overview['200DayMovingAverage'] !== 'None' ? overview['200DayMovingAverage'] : getSampleMovingAvg200(symbol),
      };

      setStockData(stockDetails);
    } catch (error) {
      console.error('Error fetching stock details:', error);
      
      // Create fallback data for demo purposes
      const fallbackData: StockDetailsData = {
        symbol: symbol,
        name: getCompanyName(symbol),
        price: getSamplePrice(symbol),
        change: getSampleChange(symbol),
        changePercent: getSampleChangePercent(symbol),
        isPositive: Math.random() > 0.5,
        marketCap: getSampleMarketCap(symbol),
        volume: getSampleVolume(symbol),
        peRatio: getSamplePERatio(symbol),
        dayRange: getSampleDayRange(symbol),
        weekHigh52: getSample52WeekHigh(symbol),
        weekLow52: getSample52WeekLow(symbol),
        description: getSampleDescription(symbol),
        sector: getSampleSector(symbol),
        industry: getSampleIndustry(symbol),
        beta: getSampleBeta(symbol),
        eps: getSampleEPS(symbol),
        dividendYield: getSampleDividendYield(symbol),
        movingAvg50: getSampleMovingAvg50(symbol),
        movingAvg200: getSampleMovingAvg200(symbol),
      };
      
      setStockData(fallbackData);
      Alert.alert('Notice', 'Using sample data due to API limitations. Please check your internet connection or API key.');
    } finally {
      setLoading(false);
    }
  };

  const formatMarketCap = (marketCap: string): string => {
    if (!marketCap || marketCap === 'None') return 'N/A';
    const value = parseFloat(marketCap);
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)} Tr`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)} Cr`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(2)} L`;
    return `₹${value}`;
  };

  const formatVolume = (volume: string): string => {
    if (!volume) return 'N/A';
    const value = parseFloat(volume);
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}L`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  };

  const handleWatchlistToggle = () => {
    if (!stockData) return;
    
    const defaultWatchlist = getDefaultWatchlist();
    if (!defaultWatchlist) return;
    
    if (isWatchlisted) {
      removeStockFromWatchlist(defaultWatchlist.id, stockData.symbol);
    } else {
      const stockToAdd = {
        symbol: stockData.symbol,
        name: stockData.name,
        price: stockData.price,
        change: stockData.changePercent,
        isPositive: stockData.isPositive,
        icon: 'business',
      };
      addStockToWatchlist(defaultWatchlist.id, stockToAdd);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stock Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Loading stock details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stockData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stock Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load stock details</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getSectorIcon = (sector: string): keyof typeof MaterialIcons.glyphMap => {
    const sectorIconMap: { [key: string]: keyof typeof MaterialIcons.glyphMap } = {
      'Technology': 'computer',
      'Information Technology': 'computer',
      'Financial Services': 'account-balance',
      'Healthcare': 'local-hospital',
      'Energy': 'bolt',
      'Consumer Discretionary': 'shopping-cart',
      'Consumer Staples': 'store',
      'Industrials': 'precision-manufacturing',
      'Communication Services': 'phone',
      'Utilities': 'flash-on',
      'Real Estate': 'home',
      'Materials': 'build',
    };
    return sectorIconMap[sector] || 'business';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stockData.symbol} Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stock Info Card */}
        <View style={styles.stockInfoCard}>
          <View style={styles.stockHeader}>
            <View style={styles.stockIcon}>
              <MaterialIcons name={getSectorIcon(stockData.sector)} size={24} color="#11B981" />
            </View>
            <View style={styles.stockTitleSection}>
              <Text style={styles.stockSymbol}>{stockData.symbol}</Text>
              <Text style={styles.stockName}>{stockData.name}</Text>
            </View>
          </View>
          
          <View style={styles.priceSection}>
            <Text style={styles.currentPrice}>₹{stockData.price}</Text>
            <View style={styles.changeContainer}>
              <Text style={[styles.changeText, { color: stockData.isPositive ? Colors.light.success : Colors.light.danger }]}>
                {stockData.changePercent}
              </Text>
              <Text style={[styles.changeAmount, { color: stockData.isPositive ? Colors.light.success : Colors.light.danger }]}>
                ₹{stockData.change}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Price Chart</Text>
          <View style={styles.chartPlaceholder}>
            {chartData.length > 0 ? (
              <>
                <View style={styles.chartLine} />
                <View style={styles.chartPoint}>
                  <Text style={styles.chartPointText}>
                    {new Date(chartData[chartData.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.chartPointValue}>
                    ₹{chartData[chartData.length - 1]?.price?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.chartInfo}>
                  <Text style={styles.chartInfoText}>
                    {chartData.length} day trend • {(chartData[0]?.price || 0) > (chartData[chartData.length - 1]?.price || 0) ? 'Declining' : 'Rising'}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.chartLine} />
            )}
          </View>
          
          {/* Timeframe Selector */}
          <View style={styles.timeframeContainer}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe && styles.timeframeTextActive
                ]}>
                  {timeframe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Company Info */}
        <View style={styles.companyInfoContainer}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sector</Text>
            <Text style={styles.infoValue}>{stockData.sector}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Industry</Text>
            <Text style={styles.infoValue}>{stockData.industry}</Text>
          </View>
          {stockData.description && stockData.description !== 'No description available' && (
            <View style={styles.descriptionSection}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.descriptionText} numberOfLines={4}>
                {stockData.description}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {stockData.description && stockData.description !== 'No description available' && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {stockData.description}
            </Text>
          </View>
        )}

        {/* Market Data Cards */}
        <View style={styles.marketDataSection}>
          <View style={styles.marketDataGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Market Cap</Text>
              <Text style={styles.metricValue}>{stockData.marketCap}</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Volume</Text>
              <Text style={styles.metricValue}>{stockData.volume}</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>P/E Ratio</Text>
              <Text style={styles.metricValue}>{stockData.peRatio}x</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Day Range</Text>
              <Text style={styles.metricValue}>{stockData.dayRange}</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>52W High</Text>
              <Text style={styles.metricValue}>₹{stockData.weekHigh52}</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>52W Low</Text>
              <Text style={styles.metricValue}>₹{stockData.weekLow52}</Text>
            </View>
          </View>
        </View>

        {/* Add to Watchlist Button */}
        <TouchableOpacity 
          style={[styles.watchlistButton, isWatchlisted && styles.watchlistButtonActive]} 
          onPress={handleWatchlistToggle}
        >
          <Text style={[styles.watchlistButtonText, isWatchlisted && styles.watchlistButtonTextActive]}>
            {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>
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
    borderBottomColor: '#E6F4F8',
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
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.danger,
    fontFamily: FontFamily.regular,
  },
  stockInfoCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(230, 247, 242, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stockTitleSection: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  stockName: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  changeAmount: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  chartPlaceholder: {
    height: 160,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLine: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#11B981',
    borderRadius: 1,
  },
  chartPoint: {
    position: 'absolute',
    bottom: 20,
    left: 60,
    backgroundColor: '#11B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chartPointText: {
    fontSize: 12,
    color: 'white',
    fontFamily: FontFamily.regular,
  },
  chartPointValue: {
    fontSize: 14,
    color: 'white',
    fontFamily: FontFamily.bold,
  },
  chartInfo: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  chartInfoText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  timeframeButtonActive: {
    backgroundColor: '#11B981',
  },
  timeframeText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
  timeframeTextActive: {
    color: 'white',
    fontFamily: FontFamily.bold,
  },
  companyInfoContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    fontFamily: FontFamily.bold,
    textAlign: 'right',
    flex: 1,
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    marginTop: 8,
  },
  descriptionContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  marketDataSection: {
    marginBottom: 16,
  },
  marketDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 16,
    color: Colors.light.textPrimary,
    fontFamily: FontFamily.bold,
  },
  watchlistButton: {
    backgroundColor: '#11B981',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 32,
  },
  watchlistButtonActive: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: '#11B981',
  },
  watchlistButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  watchlistButtonTextActive: {
    color: '#11B981',
  },
}); 