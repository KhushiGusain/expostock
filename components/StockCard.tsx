import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';

interface StockCardProps {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}

export function StockCard({ symbol, name, price, change, isPositive, icon, onPress }: StockCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(230, 247, 242, 0.5)' }]}>
          <MaterialIcons name={icon} size={20} color="#11B981" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <View style={styles.priceSection}>
          <Text style={styles.price}>${price}</Text>
          <View style={[styles.changeContainer, { backgroundColor: isPositive ? '#DCFCE7' : '#FEE2E2' }]}>
            <Text style={[styles.change, { color: isPositive ? Colors.light.success : Colors.light.danger }]}>
              {change}
            </Text>
            <MaterialIcons 
              name={isPositive ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={16} 
              color={isPositive ? Colors.light.success : Colors.light.danger} 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getIconBackgroundColor(iconName: keyof typeof MaterialIcons.glyphMap): string {
  const colorMap: { [key: string]: string } = {
    'laptop': '#3B82F6', // Blue for tech
    'directions-car': '#06B6D4', // Cyan for automotive
    'account-balance': '#8B5CF6', // Purple for banks
    'emoji-events': '#F59E0B', // Amber for awards/performance
    'business': '#6B7280', // Gray for general
  };
  return colorMap[iconName] || '#6B7280';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E6F4F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: FontFamily.regular,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
}); 