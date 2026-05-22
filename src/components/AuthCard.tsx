import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type { ThemeConfig, AuthCardProps } from '../types';
import { DEFAULT_THEME } from '../defaults';
import { useSociAuth } from '../hooks/useSociAuth';
import { isBlurAvailable, isGradientAvailable } from '../utils/nativeModules';

// ─── Component ───────────────────────────────────────────────────

const AuthCardInner: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  style,
  children,
}) => {
  // Try to get context — may be null if used standalone
  let contextTheme: ThemeConfig | null = null;
  try {
    const ctx = useSociAuth();
    contextTheme = ctx.theme;
  } catch {
    // Used outside SociAuthProvider — fall back to defaults
  }

  const resolvedTheme = contextTheme ?? DEFAULT_THEME;

  // Mount animation
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: resolvedTheme.motion.duration,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [animValue, resolvedTheme.motion.duration]);

  const animatedStyle = {
    opacity: animValue,
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
    ],
  };

  // Card container styles with glassmorphism.
  // Light mode: neutral slate-gray base, readable on white/any background.
  // Dark mode: dark navy base at boosted opacity for a proper dark glass card.
  const cardStyle = useMemo<ViewStyle>(() => {
    const { glass, colors, spacing, radius, mode } = resolvedTheme;
    const isDark = mode === 'dark';
    const glassBase = isDark ? '20, 22, 36' : '209, 213, 226';
    // Dark mode needs higher opacity so the card is visually distinct and legible
    const glassOpacity = isDark ? Math.min(glass.opacity + 0.35, 0.95) : glass.opacity;
    return {
      padding: spacing.xl,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: `rgba(${glassBase}, ${glassOpacity})`,
      overflow: 'hidden',
      // Shadow — iOS only. Android elevation with semi-transparent backgrounds
      // produces a white glow artifact around rounded corners, so we skip it.
      ...(Platform.OS === 'ios' && {
        shadowColor: glass.shadow.color,
        shadowOffset: {
          width: glass.shadow.offsetX,
          height: glass.shadow.offsetY,
        },
        shadowOpacity: glass.shadow.opacity,
        shadowRadius: glass.shadow.radius,
      }),
    };
  }, [resolvedTheme]);

  const titleStyle = useMemo<TextStyle>(
    () => ({
      fontSize: 20,
      fontWeight: '600',
      color: titleColor ?? resolvedTheme.colors.text,
      lineHeight: 26,
    }),
    [titleColor, resolvedTheme.colors.text],
  );

  const subtitleStyle = useMemo<TextStyle>(
    () => ({
      fontSize: 14,
      fontWeight: '400',
      color: subtitleColor ?? resolvedTheme.colors.textSecondary,
      lineHeight: 20,
      marginTop: resolvedTheme.spacing.xs,
    }),
    [subtitleColor, resolvedTheme.colors.textSecondary, resolvedTheme.spacing.xs],
  );

  // Render optional blur backdrop
  const renderBlurBackdrop = () => {
    if (!isBlurAvailable()) return null;
    try {
      const { BlurView } = require('@react-native-community/blur');
      return (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={resolvedTheme.mode === 'dark' ? 'dark' : 'light'}
          blurAmount={resolvedTheme.glass.blur}
        />
      );
    } catch {
      return null;
    }
  };

  // Render optional gradient overlay
  const renderGradientOverlay = () => {
    if (!isGradientAvailable()) return null;
    try {
      const { LinearGradient } = require('expo-linear-gradient');
      return (
        <LinearGradient
          colors={resolvedTheme.glass.gradient}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      );
    } catch {
      return null;
    }
  };

  return (
    <Animated.View style={[cardStyle, animatedStyle, style]}>
      {renderBlurBackdrop()}
      {renderGradientOverlay()}
      {(title || subtitle) && (
        <View style={{ marginBottom: resolvedTheme.spacing.lg }}>
          {title != null && <Text style={titleStyle}>{title}</Text>}
          {subtitle != null && <Text style={subtitleStyle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </Animated.View>
  );
};

AuthCardInner.displayName = 'AuthCard';

export const AuthCard = React.memo(AuthCardInner);
