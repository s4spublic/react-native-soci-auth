/**
 * Utility for safely detecting optional native modules at runtime.
 * All imports are wrapped in try/catch to prevent crashes when modules aren't installed.
 */

/**
 * Checks if @react-native-community/blur is available.
 */
export function isBlurAvailable(): boolean {
  try {
    require('@react-native-community/blur');
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if expo-linear-gradient is available.
 */
export function isGradientAvailable(): boolean {
  try {
    require('expo-linear-gradient');
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns cryptographically random bytes with a fallback chain:
 * 1. Try expo-crypto getRandomBytes
 * 2. Try react-native-get-random-values (polyfills crypto.getRandomValues)
 * 3. Fall back to Math.random
 */
export function getRandomBytes(length: number): Uint8Array {
  // Attempt 1: expo-crypto
  try {
    const expoCrypto = require('expo-crypto');
    if (typeof expoCrypto.getRandomBytes === 'function') {
      return expoCrypto.getRandomBytes(length);
    }
  } catch {
    // expo-crypto not available
  }

  // Attempt 2: react-native-get-random-values polyfill
  try {
    require('react-native-get-random-values');
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
      const array = new Uint8Array(length);
      globalThis.crypto.getRandomValues(array);
      return array;
    }
  } catch {
    // react-native-get-random-values not available
  }

  // Attempt 3: Math.random fallback
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}
