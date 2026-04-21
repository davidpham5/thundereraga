import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface CheckboxProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Use 'card' when it's a big tappable row with a border. */
  variant?: 'inline' | 'card';
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label, description, checked, onChange, disabled = false, variant = 'inline', style,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [{
        flexDirection: 'row',
        alignItems: variant === 'card' ? 'flex-start' : 'center',
        gap: space[4],
        padding: variant === 'card' ? space[5] : 0,
        borderRadius: radius.md,
        borderWidth: variant === 'card' ? 1.5 : 0,
        borderColor: checked && variant === 'card' ? c.accent : c.border,
        backgroundColor:
          variant === 'card'
            ? (checked ? c.accentSoft : pressed ? c.surfaceSunken : c.surface)
            : 'transparent',
        opacity: disabled ? 0.5 : 1,
      }, style]}
    >
      <View style={{
        width: 22, height: 22, borderRadius: 6,
        borderWidth: 2,
        borderColor: checked ? c.accent : c.borderStrong,
        backgroundColor: checked ? c.accent : 'transparent',
        alignItems: 'center', justifyContent: 'center',
        marginTop: variant === 'card' ? 2 : 0,
      }}>
        {checked ? (
          <Text style={{ color: c.accentOn, fontSize: 14, fontWeight: '800', lineHeight: 14 }}>✓</Text>
        ) : null}
      </View>
      {(label || description) ? (
        <View style={{ flex: 1 }}>
          {label ? (
            <Text variant="body" weight={checked ? '600' : '500'}>{label}</Text>
          ) : null}
          {description ? (
            <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>{description}</Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
};
