import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { apiService, formatSearchResult, SearchResult } from '@/services/api';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';

interface FormattedSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
  matchScore: number;
  icon: string;
}

interface SearchBoxProps {
  placeholder?: string;
  onResultSelect?: (result: FormattedSearchResult) => void;
}

export function SearchBox({ placeholder = "Search stocks...", onResultSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FormattedSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Debounced search function
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 1) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query.trim());
      }, 300); // 300ms debounce
    } else {
      setResults([]);
      setShowResults(false);
      setError(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.searchStocks(searchQuery);
      
      if (response.bestMatches && response.bestMatches.length > 0) {
        const formattedResults = response.bestMatches
          .slice(0, 8) // Limit to 8 results
          .map(formatSearchResult)
          .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score
        
        setResults(formattedResults);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResultPress = (result: FormattedSearchResult) => {
    setQuery(result.symbol);
    setShowResults(false);
    Keyboard.dismiss();
    
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // Default behavior: navigate to stock details
      router.push(`/stock-details?symbol=${result.symbol}`);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
    inputRef.current?.focus();
  };

  const renderSearchResult = ({ item }: { item: FormattedSearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultIconContainer}>
        <MaterialIcons 
          name={item.icon as keyof typeof MaterialIcons.glyphMap} 
          size={24} 
          color={Colors.light.tint}
        />
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultSymbol}>{item.symbol}</Text>
        <Text style={styles.resultName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.resultDetails}>
          {item.type} • {item.region} • {item.currency}
        </Text>
      </View>
      <View style={styles.resultScoreContainer}>
        <Text style={styles.resultScore}>
          {Math.round(item.matchScore * 100)}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyResults = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search-off" size={32} color={Colors.light.textSecondary} />
      <Text style={styles.emptyText}>No stocks found for "{query}"</Text>
      <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <MaterialIcons name="search" size={20} color="#9CA3AF" />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => {
            if (results.length > 0) {
              handleResultPress(results[0]);
            }
          }}
        />
        {loading && (
          <ActivityIndicator size="small" color={Colors.light.tint} />
        )}
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClearSearch}>
            <MaterialIcons name="clear" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color={Colors.light.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => `${item.symbol}-${index}`}
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyResults()
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 999998,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    gap: 12,
    zIndex: 999998,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.textPrimary,
    fontFamily: FontFamily.regular,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4F8',
    marginTop: 4,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 1000,
    zIndex: 999999,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultSymbol: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  resultName: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  resultDetails: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  resultScoreContainer: {
    alignItems: 'flex-end',
  },
  resultScore: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
    color: Colors.light.tint,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.textTertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.light.danger,
  },
}); 