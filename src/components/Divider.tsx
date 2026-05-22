import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type { ThemeConfig, DividerProps } from '../types';
import { DEFAULT_THEME } from '../defaults';
import { useSociAuth } from '../hooks/useSociAuth';

// ─── Component ───────────────────────────────────────────────────

const DividerInner: React.FC<DividerProps> = ({ label, direction, style }) => {
  // Try to get context — may be null if used standalone
  let contextTheme: ThemeConfig | null = null;
  try {
    const ctx = useSociAuth();
    contextTheme = ctx.theme;
  } catch {
    // Used outside SociAuthProvider — fall back to defaults
  }

  const resolvedTheme = contextTheme ?? DEFAULT_THEME;

  // 'horizontal' direction = compact separator for horizontal button layouts (vertical line)
  // 'vertical' or unspecified = horizontal line with optional centered label
  const isCompact = direction === 'horizontal';

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      flexDirection: isCompact ? 'column' : 'row',
      alignItems: 'center',
      alignSelf: isCompact ? undefined : 'stretch',
    }),
    [isCompact],
  );

  const lineColor = resolvedTheme.colors.border;
  const lineOpacity = resolvedTheme.mode === 'dark' ? 0.4 : 0.6;

  const horizontalLineStyle = useMemo<ViewStyle>(
    () => ({
      flex: 1,
      height: 1,
      backgroundColor: lineColor,
      opacity: lineOpacity,
    }),
    [lineColor, lineOpacity],
  );

  const verticalLineStyle = useMemo<ViewStyle>(
    () => ({
      width: 1,
      flex: 1,
      backgroundColor: lineColor,
      opacity: lineOpacity,
    }),
    [lineColor, lineOpacity],
  );

  const labelStyle = useMemo<TextStyle>(
    () => ({
      paddingHorizontal: isCompact ? 4 : resolvedTheme.spacing.md,
      paddingVertical: isCompact ? 4 : 0,
      fontSize: 13,
      fontWeight: '400',
      color: resolvedTheme.colors.textSecondary,
    }),
    [isCompact, resolvedTheme.spacing.md, resolvedTheme.colors.textSecondary],
  );

  return (
    <View
      style={[containerStyle, style]}
      accessibilityRole="none"
      accessible={true}
      accessibilityLabel="separator"
    >
      {isCompact ? (
        <>
          {label && <Text style={labelStyle}>{label}</Text>}
        </>
      ) : (
        <>
          <View style={horizontalLineStyle} />
          {label && <Text style={labelStyle}>{label}</Text>}
          {label && <View style={horizontalLineStyle} />}
        </>
      )}
    </View>
  );
};

DividerInner.displayName = 'Divider';

export const Divider = React.memo(DividerInner);
