import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import type { SociAuth_Config } from 'react-native-soci-auth';
import { generateCodeSnippet } from '../utils/codeGenerator';

export interface CodePanelProps {
  config: SociAuth_Config;
}

export const CodePanel: React.FC<CodePanelProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = useMemo(() => generateCodeSnippet(config), [config]);

  const handleCopy = useCallback(async () => {
    try {
      // Use expo-clipboard for cross-platform support
      const Clipboard = require('expo-clipboard');
      await Clipboard.setStringAsync(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for web: use navigator.clipboard
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(codeSnippet);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Silent fail
        }
      }
    }
  }, [codeSnippet]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Code</Text>
        <Pressable
          style={[styles.copyButton, copied && styles.copyButtonCopied]}
          onPress={handleCopy}
          accessibilityLabel={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          <Text style={[styles.copyButtonText, copied && styles.copyButtonTextCopied]}>
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal style={styles.codeScroll}>
        <Text style={styles.codeText} selectable>
          {codeSnippet}
        </Text>
      </ScrollView>
    </View>
  );
};

export default CodePanel;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: '#1e1e2e',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  copyButtonCopied: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  copyButtonTextCopied: {
    color: '#22c55e',
  },
  codeScroll: {
    padding: 16,
  },
  codeText: {
    fontSize: 13,
    lineHeight: 21,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: "'Fira Code', 'Cascadia Code', Consolas, monospace",
    }),
    color: '#cdd6f4',
  },
});
