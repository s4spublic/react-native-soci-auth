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
  <a href="https://react-native-soci-auth.vercel.app/" target="_blank"><strong>Live Demo</strong></a> · <a href="#quick-start">Quick Start</a> · <a href="#configuration">Configuration</a> · <a href="#dynamic-theming">Dynamic Theming</a> · <a href="#oauth-provider-setup">Provider Setup</a>
</p>

---

Drop-in social login buttons for Google, Apple, Facebook, and GitHub in React Native. Glassmorphism styling, dark mode, size scaling, 3D depth effects, and full TypeScript support. Built for Expo and bare React Native.

<p><strong><a href="https://react-native-soci-auth.vercel.app/" target="_blank" rel="noopener noreferrer">See it in action →</a></strong></p>

> **Also available for React web:** [`react-soci-auth`](https://www.npmjs.com/package/react-soci-auth)

## Try the Demo

The [live demo](https://react-native-soci-auth.vercel.app/) is a fully interactive playground:

- **Preview** — see the component update in real time as you change settings
- **Controls** — toggle providers, variants, themes, layout, effects, and colors
- **Code** — copy the exact config snippet for your current settings
- **Response** — sign in with Google (or any configured provider) and see the real OAuth response shape — provider name, authorization code, state, and raw params

## Features

- 🔐 **OAuth 2.0** via `expo-web-browser` (in-app browser) with `Linking` fallback
- 🎨 **Glassmorphism** design with optional blur, transparency, and gradient effects
- 🌗 **Dark & Light mode** — fully theme-aware, all colors adapt automatically
- 📏 **Size scaling** — uniformly scale button height, icon, font, and padding with one value
- 🧩 **Multiple button variants** — icon-only, text-only, icon + text
- 📐 **Flexible layouts** — horizontal / vertical, left / center / right alignment
- ✨ **Effects** — 3D depth tilt on press, animated press fill
- ⚡ **Fully dynamic** — swap theme, layout, or any config at runtime, UI updates instantly
- 📦 **Tree-shakeable** — import only what you need
- 🔒 **TypeScript-first** — every prop, config, and return type is fully typed
- ♿ **Accessible** — `accessibilityLabel`, `accessibilityRole` on all interactive elements
- 🎯 **Standalone components** — use `SocialButton`, `AuthCard`, `Divider`, or `Banner` independently
- 📱 **Cross-platform** — iOS, Android, and Expo Web

---

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
| `react-native` | `>=0.73.0` | Yes |
| `react-native-svg` | `*` | Yes (icons) |
| `expo-web-browser` | `*` | Yes (OAuth flow) |

Optional — install for enhanced visual effects:

| Dependency | Purpose |
|---|---|
| `@react-native-community/blur` | Native blur backdrop on `AuthCard` |
| `expo-linear-gradient` | Gradient overlay on `AuthCard` |

---

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
        // Send response.code to your backend to exchange for tokens
        console.log('Auth code:', response.code);
      },
      onError: (error: OAuthError) => {
        console.error('Auth failed:', error.message);
      },
    },
    {
      name: 'github',
      clientId: 'YOUR_GITHUB_CLIENT_ID',
      redirectUri: 'your-app-scheme://callback',
      scopes: ['read:user', 'user:email'],
    },
  ],
  theme: { mode: 'light' },
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

---

## OAuth Flow

react-native-soci-auth uses `expo-web-browser` for the OAuth flow:

1. User presses a social button
2. An in-app browser opens via `WebBrowser.openAuthSessionAsync`
3. User authenticates with the provider
4. Provider redirects back to your `redirectUri` with an authorization code
5. The library parses the redirect URL and fires `onSuccess` or `onError`

If `expo-web-browser` is unavailable, the library falls back to `Linking.openURL`.

### What You Get Back

On success, your `onSuccess` callback receives a `ProviderResponse`:

```ts
interface ProviderResponse {
  provider: ProviderName;              // 'google' | 'apple' | 'facebook' | 'github'
  code?: string;                       // The authorization code — send this to your backend
  state?: string;                      // CSRF state parameter
  rawParams: Record<string, string>;   // All query params from the redirect URL
}
```

On failure, your `onError` callback receives an `OAuthError`:

```ts
interface OAuthError {
  provider: ProviderName;
  errorType: string;  // 'user_cancelled' | 'auth_error' | 'parse_error' | 'browser_unavailable'
  message: string;
}
```

> **Important:** The authorization `code` is a one-time-use token. Send it to your backend to exchange for access and refresh tokens. Never expose your client secret in the app.

> **User cancellation:** If the user closes the browser without completing sign-in, the library handles it silently — no error banner is shown, as closing is a normal user action, not a failure.

---

## OAuth Provider Setup

### Keeping Client IDs Safe

OAuth **client IDs** are public identifiers — they are safe to bundle in your app. OAuth **client secrets** are private and must never appear in a mobile app. react-native-soci-auth only ever asks for the client ID; the secret stays on your backend where it belongs.

That said, avoid hardcoding client IDs directly in source code. Use environment variables so you can rotate them without a code change and keep them out of your git history.

**In your Expo app:**

```bash
# .env.local (add this file to .gitignore)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_APPLE_CLIENT_ID=your-apple-services-id
EXPO_PUBLIC_FACEBOOK_CLIENT_ID=your-facebook-app-id
EXPO_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

```tsx
// Read at build time — the EXPO_PUBLIC_ prefix makes them available in the bundle
const config: SociAuth_Config = {
  providers: [
    {
      name: 'google',
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      redirectUri,
      scopes: ['openid', 'email', 'profile'],
    },
    {
      name: 'github',
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      redirectUri,
      scopes: ['read:user', 'user:email'],
    },
  ],
};
```

**For CI/CD (Vercel, EAS Build, GitHub Actions):** add the same keys as environment variables in the platform's dashboard. They are injected at build time and never stored in your repo.

> The authorization `code` returned by the library is a one-time-use token. Send it to your own backend, which exchanges it for access/refresh tokens using the client secret. The secret never touches the app.

---

### Redirect URI by Platform

The redirect URI you register with providers depends on how you're running the app. Use `expo-auth-session`'s `makeRedirectUri()` to generate the correct one automatically:

```tsx
import { makeRedirectUri } from 'expo-auth-session';

const redirectUri = makeRedirectUri({
  scheme: 'myapp',   // matches the "scheme" in your app.json
  path: 'callback',
});
// Development Build → myapp://callback
// Expo Go          → exp://127.0.0.1:8081/--/callback
// Web dev          → http://localhost:8081/callback
// Web prod         → https://yoursite.com/callback
```

| Platform | Redirect URI Format |
|---|---|
| Expo Web (dev) | `http://localhost:<port>` |
| Expo Web (prod) | `https://your-domain.com` |
| Development Build | `your-scheme://callback` |
| Expo Go | `exp://127.0.0.1:8081/--/callback` (auto-generated) |

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an **OAuth 2.0 Client ID**.

**For Web (Expo Web or Expo Go):**
- Application type: **Web application**
- Authorized redirect URIs: add `http://localhost:8081` (and your production URL)

**For Android:**
- Application type: **Android**
- Package name: your `android.package` from `app.json`
- SHA-1: run `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

**For iOS:**
- Application type: **iOS**
- Bundle ID: your `ios.bundleIdentifier` from `app.json`

> Google requires separate client IDs per platform. Use the Web client ID for Expo Go and Expo Web during development.

**Recommended scopes:** `openid`, `email`, `profile`

### Apple

> Requires an [Apple Developer Program](https://developer.apple.com/programs/) membership ($99/year).

1. Go to [Apple Developer Portal](https://developer.apple.com/) → Certificates, Identifiers & Profiles → Identifiers.
2. Register an App ID with **Sign in with Apple** enabled.
3. Create a **Services ID** (this is your `clientId`):
   - Enable Sign in with Apple
   - Configure domains and return URLs
   - Redirect URI must be **HTTPS** — Apple does not allow `http://localhost`
4. For local development, use a tunneling tool like [ngrok](https://ngrok.com/) to expose an HTTPS URL.

**Recommended scopes:** `name`, `email`

### Facebook

1. Go to [Meta for Developers](https://developers.facebook.com/) → Create App → **Consumer**.
2. Add the **Facebook Login** product.
3. Go to Facebook Login → Settings → Valid OAuth Redirect URIs — add your redirect URI.
4. Copy the **App ID** from Settings → Basic (this is your `clientId`).

**Recommended scopes:** `email`, `public_profile`

### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → **New OAuth App**.
2. Set Authorization callback URL to your redirect URI.
3. Copy the **Client ID**.

> GitHub OAuth Apps support only one callback URL. Create separate apps for dev and production if needed.

**Recommended scopes:** `read:user`, `user:email`

### Quick Reference

| Provider | Console | localhost OK? | HTTPS Required? |
|---|---|---|---|
| Google | [console.cloud.google.com](https://console.cloud.google.com/) | Yes (Web type) | No (localhost exempt) |
| Apple | [developer.apple.com](https://developer.apple.com/) | No | Yes (always) |
| Facebook | [developers.facebook.com](https://developers.facebook.com/) | Yes | No (dev only) |
| GitHub | [github.com/settings/developers](https://github.com/settings/developers) | Yes | No |

---

## Configuration

### SociAuth_Config

The top-level configuration object passed to `<SociAuthProvider>`.

| Property | Type | Default | Description |
|---|---|---|---|
| `providers` | `ProviderConfig[]` | *required* | OAuth provider configurations |
| `theme` | `Partial<ThemeConfig>` | — | Global theme overrides |
| `layout` | `Partial<LayoutConfig>` | — | Global layout overrides |
| `behavior` | `Partial<BehaviorConfig>` | — | Logging and analytics hooks |
| `buttonVariant` | `ButtonVariant` | `'icon-plus-text'` | Default button display style |
| `buttonSizeScale` | `number` | `1.0` | Uniform scale for height, icon, font, and padding. `1.5` = 50% larger, `0.8` = 20% smaller. Min `0.25`. |
| `enable3DDepth` | `boolean` | `false` | 3D tilt animation on press |
| `showCard` | `boolean` | `true` | Wrap buttons in a glassmorphism card |
| `enableHoverFill` | `boolean` | `false` | Animated color fill on press |
| `hoverFillColor` | `string` | `'#6366f1'` | Color used for the press fill animation |
| `cardTitle` | `string` | `''` | Title shown inside the auth card |
| `cardSubtitle` | `string` | `''` | Subtitle shown inside the auth card |
| `contentAlignment` | `Alignment` | `'center'` | Alignment of button content within each button |
| `cardTitleColor` | `string` | theme-aware | Title color. Leave empty to use the theme text color automatically. |
| `cardSubtitleColor` | `string` | theme-aware | Subtitle color. Leave empty to use the theme secondary text color automatically. |
| `buttonTextColor` | `string` | theme-aware | Override button label color. Leave empty for automatic theme color. |

### ProviderConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `name` | `ProviderName` | *required* | `'google'` \| `'apple'` \| `'facebook'` \| `'github'` |
| `clientId` | `string` | *required* | OAuth client ID from the provider |
| `redirectUri` | `string` | *required* | Redirect URI registered with the provider |
| `scopes` | `string[]` | — | OAuth scopes to request |
| `label` | `string` | — | Custom button label (overrides built-in label) |
| `icon` | `React.ReactNode` | — | Custom icon (react-native-svg element) |
| `onSuccess` | `(response: ProviderResponse) => void` | — | Called with the auth code on success |
| `onError` | `(error: OAuthError) => void` | — | Called when authentication fails |
| `theme` | `Partial<ThemeConfig>` | — | Per-provider theme overrides |
| `layout` | `Partial<LayoutConfig>` | — | Per-provider layout overrides |
| `buttonVariant` | `ButtonVariant` | — | Per-provider button variant override |

### ThemeConfig

All properties are optional in `Partial<ThemeConfig>`. Values use React Native–compatible types (numbers, not CSS strings).

| Property | Type | Light default | Dark default | Description |
|---|---|---|---|---|
| `mode` | `ThemeMode` | `'light'` | `'dark'` | Color scheme |
| `colors.primary` | `string` | `'#6366f1'` | `'#818cf8'` | Primary accent color |
| `colors.text` | `string` | `'#1a1a2e'` | `'#e2e8f0'` | Primary text color |
| `colors.textSecondary` | `string` | `'#64748b'` | `'#94a3b8'` | Secondary text color |
| `colors.border` | `string` | `'rgba(148,163,184,0.5)'` | `'rgba(255,255,255,0.18)'` | Border color |
| `colors.success` | `string` | `'#22c55e'` | `'#4ade80'` | Success state color |
| `colors.error` | `string` | `'#ef4444'` | `'#f87171'` | Error state color |
| `glass.blur` | `number` | `12` | `12` | Blur amount (requires `@react-native-community/blur`) |
| `glass.opacity` | `number` | `0.45` | `0.45` | Glass layer opacity |
| `button.shape` | `ButtonShape` | `'rounded'` | `'rounded'` | `'pill'` \| `'rounded'` \| `'square'` |
| `button.iconPosition` | `IconPosition` | `'left'` | `'left'` | `'left'` \| `'right'` \| `'top'` |
| `button.size` | `ButtonSize` | `'medium'` | `'medium'` | `'small'` \| `'medium'` \| `'large'` |

### LayoutConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `alignment` | `Alignment` | `'center'` | `'left'` \| `'center'` \| `'right'` |
| `spacing` | `number` | `12` | Gap between buttons (pixels) |
| `showLabels` | `boolean` | `true` | Show text labels on buttons |
| `showDividers` | `boolean` | `false` | Show "or" dividers between buttons |
| `direction` | `'horizontal'` \| `'vertical'` | `'vertical'` | Button layout direction |

---

## Dynamic Theming

One of the most powerful features is that **all configuration is reactive**. When you pass a new config to `SociAuthProvider`, every component inside updates instantly — the card background, button surfaces, icon colors, text, borders, everything.

### How it works

```
Your state change
  → new config object
    → SociAuthProvider re-resolves the theme
      → all child components re-render with the new colors
```

You don't need to do anything special. Just update your config state and the library handles the rest.

### Dark / Light mode toggle

```tsx
import React, { useState, useMemo } from 'react';
import { Switch, View } from 'react-native';
import { SociAuthProvider, SociAuthComponent } from 'react-native-soci-auth';
import { makeRedirectUri } from 'expo-auth-session';

const redirectUri = makeRedirectUri({ scheme: 'myapp', path: 'callback' });

export default function App() {
  const [isDark, setIsDark] = useState(false);

  // Memoize config so it only changes when isDark actually changes.
  // Without useMemo, a new object is created on every render,
  // causing unnecessary re-processing inside the library.
  const config = useMemo(() => ({
    providers: [
      { name: 'google', clientId: 'YOUR_ID', redirectUri },
      { name: 'apple',  clientId: 'YOUR_ID', redirectUri },
    ],
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    showCard: true,
    cardTitle: 'Welcome Back',
    cardSubtitle: 'Sign in to continue',
  }), [isDark]);

  return (
    <View style={{ flex: 1 }}>
      <Switch value={isDark} onValueChange={setIsDark} />

      <SociAuthProvider config={config}>
        <SociAuthComponent />
      </SociAuthProvider>
    </View>
  );
}
```

When `isDark` flips:
- Card background switches between slate-gray glass (light) and dark navy glass (dark)
- Button surfaces switch between light gray and dark navy
- Apple and GitHub icons flip between black and white
- All text colors update to match the mode
- No manual color management needed

### Following the user's system theme

```tsx
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null

  const config = useMemo(() => ({
    providers: [...],
    theme: {
      mode: colorScheme === 'dark' ? 'dark' : 'light',
    },
  }), [colorScheme]);

  return (
    <SociAuthProvider config={config}>
      <SociAuthComponent />
    </SociAuthProvider>
  );
}
```

### Changing button size at runtime

`buttonSizeScale` uniformly scales button height, icon size, font size, and horizontal padding in one value. This is great for accessibility or user preference settings.

```tsx
const [scale, setScale] = useState(1.0);

const config = useMemo(() => ({
  providers: [...],
  buttonSizeScale: scale,  // 0.8 = smaller, 1.0 = default, 1.5 = larger
}), [scale]);
```

| `buttonSizeScale` | Button height (medium) | Icon | Font |
|---|---|---|---|
| `0.8` | 32px | 16px | 11px |
| `1.0` (default) | 40px | 20px | 14px |
| `1.5` | 60px | 30px | 21px |
| `2.0` | 80px | 40px | 28px |

### Best practices for config

**Do this — memoize your config:**
```tsx
// Config object only recreates when actual values change
const config = useMemo(() => ({
  providers: [...],
  theme: { mode: isDark ? 'dark' : 'light' },
  buttonSizeScale: scale,
}), [isDark, scale]);
```

**Avoid this — inline config without memoization:**
```tsx
// Creates a new object on every render, even when nothing changed
return (
  <SociAuthProvider config={{ providers: [...], theme: { mode: 'dark' } }}>
    ...
  </SociAuthProvider>
);
```

Inline config objects still work correctly — the library is safe against this. It just means the merge pipeline runs on every parent render instead of only when values actually change.

### Accessing the theme from inside the provider

Any component nested inside `<SociAuthProvider>` can read the current resolved theme using the `useSociAuth` hook:

```tsx
import { useSociAuth } from 'react-native-soci-auth';

function MyHeader() {
  const { theme } = useSociAuth();
  const isDark = theme.mode === 'dark';

  return (
    <View style={{ backgroundColor: isDark ? '#0f1117' : '#ffffff' }}>
      <Text style={{ color: theme.colors.text }}>Sign In</Text>
    </View>
  );
}

// Wrap it in SociAuthProvider and MyHeader updates automatically with theme changes
```

---

## Components

### SociAuthComponent

The main all-in-one component. Renders the full auth UI based on your config. Wrap it in `SociAuthProvider` or pass a `config` prop directly.

```tsx
// Option A — shared provider (recommended when you have multiple components reading the same config)
<SociAuthProvider config={config}>
  <SociAuthComponent />
</SociAuthProvider>

// Option B — self-contained (config handled internally)
<SociAuthComponent config={config} />
```

### SocialButton

A standalone social login button for custom layouts. Works inside or outside a `SociAuthProvider`.

```tsx
import { SocialButton } from 'react-native-soci-auth';

<SocialButton
  provider="google"
  label="Continue with Google"
  variant="icon-plus-text"
  sizeScale={1.2}
  onClick={() => console.log('pressed')}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `provider` | `ProviderName` | *required* | Which provider's icon and label to show |
| `label` | `string` | built-in | Button text |
| `variant` | `ButtonVariant` | `'icon-plus-text'` | Display style |
| `sizeScale` | `number` | `1.0` | Uniform size multiplier |
| `enable3DDepth` | `boolean` | `false` | 3D tilt on press |
| `enableHoverFill` | `boolean` | `false` | Animated fill on press |
| `hoverFillColor` | `string` | `'#6366f1'` | Fill color |
| `contentAlignment` | `Alignment` | `'center'` | Icon + text alignment inside the button |
| `buttonTextColor` | `string` | theme-aware | Override label color |
| `onClick` | `() => void` | — | Custom press handler (bypasses built-in OAuth) |
| `disabled` | `boolean` | `false` | Disables interaction |

### AuthCard

Glassmorphism card container. Automatically picks up the theme from context. Uses `BlurView` when available, falls back to a semi-transparent background with the correct mode-aware color.

```tsx
import { AuthCard } from 'react-native-soci-auth';

<AuthCard title="Sign In" subtitle="Choose a provider">
  {/* your content */}
</AuthCard>
```

The card background adapts automatically:
- **Light mode** — neutral slate-gray glass, visible on white, dark, and colored backgrounds
- **Dark mode** — dark navy glass with boosted opacity, clear visual separation

### Divider

```tsx
import { Divider } from 'react-native-soci-auth';

<Divider label="or" direction="horizontal" />
```

### Banner

Status banner for success and error messages. Auto-dismisses after 5 seconds.

```tsx
import { Banner } from 'react-native-soci-auth';

<Banner type="success" message="Signed in!" />
<Banner type="error" message="Something went wrong." onDismiss={() => {}} />
```

---

## Hooks

### useSociAuth

Access the auth context from any component inside `<SociAuthProvider>`. Useful for building custom UI that reacts to the current theme or provider state.

```tsx
import { useSociAuth } from 'react-native-soci-auth';

function MyComponent() {
  const { config, theme, providers, triggerOAuth } = useSociAuth();

  return (
    <Pressable onPress={() => triggerOAuth('google')}>
      <Text style={{ color: theme.colors.primary }}>
        Sign in with Google
      </Text>
    </Pressable>
  );
}
```

| Return value | Type | Description |
|---|---|---|
| `config` | `ResolvedSociAuthConfig` | Fully resolved and merged configuration |
| `theme` | `ThemeConfig` | Resolved theme (includes all mode-aware defaults) |
| `providers` | `Record<ProviderName, ProviderState>` | State for each provider (`idle`, `loading`, `success`, `error`) |
| `triggerOAuth` | `(provider: ProviderName) => void` | Trigger the OAuth flow programmatically |
| `isLoading` | `(provider: ProviderName) => boolean` | Whether a provider is currently authenticating |
| `updateProviderState` | `(provider, state) => void` | Manually update a provider's state (advanced use) |

---

## Examples

### Full Setup with Redirect URI Helper

```tsx
import React, { useMemo } from 'react';
import { SociAuthProvider, SociAuthComponent } from 'react-native-soci-auth';
import { makeRedirectUri } from 'expo-auth-session';
import type { SociAuth_Config, ProviderResponse } from 'react-native-soci-auth';

const redirectUri = makeRedirectUri({ scheme: 'myapp', path: 'callback' });

function handleSuccess(response: ProviderResponse) {
  fetch('https://your-api.com/auth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: response.provider,
      code: response.code,
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

### Dark Mode with Custom Accent Color

```tsx
const config: SociAuth_Config = {
  providers: [
    { name: 'google',   clientId: '...', redirectUri },
    { name: 'apple',    clientId: '...', redirectUri },
    { name: 'facebook', clientId: '...', redirectUri },
    { name: 'github',   clientId: '...', redirectUri },
  ],
  theme: {
    mode: 'dark',
    colors: {
      primary: '#ec4899',
      border: 'rgba(236, 72, 153, 0.25)',
    },
    glass: { opacity: 0.5 },
    button: { shape: 'pill' },
  },
  enable3DDepth: true,
  cardTitle: 'Welcome',
  cardSubtitle: 'Pick a provider',
};
```

> Tip: Leave `cardTitleColor` and `cardSubtitleColor` unset — they automatically use white text in dark mode and dark text in light mode.

### Horizontal Icon-Only Buttons

```tsx
const config: SociAuth_Config = {
  providers: [
    { name: 'google',   clientId: '...', redirectUri },
    { name: 'apple',    clientId: '...', redirectUri },
    { name: 'facebook', clientId: '...', redirectUri },
    { name: 'github',   clientId: '...', redirectUri },
  ],
  buttonVariant: 'icon-only',
  buttonSizeScale: 1.2,
  layout: {
    direction: 'horizontal',
    alignment: 'center',
    spacing: 16,
  },
  theme: {
    button: { shape: 'pill', size: 'large' },
  },
  showCard: false,
};
```

### Large Accessible Buttons

```tsx
const config: SociAuth_Config = {
  providers: [
    { name: 'google', clientId: '...', redirectUri },
    { name: 'github', clientId: '...', redirectUri },
  ],
  buttonSizeScale: 1.5,   // 50% larger than default
  buttonVariant: 'icon-plus-text',
  theme: { button: { shape: 'rounded', size: 'large' } },
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
  enable3DDepth: true,
};
```

### Using the Auth Hook for Custom UI

```tsx
import { useSociAuth } from 'react-native-soci-auth';
import { Pressable, Text, ActivityIndicator } from 'react-native';

function CustomGoogleButton() {
  const { triggerOAuth, isLoading, theme } = useSociAuth();
  const loading = isLoading('google');

  return (
    <Pressable
      onPress={() => triggerOAuth('google')}
      disabled={loading}
      style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 8 }}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={{ color: '#fff' }}>Sign in with Google</Text>
      }
    </Pressable>
  );
}

// Place inside SociAuthProvider
export default function App() {
  return (
    <SociAuthProvider config={config}>
      <CustomGoogleButton />
    </SociAuthProvider>
  );
}
```

---

## Platform Notes

### Android

The library intentionally skips `elevation` on Android. Android's elevation system causes a white glow artifact around rounded corners when used with semi-transparent (glass) backgrounds. Shadows are applied only on iOS using the native `shadowColor`, `shadowOffset`, `shadowOpacity`, and `shadowRadius` properties.

### Expo Go vs Development Builds

The library is fully compatible with **Expo Go** (no native modules required). OAuth works via the in-app browser. Note that Google OAuth may display a policy warning in Expo Go due to the `exp://` scheme — this is expected in development and won't affect production builds.

### Web (Expo Web)

Full support. `useNativeDriver` is automatically disabled on web. Blur effects (`@react-native-community/blur`) are not available on web but the library falls back gracefully to a semi-transparent background.

---

## TypeScript

All types are exported:

```ts
import type {
  SociAuth_Config,
  ProviderConfig,
  ThemeConfig,
  LayoutConfig,
  BehaviorConfig,
  ProviderResponse,
  OAuthError,
  ProviderName,
  ButtonVariant,
  ButtonShape,
  ButtonSize,
  IconPosition,
  ThemeMode,
  Alignment,
  ResolvedSociAuthConfig,
  ProviderState,
  SociAuthContextValue,
  SocialButtonProps,
  AuthCardProps,
  DividerProps,
  BannerProps,
} from 'react-native-soci-auth';
```

---

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
| Shadow | CSS `box-shadow` | RN shadow (`shadowColor`, `shadowOffset`, etc.), iOS only |

---

## Platform Support

| Platform | Status |
|---|---|
| iOS | ✅ Full support |
| Android | ✅ Full support |
| Expo Web | ✅ Full support |
| Expo Go | ✅ Full support |

---

## License

[MIT](LICENSE) © Sagar Varma
