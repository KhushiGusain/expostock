/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#11B981'; // Updated green to match the target UI
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#11B981', // Updated main green color
    secondary: '#F9FAFB', // Light gray background
    accent: '#059669', // Darker green for hover states
    success: '#11B981', // Updated green for positive changes
    danger: '#DC2626', // Red for negative changes
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    cardBackground: '#FFFFFF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#11B981',
    secondary: '#1F2937',
    accent: '#059669',
    success: '#11B981',
    danger: '#DC2626',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    border: '#374151',
    cardBackground: '#1F2937',
  },
};
