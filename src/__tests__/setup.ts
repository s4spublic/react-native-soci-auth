// Test setup for react-native-soci-auth

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn().mockResolvedValue({
    type: 'success',
    url: 'myapp://callback?code=test-code&state=test-state',
  }),
  warmUpAsync: jest.fn().mockResolvedValue(undefined),
  coolDownAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn().mockResolvedValue(undefined),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn().mockResolvedValue(null),
}));

// Mock react-native-svg (minimal)
jest.mock('react-native-svg', () => {
  const React = require('react');
  const createMockComponent = (name: string) =>
    React.forwardRef((props: any, ref: any) =>
      React.createElement(name, { ...props, ref })
    );
  return {
    __esModule: true,
    default: createMockComponent('Svg'),
    Svg: createMockComponent('Svg'),
    Path: createMockComponent('Path'),
    G: createMockComponent('G'),
    Circle: createMockComponent('Circle'),
    Rect: createMockComponent('Rect'),
  };
});

// Mock @react-native-community/blur (optional dep)
jest.mock('@react-native-community/blur', () => {
  throw new Error('Module not found');
});

// Mock expo-linear-gradient (optional dep)
jest.mock('expo-linear-gradient', () => {
  throw new Error('Module not found');
});

// Mock expo-crypto (optional dep)
jest.mock('expo-crypto', () => {
  throw new Error('Module not found');
});

// Silence console.warn in tests unless debugging
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Allow through if explicitly testing warnings
    if (process.env.SHOW_WARNINGS === 'true') {
      originalWarn(...args);
    }
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
