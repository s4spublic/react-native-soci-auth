import type {
  ThemeConfig,
  LayoutConfig,
  BehaviorConfig,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  ProviderName,
} from './types';

export const DEFAULT_THEME: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: '#6366f1',
    background: 'rgba(209, 213, 226, 0.45)',
    surface: 'rgba(209, 213, 226, 0.3)',
    text: '#1a1a2e',
    textSecondary: '#64748b',
    // Slate-gray border — visible on white, light, dark, and colored backgrounds
    border: 'rgba(148, 163, 184, 0.5)',
    success: '#22c55e',
    error: '#ef4444',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 6, md: 10, lg: 16, full: 9999 },
  glass: {
    blur: 12,
    opacity: 0.45,
    gradient: ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)'],
    shadow: {
      color: '#000000',
      offsetX: 0,
      offsetY: 8,
      opacity: 0.12,
      radius: 32,
      elevation: 8,
    },
  },
  motion: { duration: 200, easing: 'ease-in-out' },
  button: { shape: 'rounded', iconPosition: 'left', size: 'medium' },
};

export const DARK_THEME_COLORS: ThemeConfig['colors'] = {
  primary: '#818cf8',
  background: 'rgba(20, 22, 36, 0.85)',
  surface: 'rgba(35, 38, 58, 0.7)',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.18)',
  success: '#4ade80',
  error: '#f87171',
};

export const DARK_GLASS_SHADOW: ThemeConfig['glass']['shadow'] = {
  color: '#000000',
  offsetX: 0,
  offsetY: 8,
  opacity: 0.3,
  radius: 32,
  elevation: 12,
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  alignment: 'center',
  spacing: 12,
  showLabels: true,
  showDividers: false,
  direction: 'vertical',
};

export const DEFAULT_BEHAVIOR: BehaviorConfig = {};

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'icon-plus-text';

export const DEFAULT_LABELS: Record<ProviderName, string> = {
  google: 'Sign in with Google',
  apple: 'Sign in with Apple',
  facebook: 'Sign in with Facebook',
  github: 'Sign in with GitHub',
};

// ─── Size and Shape Lookup Maps ──────────────────────────────────
export const SIZE_HEIGHT: Record<ButtonSize, number> = {
  small: 32,
  medium: 40,
  large: 48,
};

export const SIZE_FONT: Record<ButtonSize, number> = {
  small: 13,
  medium: 14,
  large: 16,
};

export const SIZE_ICON: Record<ButtonSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

export const SIZE_PADDING_H: Record<ButtonSize, number> = {
  small: 12,
  medium: 16,
  large: 20,
};

export const SHAPE_RADIUS: Record<ButtonShape, number> = {
  pill: 9999,
  rounded: 10,
  square: 0,
};
