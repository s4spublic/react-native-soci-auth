import React, { useState, useMemo, useCallback } from 'react';
import type {
  SociAuth_Config,
  ProviderName,
  ProviderState,
} from '../types';
import { SociAuthContext, type SociAuthContextValue } from './SociAuthContext';
import { validateConfig, mergeConfig } from '../engine/ConfigMerger';
import { resolveTokens } from '../engine/ThemeEngine';
import { initiateFlow } from '../engine/OAuthEngine';

export interface SociAuthProviderProps {
  config: SociAuth_Config;
  children: React.ReactNode;
}

const IDLE_STATE: ProviderState = { status: 'idle' };

function initProviderStates(): Record<ProviderName, ProviderState> {
  return {
    google: { ...IDLE_STATE },
    apple: { ...IDLE_STATE },
    facebook: { ...IDLE_STATE },
    github: { ...IDLE_STATE },
  };
}

export function SociAuthProvider({ config, children }: SociAuthProviderProps) {
  const [providerStates, setProviderStates] = useState<Record<ProviderName, ProviderState>>(
    initProviderStates,
  );

  // Validate and resolve config — recomputes when config changes
  const resolvedConfig = useMemo(() => {
    const validation = validateConfig(config);
    if (!validation.valid) {
      for (const warning of validation.warnings) {
        console.warn(warning.message);
      }
    }
    return mergeConfig(config);
  }, [config]);

  // Resolve theme tokens directly from raw consumer config so that
  // mode-aware defaults (dark/light) are applied before any pre-merge
  // against DEFAULT_THEME pollutes the color values.
  const resolvedTheme = useMemo(
    () => resolveTokens(config.theme ?? {}),
    [config.theme],
  );

  // Direct state setter for children to update provider states
  const updateProviderState = useCallback(
    (providerName: ProviderName, state: ProviderState) => {
      setProviderStates((prev) => ({
        ...prev,
        [providerName]: state,
      }));
    },
    [],
  );

  // triggerOAuth — finds provider config, sets loading, calls initiateFlow, updates state
  const triggerOAuth = useCallback(
    (providerName: ProviderName) => {
      const providerConfig = resolvedConfig.providers.find((p) => p.name === providerName);
      if (!providerConfig) return;

      setProviderStates((prev) => ({
        ...prev,
        [providerName]: { status: 'loading' as const },
      }));

      // Fire logging hook for initiation
      resolvedConfig.behavior.logging?.hook({
        provider: providerName,
        eventType: 'initiation',
        timestamp: Date.now(),
      });

      // initiateFlow returns Promise<OAuthResult> — no popups, no window
      initiateFlow(providerConfig).then((result) => {
        if (result.success) {
          setProviderStates((prev) => ({
            ...prev,
            [providerName]: {
              status: 'success' as const,
              response: result.response,
            },
          }));
          providerConfig.onSuccess?.(result.response);
          resolvedConfig.behavior.logging?.hook({
            provider: providerName,
            eventType: 'success',
            timestamp: Date.now(),
          });
        } else {
          setProviderStates((prev) => ({
            ...prev,
            [providerName]: {
              status: 'error' as const,
              error: result.error,
            },
          }));
          providerConfig.onError?.(result.error);
          resolvedConfig.behavior.logging?.hook({
            provider: providerName,
            eventType: 'failure',
            timestamp: Date.now(),
          });
        }
      });
    },
    [resolvedConfig.providers, resolvedConfig.behavior],
  );

  const isLoading = useCallback(
    (providerName: ProviderName) => providerStates[providerName]?.status === 'loading',
    [providerStates],
  );

  // Sanitize config — replace clientId/redirectUri with empty strings
  const sanitisedConfig = useMemo(() => {
    const sanitisedProviders = resolvedConfig.providers.map(
      ({ clientId: _cid, redirectUri: _ruri, ...rest }) => ({
        ...rest,
        clientId: '',
        redirectUri: '',
      }),
    );
    return { ...resolvedConfig, providers: sanitisedProviders };
  }, [resolvedConfig]);

  const contextValue: SociAuthContextValue = useMemo(
    () => ({
      providers: providerStates,
      theme: resolvedTheme,
      config: sanitisedConfig,
      triggerOAuth,
      isLoading,
      updateProviderState,
    }),
    [providerStates, resolvedTheme, sanitisedConfig, triggerOAuth, isLoading, updateProviderState],
  );

  return (
    <SociAuthContext.Provider value={contextValue}>
      {children}
    </SociAuthContext.Provider>
  );
}
