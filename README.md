<p align="center">
  <h1 align="center">react-native-soci-auth</h1>
  <p align="center">
    A premium, glassmorphism-styled social authentication UI library for React Native.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-soci-auth"><img src="https://img.shields.io/npm/v/react-native-soci-auth.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://github.com/s4spublic/react-soci-auth/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/react-native-soci-auth.svg?style=flat-square" alt="license" /></a>
</p>

<p align="center">
  <a href="https://s4spublic.github.io/react-native-soci-auth/" target="_blank" rel="noopener noreferrer">Live Demo</a> · <a href="#quick-start">Quick Start</a> · <a href="#configuration">Configuration</a> · <a href="#oauth-provider-setup">Provider Setup</a>
</p>

---

Drop-in social login buttons for Google, Apple, Facebook, and GitHub in React Native. Glassmorphism styling, dark mode, 3D depth effects, and full TypeScript support. Built for Expo and bare React Native.

> **Also available for React web:** [`react-soci-auth`](https://www.npmjs.com/package/react-soci-auth)

## Features

- 🔐 **OAuth 2.0** via `expo-web-browser` (in-app browser) with `Linking` fallback
- 🎨 **Glassmorphism** design with optional blur, transparency, and gradient effects
- 🌗 **Dark & Light** mode with full color customization
- 🧩 **Multiple button variants** — icon-only, text-only, icon + text
- 📐 **Flexible layouts** — horizontal / vertical, left / center / right alignment
- ✨ **Effects** — 3D depth tilt on press, animated press fill
- 📦 **Tree-shakeable** — import only what you need
- 🔒 **TypeScript-first** — every prop, config, and return type is fully typed
- ♿ **Accessible** — `accessibilityLabel`, `accessibilityRole` on all interactive elements
- 🎯 **Standalone components** — use `SocialButton`, `AuthCard`, `Divider`, or `Banner` independently
- 📱 **Cross-platform** — iOS, Android, and Expo Web

## Install

```bash
npm install react-native-soci-auth
```

### Peer Dependencies

```bash
npm install react-native-svg expo-web-browser
```

| Dependency | Version | Required |
|---|---|---|
| `react` | `>=18.0.0` | Yes |
| `react-native` | `>=0.72.0` | Yes |
| `react-native-svg` | `*` | Yes (icons) |
| `expo-web-browser` | `*` | Yes (OAuth flow) |

Optional dependencies for enhanced glassmorphism:

| Dependency | Purpose |
|---|---|
| `@react-native-community/blur` | Native blur effect on AuthCard |
| `expo-linear-gradient` | Gradient overlay on AuthCard |


## Quick Start

```tsx
import { SociAuthProvider, SociAuthComponent } from 'react-native-soci-auth';
import type { SociAuth_Config, ProviderResponse, OAuthError } from 'react-native-soci-auth';

const config: SociAuth_Config = {
  providers: [
    {
      name: 'google',
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      redirectUri: 'your-app-scheme://callback',
      scopes: ['openid', 'email', 'profile'],
      onSuccess: (response: ProviderResponse) => {
        console.log('Google auth code:', response.code);
        // Send response.code to your backend to exchange for tokens
      },
      onError: (error: OAuthError) => {
        console.error('Google auth failed:', error.message);
      },
    },
    {
      name: 'github',
      clientId: 'YOUR_GITHUB_CLIENT_ID',
      redirectUri: 'your-app-scheme://callback',
      scopes: ['read:user', 'user:email'],
    },
  ],
  theme: { mode: 'dark' },
  buttonVariant: 'icon-plus-text',
  showCard: true,
  cardTitle: 'Welcome Back',
  cardSubtitle: 'Sign in to continue',
};

export default function App() {
  return (
    <SociAuthProvider config={config}>
      <SociAuthComponent />
    </SociAuthProvider>
  );
}
```

## OAuth Flow

react-native-soci-auth uses `expo-web-browser` for the OAuth flow:

1. User presses a social button
2. An in-app browser opens via `WebBrowser.openAuthSessionAsync`
3. User authenticates with the provider
4. Provider redirects back to your `redirectUri` with an authorization code
5. The library parses the redirect URL and fires `onSuccess` / `onError`

If `expo-web-browser` is unavailable, the library falls back to `Linking.openURL`.

### What You Get Back

On success, your `onSuccess` callback receives a `ProviderResponse`:

```ts
interface ProviderResponse {
  provider: ProviderName;              // 'google' | 'apple' | 'facebook' | 'github'
  code?: string;                       // The authorization code
  state?: string;                      // CSRF state parameter
  rawParams: Record<string, string>;   // All query params from the redirect
}
```

On failure, your `onError` callback receives an `OAuthError`:

```ts
interface OAuthError {
  provider: ProviderName;
  errorType: string;    // 'user_cancelled' | 'auth_error' | 'parse_error' | 'browser_unavailable'
  message: string;
}
```

> **Important:** The authorization `code` is a one-time-use token. Send it to your backend server to exchange for access/refresh tokens. Never expose client secrets in your app.


## OAuth Provider Setup

### Redirect URI by Platform

The redirect URI you configure depends on how you're running the app:

| Platform | Redirect URI Format | Example |
|---|---|---|
| Expo Web (dev) | `http://localhost:<port>` | `http://localhost:8081` |
| Expo Web (prod) | `https://your-domain.com` | `https://s4spublic.github.io/react-native-soci-auth` |
| Development Build | `your-scheme://callback` | `myapp://callback` |
| Expo Go | `exp://127.0.0.1:8081/--/callback` | (auto-generated) |

We recommend using `expo-auth-session`'s `makeRedirectUri()` to generate the correct URI per platform:

```tsx
import { makeRedirectUri } from 'expo-auth-session';

const redirectUri = makeRedirectUri({
  scheme: 'myapp',
  path: 'callback',
});
// Development Build: myapp://callback
// Expo Go: exp://127.0.0.1:8081/--/callback
// Web dev: http://localhost:8081/callback
// Web prod: https://yoursite.com/callback
```

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID.

**For Web (Expo Web):**
- Application type: **Web application**
- Authorized redirect URIs: add `http://localhost:8081` (and any other ports Expo uses)
- For production: add your deployed URL (e.g. `https://your-domain.com`)
- Copy the Client ID

**For Android:**
- Application type: **Android**
- Package name: your app's `android.package` from `app.json` (e.g. `com.yourcompany.yourapp`)
- SHA-1 signing certificate: run `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
- Android OAuth clients don't use a redirect URI — Google verifies via package name + SHA-1
- Copy the Client ID (it will be different from the Web client ID)

**For iOS:**
- Application type: **iOS**
- Bundle ID: your app's `ios.bundleIdentifier` from `app.json`
- Copy the Client ID

> **Note:** Google requires separate OAuth client IDs per platform. You can use the same Web client ID for Expo Web and Expo Go during development.

**Recommended scopes:** `openid`, `email`, `profile`

### Apple

> Requires an [Apple Developer Program](https://developer.apple.com/programs/) membership ($99/year).

1. Go to [Apple Developer Portal](https://developer.apple.com/) → Certificates, Identifiers & Profiles → Identifiers.
2. Register an App ID with "Sign in with Apple" capability enabled.
3. Create a Services ID (this is your `clientId`):
   - Enable "Sign in with Apple"
   - Configure domains and return URLs
   - Add your redirect URI (must be HTTPS — Apple does not allow `http://localhost`)
4. For local development, use a tunneling service like [ngrok](https://ngrok.com/) to get an HTTPS URL.

**Recommended scopes:** `name`, `email`

### Facebook

1. Go to [Meta for Developers](https://developers.facebook.com/) → My Apps → Create App.
2. Select **Consumer** app type.
3. Add **Facebook Login** product.
4. Go to Facebook Login → Settings → Valid OAuth Redirect URIs:
   - Add `http://localhost:8081` for Expo Web development
   - Add your production URL
5. Go to Settings → Basic and copy the **App ID** (this is your `clientId`).

**Recommended scopes:** `email`, `public_profile`

### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App.
2. Set the Authorization callback URL:
   - For Expo Web dev: `http://localhost:8081`
   - For production: your deployed URL
3. Copy the **Client ID**.

> GitHub OAuth Apps only support a single callback URL. Create separate OAuth Apps for dev and production if needed.

**Recommended scopes:** `read:user`, `user:email`

### Quick Reference

| Provider | Console | Client ID Field | localhost OK? | HTTPS Required? |
|---|---|---|---|---|
| Google | [console.cloud.google.com](https://console.cloud.google.com/) | Client ID (per platform) | Yes (Web type) | No (localhost exempt) |
| Apple | [developer.apple.com](https://developer.apple.com/) | Services ID | No | Yes (always) |
| Facebook | [developers.facebook.com](https://developers.facebook.com/) | App ID | Yes | No (dev only) |
| GitHub | [github.com/settings/developers](https://github.com/settings/developers) | Client ID | Yes | No |


## Configuration

### SociAuth_Config

The top-level configuration object passed to `<SociAuthProvider>`.

| Property | Type | Default | Description |
|---|---|---|---|
| `providers` | `ProviderConfig[]` | *required* | Array of OAuth provider configurations |
| `theme` | `Partial<ThemeConfig>` | — | Global theme overrides |
| `layout` | `Partial<LayoutConfig>` | — | Global layout overrides |
| `behavior` | `Partial<BehaviorConfig>` | — | Behavioral settings (logging, analytics) |
| `buttonVariant` | `ButtonVariant` | `'icon-plus-text'` | Default button display style |
| `enable3DDepth` | `boolean` | `false` | Enable 3D tilt effect on press |
| `showCard` | `boolean` | `true` | Wrap buttons in a card container |
| `enableHoverFill` | `boolean` | `false` | Enable animated press fill |
| `hoverFillColor` | `string` | `'#6366f1'` | Color used for press fill animation |
| `cardTitle` | `string` | `''` | Title displayed in the auth card |
| `cardSubtitle` | `string` | `''` | Subtitle displayed in the auth card |
| `contentAlignment` | `Alignment` | `'center'` | Alignment of button content |
| `cardTitleColor` | `string` | `'#ffffff'` | Card title text color |
| `cardSubtitleColor` | `string` | `'rgba(255,255,255,0.7)'` | Card subtitle text color |
| `buttonTextColor` | `string` | `''` | Override button text color |

### ProviderConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `name` | `ProviderName` | *required* | `'google'` \| `'apple'` \| `'facebook'` \| `'github'` |
| `clientId` | `string` | *required* | OAuth client ID from the provider |
| `redirectUri` | `string` | *required* | Redirect URI (see [Redirect URI by Platform](#redirect-uri-by-platform)) |
| `scopes` | `string[]` | — | OAuth scopes to request |
| `label` | `string` | — | Custom button label |
| `icon` | `React.ReactNode` | — | Custom icon element (react-native-svg) |
| `onSuccess` | `(response: ProviderResponse) => void` | — | Called with the auth code on success |
| `onError` | `(error: OAuthError) => void` | — | Called when authentication fails |
| `theme` | `Partial<ThemeConfig>` | — | Per-provider theme overrides |
| `layout` | `Partial<LayoutConfig>` | — | Per-provider layout overrides |
| `buttonVariant` | `ButtonVariant` | — | Per-provider button variant override |

### ThemeConfig

All properties are optional when using `Partial<ThemeConfig>`. Values are React Native compatible (numbers, not CSS strings).

| Property | Type | Default | Description |
|---|---|---|---|
| `mode` | `ThemeMode` | `'light'` | `'light'` \| `'dark'` |
| `colors.primary` | `string` | `'#6366f1'` | Primary accent color |
| `colors.text` | `string` | `'#1a1a2e'` | Primary text color |
| `colors.textSecondary` | `string` | `'#64748b'` | Secondary text color |
| `colors.border` | `string` | `'rgba(255,255,255,0.18)'` | Border color |
| `colors.success` | `string` | `'#22c55e'` | Success state color |
| `colors.error` | `string` | `'#ef4444'` | Error state color |
| `glass.blur` | `number` | `12` | Blur amount (requires `@react-native-community/blur`) |
| `glass.opacity` | `number` | `0.15` | Glass layer opacity |
| `glass.shadow` | `object` | — | Shadow config (`color`, `offsetX`, `offsetY`, `opacity`, `radius`, `elevation`) |
| `button.shape` | `ButtonShape` | `'rounded'` | `'pill'` \| `'rounded'` \| `'square'` |
| `button.iconPosition` | `IconPosition` | `'left'` | `'left'` \| `'right'` \| `'top'` |
| `button.size` | `ButtonSize` | `'medium'` | `'small'` \| `'medium'` \| `'large'` |

### LayoutConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `alignment` | `Alignment` | `'center'` | `'left'` \| `'center'` \| `'right'` |
| `spacing` | `number` | `12` | Gap between buttons |
| `showLabels` | `boolean` | `true` | Show text labels on buttons |
| `showDividers` | `boolean` | `false` | Show dividers between buttons |
| `direction` | `'horizontal'` \| `'vertical'` | `'vertical'` | Button layout direction |

## Components

### SociAuthComponent

The main all-in-one component. Renders the full auth UI based on your config.

```tsx
<SociAuthProvider config={config}>
  <SociAuthComponent />
</SociAuthProvider>
```

### SocialButton

A standalone social login button for custom layouts.

```tsx
import { SocialButton } from 'react-native-soci-auth';

<SocialButton
  provider="google"
  label="Continue with Google"
  variant="icon-plus-text"
  onClick={() => console.log('clicked')}
/>
```

### AuthCard

Glassmorphism card container. Uses `BlurView` when available, falls back to semi-transparent background.

```tsx
import { AuthCard } from 'react-native-soci-auth';

<AuthCard title="Sign In" subtitle="Choose a provider">
  {/* your content */}
</AuthCard>
```

### Divider / Banner

```tsx
import { Divider, Banner } from 'react-native-soci-auth';

<Divider label="or" />
<Banner type="success" message="Authenticated!" />
<Banner type="error" message="Failed." onDismiss={() => {}} />
```

## Hooks

### useSociAuth

Access the auth context from any component inside `<SociAuthProvider>`.

```tsx
import { useSociAuth } from 'react-native-soci-auth';

function MyComponent() {
  const { config, theme, providers, triggerOAuth } = useSociAuth();

  return (
    <View>
      <Text>Theme: {theme.mode}</Text>
      <Pressable onPress={() => triggerOAuth('google')}>
        <Text>Sign in with Google</Text>
      </Pressable>
    </View>
  );
}
```

| Return Value | Type | Description |
|---|---|---|
| `config` | `ResolvedSociAuthConfig` | Fully resolved configuration |
| `theme` | `ThemeConfig` | Resolved theme object |
| `providers` | `Record<ProviderName, ProviderState>` | State for each provider |
| `triggerOAuth` | `(provider: ProviderName) => void` | Trigger the OAuth flow |
| `isLoading` | `(provider: ProviderName) => boolean` | Check if a provider is loading |
| `updateProviderState` | `(provider, state) => void` | Manually update provider state |


## Examples

### Full Setup with Redirect URI Helper

```tsx
import { SociAuthProvider, SociAuthComponent } from 'react-native-soci-auth';
import { makeRedirectUri } from 'expo-auth-session';
import type { SociAuth_Config, ProviderResponse } from 'react-native-soci-auth';

const redirectUri = makeRedirectUri({ scheme: 'myapp', path: 'callback' });

function handleSuccess(response: ProviderResponse) {
  // Send the authorization code to your backend
  fetch('https://your-api.com/auth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: response.provider,
      code: response.code,
      state: response.state,
    }),
  });
}

const config: SociAuth_Config = {
  providers: [
    {
      name: 'google',
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      redirectUri,
      scopes: ['openid', 'email', 'profile'],
      onSuccess: handleSuccess,
    },
    {
      name: 'github',
      clientId: 'YOUR_GITHUB_CLIENT_ID',
      redirectUri,
      scopes: ['read:user', 'user:email'],
      onSuccess: handleSuccess,
    },
  ],
  theme: { mode: 'dark' },
  showCard: true,
  cardTitle: 'Welcome Back',
};

export default function App() {
  return (
    <SociAuthProvider config={config}>
      <SociAuthComponent />
    </SociAuthProvider>
  );
}
```

### Dark Mode with Custom Colors

```tsx
const config: SociAuth_Config = {
  providers: [
    { name: 'google', clientId: '...', redirectUri },
    { name: 'apple', clientId: '...', redirectUri },
    { name: 'facebook', clientId: '...', redirectUri },
    { name: 'github', clientId: '...', redirectUri },
  ],
  theme: {
    mode: 'dark',
    colors: {
      primary: '#ec4899',
      text: '#fdf2f8',
      border: 'rgba(236, 72, 153, 0.25)',
    },
    glass: { opacity: 0.12 },
  },
  enable3DDepth: true,
  cardTitle: 'Welcome',
  cardSubtitle: 'Pick a provider to get started',
};
```

### Horizontal Icon-Only Buttons

```tsx
const config: SociAuth_Config = {
  providers: [
    { name: 'google', clientId: '...', redirectUri },
    { name: 'apple', clientId: '...', redirectUri },
    { name: 'facebook', clientId: '...', redirectUri },
    { name: 'github', clientId: '...', redirectUri },
  ],
  buttonVariant: 'icon-only',
  layout: {
    direction: 'horizontal',
    alignment: 'center',
    spacing: 16,
  },
  theme: { button: { shape: 'pill', size: 'large' } },
};
```

### Press Fill Effect

```tsx
const config: SociAuth_Config = {
  providers: [
    { name: 'google', clientId: '...', redirectUri },
    { name: 'github', clientId: '...', redirectUri },
  ],
  enableHoverFill: true,
  hoverFillColor: '#8b5cf6',
  theme: { button: { shape: 'rounded', size: 'large' } },
};
```

## Differences from react-soci-auth (Web)

| Feature | Web (`react-soci-auth`) | React Native (`react-native-soci-auth`) |
|---|---|---|
| Styling | CSS + `className` | `StyleSheet` + `ViewStyle` |
| OAuth flow | Popup window + `postMessage` | `WebBrowser.openAuthSessionAsync` |
| Redirect URI | `window.location.origin + '/callback.html'` | `makeRedirectUri({ scheme, path })` |
| Blur effect | CSS `backdrop-filter` | `@react-native-community/blur` (optional) |
| Gradient | CSS `linear-gradient` | `expo-linear-gradient` (optional) |
| Icons | Inline SVG | `react-native-svg` |
| Theme values | CSS strings (`'12px'`, `'200ms'`) | Numbers (`12`, `200`) |
| Shadow | CSS `box-shadow` | RN shadow object (`shadowColor`, `shadowOffset`, etc.) |

## TypeScript

All config objects, props, and return types are exported:

```ts
import type {
  SociAuth_Config, ProviderConfig, ThemeConfig, LayoutConfig,
  ProviderResponse, OAuthError, ProviderName, ButtonVariant,
  ButtonShape, ButtonSize, IconPosition, ThemeMode, Alignment,
  ResolvedSociAuthConfig, ProviderState, SociAuthContextValue,
  SocialButtonProps, AuthCardProps, DividerProps, BannerProps,
} from 'react-native-soci-auth';
```

## Platform Support

| Platform | Support |
|---|---|
| iOS | ✅ |
| Android | ✅ |
| Expo Web | ✅ |
| Expo Go | ✅ |

## License

[MIT](https://github.com/s4spublic/react-soci-auth/blob/main/LICENSE) © react-soci-auth contributors
