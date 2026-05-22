import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SociAuthComponent, useSociAuth } from 'react-native-soci-auth';

export const PreviewPanel: React.FC = () => {
  let isDark = false;
  try {
    const { theme } = useSociAuth();
    isDark = theme.mode === 'dark';
  } catch {
    // outside provider — default to light
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.label, isDark && styles.labelDark]}>Preview</Text>
      <View style={styles.content}>
        <SociAuthComponent />
      </View>
    </View>
  );
};

export default PreviewPanel;

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
    padding: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#0f1117',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  label: {
    position: 'absolute',
    top: 12,
    left: 16,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#94a3b8',
    zIndex: 1,
  },
  labelDark: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
