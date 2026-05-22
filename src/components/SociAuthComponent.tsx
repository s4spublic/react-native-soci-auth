import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type {
  ProviderName,
  Alignment,
  SociAuthComponentProps,
} from '../types';
import { useSociAuth } from '../hooks/useSociAuth';
import { SociAuthProvider } from '../context/SociAuthProvider';
import { AuthCard } from './AuthCard';
import { SocialButton } from './SocialButton';
import { Divider } from './Divider';
import { Banner } from './Banner';

// ─── Alignment mapping ──────────────────────────────────────────

const ALIGNMENT_MAP: Record<Alignment, ViewStyle['alignItems']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

// ─── Inner component (must be inside a SociAuthProvider) ────────

const SociAuthComponentInner: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { config, providers, updateProviderState } = useSociAuth();

  const [bannerState, setBannerState] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const resolvedLayout = config.layout;

  // ── React to provider state changes for Banner display ────────
  useEffect(() => {
    for (const providerName of Object.keys(providers) as ProviderName[]) {
      const providerState = providers[providerName];
      if (providerState.status === 'success') {
        setBannerState({
          type: 'success',
          message: `Signed in with ${providerName}`,
        });
        return;
      }
      if (providerState.status === 'error' && providerState.error) {
        // User closed the browser — not an error, reset silently
        if (providerState.error.errorType === 'user_cancelled') {
          updateProviderState(providerName, { status: 'idle' });
          return;
        }
        setBannerState({
          type: 'error',
          message: providerState.error.message,
        });
        return;
      }
    }
  }, [providers, updateProviderState]);

  // ── Banner dismiss: also reset settled providers to idle so the
  //    banner doesn't reappear when the component remounts (tab switch).
  const handleBannerDismiss = useCallback(() => {
    setBannerState(null);
    for (const providerName of Object.keys(providers) as ProviderName[]) {
      const providerState = providers[providerName];
      if (providerState.status === 'success' || providerState.status === 'error') {
        updateProviderState(providerName, { status: 'idle' });
      }
    }
  }, [providers, updateProviderState]);

  // ── Container styles ──────────────────────────────────────────
  const isHorizontal = resolvedLayout.direction === 'horizontal';
  const isIconOnly = config.buttonVariant === 'icon-only' || !resolvedLayout.showLabels;

  const containerStyle = useMemo<ViewStyle>(() => ({
    flexDirection: isHorizontal ? 'row' : 'column',
    // Vertical + has labels → stretch so all buttons are equal width
    // Vertical + icon-only → use alignment (buttons are square, don't stretch)
    // Horizontal → center vertically, use justifyContent for horizontal alignment
    alignItems: isHorizontal
      ? 'center'
      : isIconOnly
        ? (ALIGNMENT_MAP[resolvedLayout.alignment] ?? 'center')
        : 'stretch',
    justifyContent: isHorizontal
      ? (ALIGNMENT_MAP[resolvedLayout.alignment] as ViewStyle['justifyContent'])
      : undefined,
    gap: resolvedLayout.spacing,
    flexWrap: isHorizontal ? 'wrap' : undefined,
  }), [isHorizontal, isIconOnly, resolvedLayout.alignment, resolvedLayout.spacing]);

  // ── Render provider buttons with optional dividers ────────────
  const validProviders = config.providers;
  const enable3DDepth = config.enable3DDepth;
  const enableHoverFill = config.enableHoverFill;
  const hoverFillColor = config.hoverFillColor;
  const contentAlignment = config.contentAlignment;
  const buttonTextColor = config.buttonTextColor;
  const buttonSizeScale = config.buttonSizeScale;

  const buttonElements = useMemo(() => {
    const elements: React.ReactNode[] = [];

    validProviders.forEach((provider, index) => {
      // When showLabels is false, override variant to icon-only
      const variant = resolvedLayout.showLabels
        ? provider.resolvedVariant
        : 'icon-only' as const;

      elements.push(
        <SocialButton
          key={provider.name}
          provider={provider.name}
          label={provider.label}
          icon={provider.icon}
          variant={variant}
          theme={provider.resolvedTheme ? { ...provider.resolvedTheme } : undefined}
          sizeScale={buttonSizeScale}
          enable3DDepth={enable3DDepth}
          enableHoverFill={enableHoverFill}
          hoverFillColor={hoverFillColor}
          contentAlignment={contentAlignment}
          buttonTextColor={buttonTextColor || undefined}
          disabled={providers[provider.name]?.status === 'loading'}
        />,
      );

      // Render divider between buttons (not after the last one)
      if (resolvedLayout.showDividers && index < validProviders.length - 1) {
        elements.push(
          <Divider
            key={`divider-${provider.name}`}
            label="or"
            direction={resolvedLayout.direction}
          />,
        );
      }
    });

    return elements;
  }, [
    validProviders,
    resolvedLayout.showLabels,
    resolvedLayout.showDividers,
    resolvedLayout.direction,
    providers,
    buttonSizeScale,
    enable3DDepth,
    enableHoverFill,
    hoverFillColor,
    contentAlignment,
    buttonTextColor,
  ]);

  // ── Render ────────────────────────────────────────────────────
  const content = (
    <View style={containerStyle}>
      {buttonElements}
    </View>
  );

  return (
    <View style={style}>
      {config.showCard ? (
        <AuthCard
          title={config.cardTitle}
          subtitle={config.cardSubtitle}
          titleColor={config.cardTitleColor || undefined}
          subtitleColor={config.cardSubtitleColor || undefined}
        >
          {content}
        </AuthCard>
      ) : (
        content
      )}

      {bannerState && (
        <Banner
          type={bannerState.type}
          message={bannerState.message}
          onDismiss={handleBannerDismiss}
          style={{ marginTop: 12 }}
        />
      )}
    </View>
  );
};

SociAuthComponentInner.displayName = 'SociAuthComponentInner';

// ─── Public component ────────────────────────────────────────────
// If a config prop is provided, wrap in its own SociAuthProvider.
// Otherwise, use the existing context from a parent SociAuthProvider.

const SociAuthComponentOuter: React.FC<SociAuthComponentProps> = ({
  config,
  style,
}) => {
  if (config) {
    return (
      <SociAuthProvider config={config}>
        <SociAuthComponentInner style={style} />
      </SociAuthProvider>
    );
  }

  return <SociAuthComponentInner style={style} />;
};

SociAuthComponentOuter.displayName = 'SociAuthComponent';

export const SociAuthComponent = React.memo(SociAuthComponentOuter);
