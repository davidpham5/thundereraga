import React, { forwardRef, useState } from 'react';
import {
  View, TextInput, TextInputProps, Pressable, ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Static prefix inside the field (e.g. "@") */
  prefix?: string;
  /** Leading / trailing slots (icons, buttons, counters) */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  optional?: boolean;
  /** Mark as required (shows asterisk) */
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label, prefix, leading, trailing,
    helperText, errorText, optional, required,
    onFocus, onBlur, containerStyle, ...inputProps
  },
  ref,
) {
  const { theme, space, radius, typography } = useTheme();
  const c = theme.color;
  const [focused, setFocused] = useState(false);

  const hasError = !!errorText;
  const borderColor =
    hasError ? c.danger
    : focused ? c.accent
    : c.borderStrong;

  return (
    <View style={[{ gap: space[2] }, containerStyle]}>
      {label ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="caption" weight="600" tone="muted">
            {label}{required ? ' *' : ''}
          </Text>
          {optional ? (
            <Text variant="caption" tone="subtle">Optional</Text>
          ) : null}
        </View>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 52,
          paddingHorizontal: space[5],
          gap: space[3],
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor,
          backgroundColor: c.surface,
        }}
      >
        {leading ? <View>{leading}</View> : null}
        {prefix ? (
          <Text variant="body" tone="muted">{prefix}</Text>
        ) : null}
        <TextInput
          ref={ref}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          placeholderTextColor={c.textSubtle}
          selectionColor={c.accent}
          {...inputProps}
          style={{
            flex: 1,
            fontFamily: typography.family.sans,
            fontSize: 16,
            color: c.text,
            paddingVertical: space[3],
          }}
        />
        {trailing ? <View>{trailing}</View> : null}
      </View>

      {errorText ? (
        <Text variant="caption" tone="danger">{errorText}</Text>
      ) : helperText ? (
        <Text variant="caption" tone="subtle">{helperText}</Text>
      ) : null}
    </View>
  );
});
