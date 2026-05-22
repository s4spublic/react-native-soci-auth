const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const libraryRoot = path.resolve(__dirname, '..');
const demoNodeModules = path.resolve(__dirname, 'node_modules');

// Watch the parent directory for library source changes
config.watchFolders = [libraryRoot];

// Alias react-native-soci-auth to local source
// AND force shared dependencies to resolve from the demo's node_modules
// so the library source doesn't pick up its own copy of react/react-native
config.resolver.extraNodeModules = {
  'react-native-soci-auth': path.resolve(libraryRoot, 'src'),
  // Prevent duplicate React — force library imports to use demo's copies
  'react': path.resolve(demoNodeModules, 'react'),
  'react-native': path.resolve(demoNodeModules, 'react-native'),
  'react-native-web': path.resolve(demoNodeModules, 'react-native-web'),
  'react-dom': path.resolve(demoNodeModules, 'react-dom'),
  'react-native-svg': path.resolve(demoNodeModules, 'react-native-svg'),
  'expo-web-browser': path.resolve(demoNodeModules, 'expo-web-browser'),
  'expo-clipboard': path.resolve(demoNodeModules, 'expo-clipboard'),
  'react-native-safe-area-context': path.resolve(demoNodeModules, 'react-native-safe-area-context'),
  'expo-auth-session': path.resolve(demoNodeModules, 'expo-auth-session'),
  'expo-crypto': path.resolve(demoNodeModules, 'expo-crypto'),
};

// Only look for node_modules in the demo directory
config.resolver.nodeModulesPaths = [demoNodeModules];

// Block Metro from resolving node_modules from the library root
config.resolver.blockList = [
  new RegExp(path.resolve(libraryRoot, 'node_modules').replace(/[/\\]/g, '[/\\\\]') + '.*'),
];

module.exports = config;
