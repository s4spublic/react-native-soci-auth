import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Switch,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { DemoState } from '../hooks/useDemoState';
import type {
  ProviderName,
  ButtonVariant,
  ButtonShape,
  IconPosition,
  ButtonSize,
  ThemeMode,
  Alignment,
} from 'react-native-soci-auth';

interface ControlPanelProps {
  state: DemoState;
  setters: Record<string, (...args: any[]) => void>;
  onReset: () => void;
}

const PROVIDERS: ProviderName[] = ['google', 'apple', 'facebook', 'github'];

// ─── Reusable Controls ───────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <View style={styles.segmentedRow}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          style={[styles.segmentBtn, value === opt && styles.segmentBtnActive]}
          onPress={() => onChange(opt)}
        >
          <Text
            style={[
              styles.segmentBtnText,
              value === opt && styles.segmentBtnTextActive,
            ]}
          >
            {opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function SwitchRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}) {
  return (
    <View style={styles.controlRow}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  displayValue?: string;
}) {
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.controlRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{displayValue ?? String(value)}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View
          style={[
            styles.sliderFill,
            { width: `${((value - min) / (max - min)) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.sliderButtonRow}>
        <Pressable
          style={styles.sliderStepBtn}
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Text style={styles.sliderStepBtnText}>−</Text>
        </Pressable>
        <TextInput
          style={styles.sliderInput}
          value={String(Math.round(value * 100) / 100)}
          keyboardType="numeric"
          onChangeText={(text) => {
            const num = parseFloat(text);
            if (!isNaN(num) && num >= min && num <= max) onChange(num);
          }}
        />
        <Pressable
          style={styles.sliderStepBtn}
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Text style={styles.sliderStepBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TextInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder="Enter value..."
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

function ColorInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View style={styles.textInputContainer}>
      <View style={styles.controlRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.colorSwatch, { backgroundColor: value || '#ccc' }]} />
      </View>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder="#000000"
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  setters,
  onReset,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ─── Providers ─────────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Providers" />
        {PROVIDERS.map((provider) => (
          <SwitchRow
            key={provider}
            label={provider.charAt(0).toUpperCase() + provider.slice(1)}
            value={state.enabledProviders[provider]}
            onValueChange={() => setters.toggleProvider(provider)}
          />
        ))}
      </View>

      {/* ─── Button Style ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Button Style" />
        <SegmentedControl<ButtonVariant>
          options={['text-only', 'icon-plus-text', 'icon-only']}
          value={state.buttonVariant}
          onChange={(val) => setters.setButtonVariant(val)}
        />
      </View>

      {/* ─── Layout ────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Layout" />
        <Text style={styles.sublabel}>Direction</Text>
        <SegmentedControl<'horizontal' | 'vertical'>
          options={['horizontal', 'vertical']}
          value={state.direction}
          onChange={(val) => setters.setDirection(val)}
        />
        <Text style={styles.sublabel}>Layout Alignment</Text>
        <SegmentedControl<Alignment>
          options={['left', 'center', 'right']}
          value={state.alignment}
          onChange={(val) => setters.setAlignment(val)}
        />
        <Text style={styles.sublabel}>Content Alignment</Text>
        <SegmentedControl<Alignment>
          options={['left', 'center', 'right']}
          value={state.contentAlignment}
          onChange={(val) => setters.setContentAlignment(val)}
        />
        <SliderRow
          label="Spacing"
          value={state.spacing}
          min={0}
          max={48}
          step={1}
          onChange={(val) => setters.setSpacing(val)}
          displayValue={`${state.spacing}`}
        />
        <SwitchRow
          label="Show Labels"
          value={state.showLabels}
          onValueChange={(val) => setters.setShowLabels(val)}
        />
        <SwitchRow
          label="Show Dividers"
          value={state.showDividers}
          onValueChange={(val) => setters.setShowDividers(val)}
        />
        <SwitchRow
          label="Show Card"
          value={state.showCard}
          onValueChange={(val) => setters.setShowCard(val)}
        />
      </View>

      {/* ─── Theme ─────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Theme" />
        <Text style={styles.sublabel}>Mode</Text>
        <SegmentedControl<ThemeMode>
          options={['light', 'dark']}
          value={state.themeMode}
          onChange={(val) => setters.setThemeMode(val)}
        />
        <Text style={styles.sublabel}>Button Shape</Text>
        <SegmentedControl<ButtonShape>
          options={['pill', 'rounded', 'square']}
          value={state.buttonShape}
          onChange={(val) => setters.setButtonShape(val)}
        />
        <Text style={styles.sublabel}>Icon Position</Text>
        <SegmentedControl<IconPosition>
          options={['left', 'right', 'top']}
          value={state.iconPosition}
          onChange={(val) => setters.setIconPosition(val)}
        />
        <Text style={styles.sublabel}>Size</Text>
        <SegmentedControl<ButtonSize>
          options={['small', 'medium', 'large']}
          value={state.buttonSize}
          onChange={(val) => setters.setButtonSize(val)}
        />
        <SliderRow
          label="Size Scale"
          value={state.buttonSizeScale}
          min={0.5}
          max={2.5}
          step={0.1}
          onChange={(val) => setters.setButtonSizeScale(Math.round(val * 10) / 10)}
          displayValue={`${state.buttonSizeScale.toFixed(1)}×`}
        />
      </View>

      {/* ─── Glass Effect ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Glass Effect" />
        <SliderRow
          label="Opacity"
          value={state.glassOpacity}
          min={0}
          max={1}
          step={0.05}
          onChange={(val) => setters.setGlassOpacity(val)}
          displayValue={state.glassOpacity.toFixed(2)}
        />
      </View>

      {/* ─── Effects ───────────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Effects" />
        <SwitchRow
          label="3D Depth"
          value={state.enable3DDepth}
          onValueChange={(val) => setters.setEnable3DDepth(val)}
        />
        <SwitchRow
          label="Hover Fill"
          value={state.enableHoverFill}
          onValueChange={(val) => setters.setEnableHoverFill(val)}
        />
        {state.enableHoverFill && (
          <ColorInputRow
            label="Fill Color"
            value={state.hoverFillColor}
            onChange={(val) => setters.setHoverFillColor(val)}
          />
        )}
      </View>

      {/* ─── Card Content ─────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Card Content" />
        <TextInputRow
          label="Card Title"
          value={state.cardTitle}
          onChange={(val) => setters.setCardTitle(val)}
        />
        <TextInputRow
          label="Card Subtitle"
          value={state.cardSubtitle}
          onChange={(val) => setters.setCardSubtitle(val)}
        />
        <ColorInputRow
          label="Title Color"
          value={state.cardTitleColor}
          onChange={(val) => setters.setCardTitleColor(val)}
        />
        <ColorInputRow
          label="Subtitle Color"
          value={state.cardSubtitleColor}
          onChange={(val) => setters.setCardSubtitleColor(val)}
        />
      </View>

      {/* ─── Button Text ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Button Text" />
        <ColorInputRow
          label="Text Color"
          value={state.buttonTextColor}
          onChange={(val) => setters.setButtonTextColor(val)}
        />
        {state.buttonTextColor !== '' && (
          <Pressable onPress={() => setters.setButtonTextColor('')}>
            <Text style={styles.resetLink}>Reset to default</Text>
          </Pressable>
        )}
      </View>

      {/* ─── Button Labels ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionTitle title="Button Labels" />
        {PROVIDERS.filter((p) => state.enabledProviders[p]).map((provider) => (
          <TextInputRow
            key={provider}
            label={provider.charAt(0).toUpperCase() + provider.slice(1)}
            value={state.providerLabels[provider]}
            onChange={(val) => setters.setProviderLabel(provider, val)}
          />
        ))}
      </View>

      {/* ─── Reset ─────────────────────────────────────── */}
      <Pressable style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Reset to Defaults</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ControlPanel;

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#64748b',
    marginBottom: 10,
  },
  sublabel: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#334155',
  },
  valueText: {
    fontSize: 13,
    color: '#64748b',
  },
  segmentedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  segmentBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  segmentBtnText: {
    fontSize: 13,
    color: '#334155',
  },
  segmentBtnTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sliderContainer: {
    marginBottom: 8,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 8,
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  sliderButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sliderStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderStepBtnText: {
    fontSize: 18,
    color: '#334155',
    fontWeight: '600',
  },
  sliderInput: {
    width: 60,
    height: 32,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 13,
    color: '#334155',
  },
  textInputContainer: {
    marginBottom: 8,
  },
  textInput: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    color: '#334155',
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  resetLink: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 2,
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
});
