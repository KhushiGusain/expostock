import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';

interface CacheIndicatorProps {
  isFromCache: boolean;
  lastUpdated?: Date;
  style?: any;
}

export default function CacheIndicator({ isFromCache, lastUpdated, style }: CacheIndicatorProps) {
  if (!isFromCache && !lastUpdated) return null;

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons 
        name={isFromCache ? "cached" : "refresh"} 
        size={12} 
        color={isFromCache ? "#F59E0B" : "#10B981"} 
      />
      <Text style={styles.text}>
        {isFromCache ? "Cached" : "Live"}
        {lastUpdated && ` • ${formatTimeAgo(lastUpdated)}`}
      </Text>
    </View>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontFamily: FontFamily.regular,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
});