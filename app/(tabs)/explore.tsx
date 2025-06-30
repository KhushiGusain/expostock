import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';

export default function WatchlistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watchlist</Text>
      </View>

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialIcons name="bookmark-border" size={64} color={Colors.light.primary} />
        </View>
        <Text style={styles.emptyTitle}>No Watchlists Yet</Text>
        <Text style={styles.emptyDescription}>
          Start tracking your favorite stocks by adding them to your watchlist from the home screen.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F4F8',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
