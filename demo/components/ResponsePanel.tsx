import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { useSociAuth } from 'react-native-soci-auth';
import type { ProviderName } from 'react-native-soci-auth';

const ALL_PROVIDERS: ProviderName[] = ['google', 'apple', 'facebook', 'github'];

const STATUS_COLORS: Record<string, string> = {
  success: '#22c55e',
  error: '#ef4444',
  loading: '#f59e0b',
  idle: '#64748b',
};

export const ResponsePanel: React.FC = () => {
  const { providers, updateProviderState } = useSociAuth();

  const activeProviders = ALL_PROVIDERS.filter(
    (name) => providers[name]?.status !== 'idle'
  );

  const hasResponses = activeProviders.length > 0;

  const handleClear = () => {
    ALL_PROVIDERS.forEach((name) => {
      updateProviderState(name, { status: 'idle' });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>OAuth Response</Text>
        <View style={styles.headerRight}>
          {hasResponses && (
            <>
              <Text style={styles.countText}>
                {activeProviders.length} provider{activeProviders.length > 1 ? 's' : ''}
              </Text>
              <Pressable style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
      {!hasResponses ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Authenticate with a provider to see the response here
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.contentScroll}>
          {activeProviders.map((name) => {
            const state = providers[name];
            const statusColor = STATUS_COLORS[state.status] || '#64748b';

            const displayData: Record<string, unknown> = {
              provider: name,
              status: state.status,
            };

            if (state.response) {
              displayData.response = {
                code: state.response.code
                  ? `${state.response.code.substring(0, 20)}...`
                  : undefined,
                state: state.response.state,
                rawParams: state.response.rawParams,
              };
            }

            if (state.error) {
              displayData.error = {
                errorType: state.error.errorType,
                message: state.error.message,
              };
            }

            return (
              <View key={name} style={styles.providerBlock}>
                <Text style={[styles.providerName, { color: statusColor }]}>
                  {name} — {state.status}
                </Text>
                <Text style={styles.jsonText} selectable>
                  {JSON.stringify(displayData, null, 2)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default ResponsePanel;

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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ef4444',
  },
  emptyContainer: {
    padding: 16,
  },
  emptyText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.3)',
    fontStyle: 'italic',
  },
  contentScroll: {
    padding: 16,
  },
  providerBlock: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  providerName: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  jsonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: "'Fira Code', Consolas, monospace",
    }),
    color: '#cdd6f4',
  },
});
