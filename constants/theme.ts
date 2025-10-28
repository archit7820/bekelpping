/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#007AFF'; // iOS blue
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#F2F2F7', // iOS light gray background
    cardBackground: '#FFFFFF',
    tint: tintColorLight,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    border: '#C6C6C8',
    separator: '#E5E5EA',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    cardBackground: '#1C1C1E',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    border: '#38383A',
    separator: '#38383A',
  },
};

// Impact Score color gradients (0-40 red, 40-70 orange, 70-100 green)
export const ImpactColors = {
  low: {
    start: '#FF3B30', // iOS red
    end: '#FF6B6B',
  },
  medium: {
    start: '#FF9500', // iOS orange
    end: '#FFB340',
  },
  high: {
    start: '#30D158', // iOS green
    end: '#32D74B',
  },
  gradient: (score: number) => {
    if (score <= 40) return ImpactColors.low;
    if (score <= 70) return ImpactColors.medium;
    return ImpactColors.high;
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
