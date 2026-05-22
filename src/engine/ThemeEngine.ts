import type { ThemeConfig, ThemeMode } from '../types';
import { DEFAULT_THEME, DARK_THEME_COLORS, DARK_GLASS_SHADOW } from '../defaults';

/**
 * Dark mode glass settings (gradient differs from light mode).
 */
const DARK_GLASS: ThemeConfig['glass'] = {
  blur: DEFAULT_THEME.glass.blur,
  opacity: DEFAULT_THEME.glass.opacity,
  gradient: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)'],
  shadow: { ...DARK_GLASS_SHADOW },
};

/**
 * Returns a complete default ThemeConfig for the given mode.
 * All values are React Native StyleSheet-compatible (numeric spacing, radius, etc.).
 */
export function getDefaultTheme(mode: ThemeMode): ThemeConfig {
  if (mode === 'dark') {
    return {
      ...DEFAULT_THEME,
      mode: 'dark',
      colors: { ...DARK_THEME_COLORS },
      glass: { ...DARK_GLASS, shadow: { ...DARK_GLASS.shadow } },
    };
  }
  return {
    ...DEFAULT_THEME,
    colors: { ...DEFAULT_THEME.colors },
    glass: { ...DEFAULT_THEME.glass, shadow: { ...DEFAULT_THEME.glass.shadow } },
  };
}

/**
 * Deep-merges a partial consumer theme with the appropriate mode defaults,
 * producing a fully resolved ThemeConfig.
 *
 * Each section (colors, spacing, radius, glass, motion, button) is deep-merged
 * so that individual token overrides within a section are preserved alongside defaults.
 * glass.shadow is an object and is deep-merged properly.
 *
 * No CSS output — all values are React Native compatible numbers and strings.
 */
export function resolveTokens(theme: Partial<ThemeConfig>): ThemeConfig {
  const mode = theme.mode ?? DEFAULT_THEME.mode;
  const base = getDefaultTheme(mode);

  return {
    mode,
    colors: theme.colors ? { ...base.colors, ...theme.colors } : { ...base.colors },
    spacing: theme.spacing ? { ...base.spacing, ...theme.spacing } : { ...base.spacing },
    radius: theme.radius ? { ...base.radius, ...theme.radius } : { ...base.radius },
    glass: theme.glass
      ? {
          ...base.glass,
          ...theme.glass,
          shadow: theme.glass.shadow
            ? { ...base.glass.shadow, ...theme.glass.shadow }
            : { ...base.glass.shadow },
        }
      : { ...base.glass, shadow: { ...base.glass.shadow } },
    motion: theme.motion ? { ...base.motion, ...theme.motion } : { ...base.motion },
    button: theme.button ? { ...base.button, ...theme.button } : { ...base.button },
  };
}
