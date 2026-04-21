import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface RadioGroupProps<T extends string = string> {
  label?: string;
  value?: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  /** 'card' for emphasized full-width cards, 'inline' for compact rows. */
  variant?: 'card' | 'inline';
  containerStyle?: ViewStyle;
}

export function RadioGroup<T extends string = string>({
  label, value, onChange, options, variant = 'card', containerStyle,
}: RadioGroupProps<T>) {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  return (
    <View style={[{ gap: space[3] }, containerStyle]}>
      {label ? (
        <Text variant="caption" weight="600" tone="muted">{label}</Text>
      ) : null}
      <View style={{ gap: variant === 'card' ? space[3] : space[2] }}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: variant === 'card' ? 'flex-start' : 'center',
                gap: space[4],
                padding: variant === 'card' ? space[5] : space[3],
                borderRadius: radius.md,
                borderWidth: variant === 'card' ? 1.5 : 0,
                borderColor: selected ? c.accent : c.border,
                backgroundColor:
                  selected && variant === 'card' ? c.accentSoft
                  : pressed ? c.surfaceSunken
                  : variant === 'card' ? c.surface : 'transparent',
              })}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 11,
                borderWidth: 2,
                borderColor: selected ? c.accent : c.borderStrong,
                alignItems: 'center', justifyContent: 'center',
                marginTop: variant === 'card' ? 2 : 0,
              }}>
                {selected ? (
                  <View style={{
                    width: 10, height: 10, borderRadius: 5,
                    backgroundColor: c.accent,
                  }} />
                ) : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" weight={selected ? '600' : '500'}>
                  {opt.label}
                </Text>
                {opt.description ? (
                  <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>
                    {opt.description}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
