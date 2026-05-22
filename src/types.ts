import type React from 'react';
import type { ViewStyle } from 'react-native';

// ─── Provider Types (identical to web) ────────────────────────────
export type ProviderName = 'google' | 'apple' | 'facebook' | 'github';

export type ButtonVariant = 'text-only' | 'icon-plus-text' | 'icon-only';

export type ButtonShape = 'pill' | 'rounded' | 'square';

export type IconPosition = 'left' | 'right' | 'top';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ThemeMode = 'light' | 'dark';

export type Alignment = 'left' | 'center' | 'right';

// ─── Provider Configuration ──────────────────────────────────────
export interface ProviderConfig {
  name: ProviderName;
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  label?: string;
  icon?: React.ReactNode; // react-native-svg compatible element
  onSuccess?: (response: ProviderResponse) => void;
  onError?: (error: OAuthError) => void;
  theme?: Partial<ThemeConfig>;
  layout?: Partial<LayoutConfig>;
  buttonVariant?: ButtonVariant;
}

// ─── Theme Configuration (numeric values for RN) ─────────────────
export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  glass: {
    blur: number;
    opacity: number;
    gradient: string[];
    shadow: {
      color: string;
      offsetX: number;
      offsetY: number;
      opacity: number;
      radius: number;
      elevation: number;
    };
  };
  motion: {
    duration: number;
    easing: string;
  };
  button: {
    shape: ButtonShape;
    iconPosition: IconPosition;
    size: ButtonSize;
  };
}

// ─── Layout Configuration ────────────────────────────────────────
export interface LayoutConfig {
  alignment: Alignment;
  spacing: number;
  showLabels: boolean;
  showDividers: boolean;
  direction?: 'horizontal' | 'vertical';
}

// ─── Behavior Configuration ──────────────────────────────────────
export interface BehaviorConfig {
  logging?: {
    hook: (event: LogEvent) => void;
  };
  analytics?: {
    hook: (event: AnalyticsEvent) => void;
  };
}

export interface LogEvent {
  provider: ProviderName;
  eventType: 'initiation' | 'success' | 'failure';
  timestamp: number;
}

export interface AnalyticsEvent {
  provider: ProviderName;
  interactionType: 'click' | 'hover' | 'focus';
  timestamp: number;
}

// ─── Unified Config ──────────────────────────────────────────────
export interface SociAuth_Config {
  providers: ProviderConfig[];
  theme?: Partial<ThemeConfig>;
  layout?: Partial<LayoutConfig>;
  behavior?: Partial<BehaviorConfig>;
  buttonVariant?: ButtonVariant;
  /** Uniform scale multiplier for button height, icon, font, and padding. Default 1. */
  buttonSizeScale?: number;
  enable3DDepth?: boolean;
  showCard?: boolean;
  enableHoverFill?: boolean;
  hoverFillColor?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  contentAlignment?: Alignment;
  cardTitleColor?: string;
  cardSubtitleColor?: string;
  buttonTextColor?: string;
}

// ─── Response Types (identical to web) ───────────────────────────
export interface ProviderResponse {
  provider: ProviderName;
  code?: string;
  state?: string;
  rawParams: Record<string, string>;
}

export interface OAuthError {
  provider: ProviderName;
  errorType: string;
  message: string;
}

// ─── OAuthResult ─────────────────────────────────────────────────
export type OAuthResult =
  | { success: true; provider: ProviderName; response: ProviderResponse }
  | { success: false; provider: ProviderName; error: OAuthError };

// ─── Internal Resolved Types ─────────────────────────────────────
export interface ResolvedProviderConfig
  extends Required<Omit<ProviderConfig, 'onSuccess' | 'onError' | 'icon' | 'label'>> {
  label: string;
  icon: React.ReactNode;
  onSuccess?: (response: ProviderResponse) => void;
  onError?: (error: OAuthError) => void;
  resolvedTheme: ThemeConfig;
  resolvedLayout: LayoutConfig;
  resolvedVariant: ButtonVariant;
}

export interface ResolvedSociAuthConfig {
  providers: ResolvedProviderConfig[];
  theme: ThemeConfig;
  layout: LayoutConfig;
  behavior: BehaviorConfig;
  buttonVariant: ButtonVariant;
  buttonSizeScale: number;
  enable3DDepth: boolean;
  showCard: boolean;
  enableHoverFill: boolean;
  hoverFillColor: string;
  cardTitle: string;
  cardSubtitle: string;
  contentAlignment: Alignment;
  cardTitleColor: string;
  cardSubtitleColor: string;
  buttonTextColor: string;
}

// ─── Provider State (identical to web) ───────────────────────────
export interface ProviderState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: OAuthError;
  response?: ProviderResponse;
}

// ─── Validation (identical to web) ───────────────────────────────
export interface ValidationResult {
  valid: boolean;
  warnings: ValidationWarning[];
}

export interface ValidationWarning {
  provider: ProviderName;
  field: string;
  message: string;
}

// ─── Component Prop Types ────────────────────────────────────────
export interface SociAuthComponentProps {
  config?: SociAuth_Config;
  style?: ViewStyle;
}

export interface SocialButtonProps {
  provider: ProviderName;
  label?: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  theme?: Partial<ThemeConfig>;
  layout?: Partial<LayoutConfig>;
  /** Uniform scale multiplier for height, icon, font, and padding. Default 1. */
  sizeScale?: number;
  enable3DDepth?: boolean;
  enableHoverFill?: boolean;
  hoverFillColor?: string;
  contentAlignment?: Alignment;
  onClick?: () => void;
  disabled?: boolean;
  buttonTextColor?: string;
  style?: ViewStyle;
}

export interface AuthCardProps {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

export interface DividerProps {
  label?: string;
  direction?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export interface BannerProps {
  type: 'success' | 'error';
  message: string;
  duration?: number;
  onDismiss?: () => void;
  style?: ViewStyle;
}
