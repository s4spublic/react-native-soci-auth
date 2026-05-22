/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-svg|expo-web-browser|expo-modules-core|@expo|expo-linking)/)',
  ],
  moduleNameMapper: {
    '^react-native-soci-auth$': '<rootDir>/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/__tests__/**',
    '!src/index.ts',
  ],
};
