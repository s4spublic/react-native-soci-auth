import React, { useMemo, useCallback, useRef } from 'react';
import {
  Pressable,
  View,
  Text,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type {
  ProviderName,
  ButtonVariant,
  ThemeConfig,
  AnalyticsEvent,
  SocialButtonProps,
} from '../types';
import {
  DEFAULT_THEME,
  DEFAULT_LABELS,
  DEFAULT_BUTTON_VARIANT,
  SIZE_HEIGHT,
  SIZE_FONT,
  SIZE_ICON,
  SIZE_PADDING_H,
  SHAPE_RADIUS,
} from '../defaults';
import { useSociAuth } from '../hooks/useSociAuth';
import { GoogleIcon } from '../icons/GoogleIcon';
import { AppleIcon } from '../icons/AppleIcon';
import { FacebookIcon } from '../icons/FacebookIcon';
import { GitHubIcon } from '../icons/GitHubIcon';

// ─── Default Provider Icons ──────────────────────────────────────

const DEFAULT_ICONS: Record<ProviderName, React.FC<{ size: number; color?: string }>> = {
  google: GoogleIcon,
  apple: AppleIcon,
  facebook: FacebookIcon,
  github: GitHubIcon,
};

// ─── Icon Position → flexDirection mapping ───────────────────────

const ICON_POSITION_FLEX: Record<string, ViewStyle['flexDirection']> = {
  left: 'row',
  right: 'row-reverse',
  top: 'column',
};

// ─── Content Alignment → justifyContent mapping ─────────────────

const ALIGNMENT_JUSTIFY: Record<string, ViewStyle['justifyContent']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

// ─── Default hover fill color ────────────────────────────────────

const DEFAULT_HOVER_FILL_COLOR = '#6366f1';

// ─── Animation duration ──────────────────────────────────────────

const PRESS_ANIM_DURATION = 150;

// react-native-web does not support useNativeDriver
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

// ─── Component ───────────────────────────────────────────────────

const SocialButtonInner: React.FC<SocialButtonProps> = ({
  provider,
  label,
  icon,
  variant,
  theme,
  sizeScale = 1,
  enable3DDepth = false,
  enableHoverFill = false,
  hoverFillColor,
  contentAlignment,
  onClick,
  disabled = false,
  buttonTextColor,
  style,
}) => {
  // Try to get context — may be null if used standalone
  let contextValue: ReturnType<typeof useSociAuth> | null = null;
  try {
    contextValue = useSociAuth();
  } catch {
    // Used outside SociAuthProvider — that's fine for standalone usage
  }

  // ── Animation refs ────────────────────────────────────────────
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

  // Resolve theme values
  const resolvedTheme = useMemo<ThemeConfig>(() => {
    const base = contextValue?.theme ?? DEFAULT_THEME;
    if (!theme) return base;
    return {
      ...base,
      ...theme,
      colors: theme.colors ? { ...base.colors, ...theme.colors } : base.colors,
      button: theme.button ? { ...base.button, ...theme.button } : base.button,
      glass: theme.glass ? { ...base.glass, ...theme.glass } : base.glass,
      motion: theme.motion ? { ...base.motion, ...theme.motion } : base.motion,
      spacing: theme.spacing ? { ...base.spacing, ...theme.spacing } : base.spacing,
      radius: theme.radius ? { ...base.radius, ...theme.radius } : base.radius,
    };
  }, [contextValue?.theme, theme]);

  const resolvedVariant: ButtonVariant =
    variant ?? contextValue?.config?.buttonVariant ?? DEFAULT_BUTTON_VARIANT;
  const resolvedLabel = label ?? DEFAULT_LABELS[provider];

  const shape = resolvedTheme.button.shape;
  const iconPosition = resolvedTheme.button.iconPosition;
  const size = resolvedTheme.button.size;

  // Analytics helper
  const emitAnalytics = useCallback(
    (interactionType: AnalyticsEvent['interactionType']) => {
      const analyticsHook = contextValue?.config?.behavior?.analytics?.hook;
      if (analyticsHook) {
        analyticsHook({
          provider,
          interactionType,
          timestamp: Date.now(),
        });
      }
    },
    [contextValue?.config?.behavior?.analytics?.hook, provider],
  );

  // Press handler
  const handlePress = useCallback(() => {
    if (disabled) return;
    emitAnalytics('click');
    if (onClick) {
      onClick();
    } else if (contextValue?.triggerOAuth) {
      contextValue.triggerOAuth(provider);
    }
  }, [disabled, emitAnalytics, onClick, contextValue, provider]);

  // ── Press-in / press-out animation handlers ───────────────────
  const handlePressIn = useCallback(() => {
    if (disabled) return;

    if (enable3DDepth) {
      Animated.timing(tiltAnim, {
        toValue: 1,
        duration: PRESS_ANIM_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }

    if (enableHoverFill) {
      Animated.timing(fillAnim, {
        toValue: 1,
        duration: PRESS_ANIM_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  }, [disabled, enable3DDepth, enableHoverFill, tiltAnim, fillAnim]);

  const handlePressOut = useCallback(() => {
    if (enable3DDepth) {
      Animated.timing(tiltAnim, {
        toValue: 0,
        duration: PRESS_ANIM_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }

    if (enableHoverFill) {
      Animated.timing(fillAnim, {
        toValue: 0,
        duration: PRESS_ANIM_DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  }, [enable3DDepth, enableHoverFill, tiltAnim, fillAnim]);

  // Apply uniform scale to all size dimensions
  const height = Math.round(SIZE_HEIGHT[size] * sizeScale);
  const iconSize = Math.round(SIZE_ICON[size] * sizeScale);
  const fontSize = Math.round(SIZE_FONT[size] * sizeScale);
  const paddingH = Math.round(SIZE_PADDING_H[size] * sizeScale);

  // Render icon — Apple/GitHub use monochrome paths that must flip to white in dark mode
  const iconColor = resolvedTheme.mode === 'dark' ? '#ffffff' : '#000000';
  const renderedIcon = useMemo(() => {
    if (icon) return icon;
    const DefaultIcon = DEFAULT_ICONS[provider];
    return <DefaultIcon size={iconSize} color={iconColor} />;
  }, [icon, provider, iconSize, iconColor]);

  // Determine what to show based on variant
  const showIcon = resolvedVariant !== 'text-only';
  const showLabel = resolvedVariant !== 'icon-only';
  const isIconOnly = resolvedVariant === 'icon-only';

  // Build dynamic styles
  const buttonStyle = useMemo<ViewStyle>(() => {
    const { glass, colors, mode } = resolvedTheme;
    const isDark = mode === 'dark';
    // Light: slate-gray — visible on white/any background.
    // Dark: navy-slate — distinct dark button surface.
    // No elevation: Android elevation on semi-transparent bg causes a glow artifact.
    const glassBase = isDark ? '35, 38, 58' : '209, 213, 226';
    const buttonOpacity = isDark ? Math.min(glass.opacity + 0.25, 0.9) * 0.7 : glass.opacity * 0.7;

    const base: ViewStyle = {
      borderRadius: SHAPE_RADIUS[shape],
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: `rgba(${glassBase}, ${buttonOpacity})`,
      opacity: disabled ? 0.5 : 1,
      overflow: 'hidden',
    };

    // For icon-only, make button square
    if (isIconOnly) {
      base.width = height;
      base.height = height;
    }

    return base;
  }, [resolvedTheme, height, shape, isIconOnly, disabled]);

  // Inner content layout style
  const contentStyle = useMemo<ViewStyle>(() => ({
    flexDirection: ICON_POSITION_FLEX[iconPosition] ?? 'row',
    alignItems: 'center',
    justifyContent: ALIGNMENT_JUSTIFY[contentAlignment ?? 'center'] ?? 'center',
    gap: iconPosition === 'top' ? 4 : 8,
    height,
    paddingHorizontal: isIconOnly ? 0 : paddingH,
  }), [iconPosition, contentAlignment, height, isIconOnly, paddingH]);

  const defaultLabelColor = resolvedTheme.mode === 'dark' ? '#ffffff' : resolvedTheme.colors.text;
  const labelStyle = useMemo<TextStyle>(() => ({
    fontSize,
    fontWeight: '500',
    color: buttonTextColor ?? defaultLabelColor,
    lineHeight: fontSize * 1.2,
  }), [fontSize, buttonTextColor, defaultLabelColor]);

  // ── 3D tilt transform ─────────────────────────────────────────
  const tiltTransform = enable3DDepth
    ? {
        transform: [
          { perspective: 800 },
          {
            rotateX: tiltAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '3deg'],
            }),
          },
          {
            rotateY: tiltAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-3deg'],
            }),
          },
        ],
      }
    : undefined;

  // ── Fill overlay color ────────────────────────────────────────
  const resolvedFillColor = hoverFillColor ?? DEFAULT_HOVER_FILL_COLOR;

  return (
    <Animated.View style={[buttonStyle, tiltTransform, style]}>
      <Pressable
        accessibilityLabel={resolvedLabel}
        accessibilityRole="button"
        disabled={disabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={contentStyle}
      >
        {/* Fill overlay — rendered behind content */}
        {enableHoverFill && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: resolvedFillColor,
                opacity: fillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.15],
                }),
                transform: [
                  {
                    scaleX: fillAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        {showIcon && (
          <View style={styles.iconContainer}>
            {renderedIcon}
          </View>
        )}
        {showLabel && (
          <Text style={labelStyle}>{resolvedLabel}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

SocialButtonInner.displayName = 'SocialButton';

export const SocialButton = React.memo(SocialButtonInner);

// ─── Static Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
