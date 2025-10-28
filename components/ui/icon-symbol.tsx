// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  // Dashboard & Analytics icons
  'chart.bar.fill': 'bar-chart',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'chart.pie.fill': 'pie-chart',
  'star.fill': 'star',
  'star': 'star-border',
  'flame.fill': 'trending-up',
  'trophy.fill': 'emoji-events',
  // Social media app icons
  'person.circle': 'person',
  'person.circle.fill': 'account-circle',
  'person.fill': 'person',
  'person.2.fill': 'people',
  'person.3.fill': 'group',
  'gear': 'settings',
  'gearshape.fill': 'settings',
  'rectangle.stack': 'dynamic-feed',
  'rectangle.stack.fill': 'view-list',
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
  'message': 'chat-bubble-outline',
  'message.fill': 'chat',
  'plus.circle': 'add-circle',
  'plus.circle.fill': 'add-circle',
  'magnifyingglass': 'search',
  'lock.shield': 'security',
  'bell': 'notifications',
  'paintbrush': 'palette',
  'globe': 'public',
  'internaldrive': 'storage',
  'questionmark.circle': 'help',
  'envelope': 'email',
  'info.circle': 'info',
  'camera.fill': 'camera-alt',
  'camera': 'camera-alt',
  'bolt': 'flash-on',
  'timer': 'timer',
  'camera.filters': 'filter',
  'photo.on.rectangle': 'photo-library',
  'arrow.triangle.2.circlepath.camera': 'flip-camera-ios',
  // Share and interaction icons
  'square.and.arrow.up': 'share',
  'ellipsis': 'more-horiz',
  'bookmark': 'bookmark-border',
  'bookmark.fill': 'bookmark',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
