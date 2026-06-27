# 05 - Developer Guide

This guide explains how to consume the Bloom Design System within the React Native (Expo) frontend.

## 1. Using Design Tokens

The core visual values (colors, spacing, radii) are defined in `design-tokens.json`. 
For TypeScript development, we have mapped these tokens into a usable theme object located at `src/theme/theme.ts`.

### Example Usage in StyleSheet

```typescript
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Bloom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4], // 16px
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
  },
  title: {
    fontSize: theme.typography.sizes.title1,
    fontWeight: theme.typography.weights.bold as 'bold',
    color: theme.colors.textHigh,
  }
});
```

## 2. Dynamic Type & Scaling

To adhere to our accessibility mandate, do not hardcode `allowFontScaling={false}` on Text components unless strictly necessary for UI breaking constraints (e.g., a tiny badge). Rely on standard scaling.

## 3. Dark Mode Support

Currently, `theme.ts` provides a static mapping. To fully implement Dark Mode, you should wrap your app in a Theme Provider Context that listens to the device color scheme:

```typescript
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDarkMode = colorScheme === 'dark';

// Use this boolean to swap between Light and Dark color tokens.
```

## 4. SafeArea Handling

Always wrap top-level screens in `SafeAreaView` from `react-native-safe-area-context` to prevent content from bleeding under the notch, dynamic island, or home indicator.

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen() {
  return <SafeAreaView style={{ flex: 1 }}>...</SafeAreaView>;
}
```
