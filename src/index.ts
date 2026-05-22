// react-native-soci-auth - Social Authentication UI Library for React Native

// Guards (library boundary utilities)
export { UNSUPPORTED_FEATURES, warnUnsupported } from './guards';
export type { UnsupportedFeature } from './guards';

// Defaults and constants
export {
  DEFAULT_THEME,
  DARK_THEME_COLORS,
  DARK_GLASS_SHADOW,
  DEFAULT_LAYOUT,
  DEFAULT_BEHAVIOR,
  DEFAULT_BUTTON_VARIANT,
  DEFAULT_LABELS,
  SIZE_HEIGHT,
  SIZE_FONT,
  SIZE_ICON,
  SIZE_PADDING_H,
  SHAPE_RADIUS,
} from './defaults';

// Engine — ConfigMerger
export { mergeConfig, resolveProviderConfig, validateConfig } from './engine/ConfigMerger';

// Engine — ThemeEngine
export { resolveTokens, getDefaultTheme } from './engine/ThemeEngine';

// Engine — OAuthEngine
export { buildAuthUrl, initiateFlow, handleCallback } from './engine/OAuthEngine';

// Context
export { SociAuthProvider } from './context/SociAuthProvider';
export type { SociAuthProviderProps } from './context/SociAuthProvider';
export { SociAuthContext } from './context/SociAuthContext';
export type { SociAuthContextValue } from './context/SociAuthContext';

// Hooks
export { useSociAuth } from './hooks/useSociAuth';

// Types
export type {
  ProviderName,
  ButtonVariant,
  ButtonShape,
  IconPosition,
  ButtonSize,
  ThemeMode,
  Alignment,
  ProviderConfig,
  ThemeConfig,
  LayoutConfig,
  BehaviorConfig,
  LogEvent,
  AnalyticsEvent,
  SociAuth_Config,
  ProviderResponse,
  OAuthError,
  OAuthResult,
  ResolvedProviderConfig,
  ResolvedSociAuthConfig,
  ProviderState,
  ValidationResult,
  ValidationWarning,
  SociAuthComponentProps,
  SocialButtonProps,
  AuthCardProps,
  DividerProps,
  BannerProps,
} from './types';

// Components
export { SociAuthComponent } from './components/SociAuthComponent';
export { SocialButton } from './components/SocialButton';
export { AuthCard } from './components/AuthCard';
export { Divider } from './components/Divider';
export { Banner } from './components/Banner';

// Icons
export { GoogleIcon } from './icons/GoogleIcon';
export { AppleIcon } from './icons/AppleIcon';
export { FacebookIcon } from './icons/FacebookIcon';
export { GitHubIcon } from './icons/GitHubIcon';
