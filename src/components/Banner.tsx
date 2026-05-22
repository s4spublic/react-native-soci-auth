import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type { ThemeConfig, BannerProps } from '../types';
import { DEFAULT_THEME } from '../defaults';
import { useSociAuth } from '../hooks/useSociAuth';

// ─── Constants ───────────────────────────────────────────────────

const DEFAULT_DURATION = 5000;

// ─── Component ───────────────────────────────────────────────────

const BannerInner: React.FC<BannerProps> = ({
  type,
  message,
  duration,
  onDismiss,
  style,
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Try to get context — may be null if used standalone
  let contextTheme: ThemeConfig | null = null;
  try {
    const ctx = useSociAuth();
    contextTheme = ctx.theme;
  } catch {
    // Used outside SociAuthProvider — fall back to defaults
  }

  const resolvedTheme = contextTheme ?? DEFAULT_THEME;

  // Mount animation: fade in + slight downward translation
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: resolvedTheme.motion.duration,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [animValue, resolvedTheme.motion.duration]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    const ms = duration ?? DEFAULT_DURATION;
    const timer = setTimeout(handleDismiss, ms);
    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  const isSuccess = type === 'success';
  const bannerColor = isSuccess
    ? resolvedTheme.colors.success
    : resolvedTheme.colors.error;

  const bannerStyle = useMemo<ViewStyle>(() => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: resolvedTheme.spacing.sm,
      paddingHorizontal: resolvedTheme.spacing.md,
      borderRadius: resolvedTheme.radius.md,
      borderWidth: 1,
      borderColor: bannerColor,
      // Background tint with low opacity
      backgroundColor: bannerColor + '1A', // ~10% opacity hex suffix
    };
  }, [resolvedTheme, bannerColor]);

  const messageStyle = useMemo<TextStyle>(
    () => ({
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: resolvedTheme.colors.text,
    }),
    [resolvedTheme.colors.text],
  );

  const animatedStyle = {
    opacity: animValue,
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-4, 0],
        }),
      },
    ],
  };

  if (dismissed) {
    return null;
  }

  return (
    <Animated.View
      style={[bannerStyle, animatedStyle, style]}
      accessibilityRole="alert"
    >
      <Text style={messageStyle}>{message}</Text>
      <Pressable
        onPress={handleDismiss}
        accessibilityLabel="Dismiss banner"
        style={styles.dismissButton}
      >
        <Text style={[styles.dismissText, { color: resolvedTheme.colors.textSecondary }]}>
          ✕
        </Text>
      </Pressable>
    </Animated.View>
  );
};

BannerInner.displayName = 'Banner';

export const Banner = React.memo(BannerInner);

// ─── Static Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  dismissButton: {
    padding: 4,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 16,
    lineHeight: 16,
  },
});
