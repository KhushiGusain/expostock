import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export function Loading({ size = 'large', color = '#10B981', text }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.loadingText}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
}); 