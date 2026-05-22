import type {
  ProviderConfig,
  ProviderName,
  ProviderResponse,
  OAuthResult,
} from '../types';
import { getRandomBytes } from '../utils/nativeModules';

const PROVIDER_ENDPOINTS: Record<ProviderName, string> = {
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  apple: 'https://appleid.apple.com/auth/authorize',
  facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
  github: 'https://github.com/login/oauth/authorize',
};

/**
 * Generates a random state parameter for CSRF protection.
 * Uses getRandomBytes which falls back through expo-crypto →
 * react-native-get-random-values → Math.random.
 * Returns a 32-character hex string (16 bytes).
 */
function generateState(): string {
  const array = getRandomBytes(16);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Constructs the OAuth authorization URL for a given provider.
 * Credentials exist only as in-memory references during URL construction.
 */
export function buildAuthUrl(provider: ProviderConfig): string {
  const endpoint = PROVIDER_ENDPOINTS[provider.name];
  const url = new URL(endpoint);

  url.searchParams.set('client_id', provider.clientId);
  url.searchParams.set('redirect_uri', provider.redirectUri);
  url.searchParams.set('response_type', 'code');

  if (provider.scopes && provider.scopes.length > 0) {
    url.searchParams.set('scope', provider.scopes.join(' '));
  }

  const state = generateState();
  url.searchParams.set('state', state);

  return url.toString();
}

/**
 * Parses the OAuth callback URL and returns an OAuthResult.
 * Extracts authorization code or error from URL parameters.
 */
export function handleCallback(url: string, providerName: ProviderName): OAuthResult {
  try {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    const hashParams = new URLSearchParams(parsedUrl.hash.replace('#', ''));

    // Merge search and hash params (some providers use hash fragments)
    const allParams: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      allParams[key] = value;
    }
    for (const [key, value] of hashParams.entries()) {
      if (!allParams[key]) {
        allParams[key] = value;
      }
    }

    // Check for error response from provider
    if (allParams['error']) {
      const errorType = allParams['error'] === 'access_denied' ? 'user_cancelled' : 'auth_error';
      return {
        success: false,
        provider: providerName,
        error: {
          provider: providerName,
          errorType,
          message: allParams['error_description'] || `OAuth flow failed: ${allParams['error']}`,
        },
      };
    }

    // Check for authorization code
    const code = allParams['code'];
    const state = allParams['state'];

    if (!code) {
      return {
        success: false,
        provider: providerName,
        error: {
          provider: providerName,
          errorType: 'parse_error',
          message: 'No authorization code found in callback URL',
        },
      };
    }

    const response: ProviderResponse = {
      provider: providerName,
      code,
      state,
      rawParams: allParams,
    };

    return {
      success: true,
      provider: providerName,
      response,
    };
  } catch {
    return {
      success: false,
      provider: providerName,
      error: {
        provider: providerName,
        errorType: 'parse_error',
        message: 'Failed to parse callback URL',
      },
    };
  }
}

/**
 * Initiates the OAuth flow for a given provider using expo-web-browser.
 * Falls back to Linking.openURL if WebBrowser is unavailable.
 *
 * Returns a Promise<OAuthResult> — completely different from the web version
 * which uses window.location.assign or popup windows.
 */
export async function initiateFlow(provider: ProviderConfig): Promise<OAuthResult> {
  const url = buildAuthUrl(provider);

  // Attempt to use expo-web-browser
  try {
    const WebBrowser = require('expo-web-browser');
    const result = await WebBrowser.openAuthSessionAsync(url, provider.redirectUri);

    if (result.type === 'success' && result.url) {
      return handleCallback(result.url, provider.name);
    }

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return {
        success: false,
        provider: provider.name,
        error: {
          provider: provider.name,
          errorType: 'user_cancelled',
          message: 'Authentication was cancelled by the user',
        },
      };
    }

    return {
      success: false,
      provider: provider.name,
      error: {
        provider: provider.name,
        errorType: 'unknown',
        message: `Unexpected auth session result type: ${result.type}`,
      },
    };
  } catch {
    // WebBrowser unavailable — fall back to Linking
  }

  // Fallback: use react-native Linking
  try {
    const { Linking } = require('react-native');
    await Linking.openURL(url);
    return {
      success: false,
      provider: provider.name,
      error: {
        provider: provider.name,
        errorType: 'browser_unavailable',
        message:
          'expo-web-browser is not available. Opened URL with system browser via Linking. ' +
          'Auth callback must be handled separately via deep linking.',
      },
    };
  } catch {
    return {
      success: false,
      provider: provider.name,
      error: {
        provider: provider.name,
        errorType: 'browser_unavailable',
        message: 'Unable to open authentication URL. Neither expo-web-browser nor Linking is available.',
      },
    };
  }
}
