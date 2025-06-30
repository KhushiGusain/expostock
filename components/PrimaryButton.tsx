import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FontFamily } from '@/constants/Fonts';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'filled' | 'outline';
}

export function PrimaryButton({ 
  title, 
  onPress, 
  disabled = false, 
  style, 
  textStyle, 
  variant = 'filled' 
}: PrimaryButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'filled' ? styles.filledButton : styles.outlineButton,
    disabled && styles.disabledButton,
    style,
  ];

  const titleStyle = [
    styles.buttonText,
    variant === 'filled' ? styles.filledButtonText : styles.outlineButtonText,
    disabled && styles.disabledButtonText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  filledButton: {
    backgroundColor: Colors.light.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
    borderColor: Colors.light.border,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  filledButtonText: {
    color: 'white',
  },
  outlineButtonText: {
    color: Colors.light.primary,
  },
  disabledButtonText: {
    color: Colors.light.textTertiary,
  },
}); 