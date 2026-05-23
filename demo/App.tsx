import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { SociAuthProvider } from 'react-native-soci-auth';

// Required for expo-web-browser OAuth on web: closes the popup when
// the app loads at the redirect URI and passes the auth result back.
WebBrowser.maybeCompleteAuthSession();
import { useDemoState } from './hooks/useDemoState';
import { ControlPanel } from './components/ControlPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { CodePanel } from './components/CodePanel';
import { ResponsePanel } from './components/ResponsePanel';

type TabName = 'preview' | 'controls' | 'code' | 'response';

const TABS: { key: TabName; label: string }[] = [
  { key: 'preview', label: 'Preview' },
  { key: 'controls', label: 'Controls' },
  { key: 'code', label: 'Code' },
  { key: 'response', label: 'Response' },
];

function DemoContent() {
  const { state, config, setters, resetToDefaults } = useDemoState();
  const [activeTab, setActiveTab] = useState<TabName>('preview');

  return (
    <SociAuthProvider config={config}>
      <View style={styles.main}>
        {/* ─── Tab Bar ──────────────────────────────────── */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ─── Tab Content ──────────────────────────────── */}
        <View style={styles.content}>
          {activeTab === 'preview' && (
            <ScrollView contentContainerStyle={styles.panelPadding}>
              <PreviewPanel />
            </ScrollView>
          )}
          {activeTab === 'controls' && (
            <ControlPanel
              state={state}
              setters={setters}
              onReset={resetToDefaults}
            />
          )}
          {activeTab === 'code' && (
            <ScrollView contentContainerStyle={styles.panelPadding}>
              <CodePanel config={config} />
            </ScrollView>
          )}
          {activeTab === 'response' && (
            <ScrollView contentContainerStyle={styles.panelPadding}>
              <ResponsePanel />
            </ScrollView>
          )}
        </View>
      </View>
    </SociAuthProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>react-native-soci-auth</Text>
          <Text style={styles.headerSubtitle}>Interactive Demo</Text>
        </View>
        <DemoContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  main: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  panelPadding: {
    padding: 16,
  },
});
