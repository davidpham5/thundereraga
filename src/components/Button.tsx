import React from 'react';
import {
  Pressable, PressableProps, ActivityIndicator, View, StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /** Leading / trailing content (icon component or emoji string) */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  leading,
  trailing,
  onPress,
  ...rest
}) => {
  const { theme, space, radius, typography } = useTheme();
  const c = theme.color;

  const heights = { sm: 36, md: 48, lg: 56 };
  const paddingsH = { sm: space[5], md: space[6], lg: space[7] };
  const textVariant = size === 'sm' ? 'bodySm' : 'body';

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || loading) return;
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={handlePress}
      disabled={disabled || loading}
      {...rest}
      style={({ pressed }) => {
        const palette = paletteFor(variant, pressed, !!disabled, theme);
        return [{
          height: heights[size],
          paddingHorizontal: paddingsH[size],
          borderRadius: radius.md,
          backgroundColor: palette.bg,
          borderWidth: palette.border ? 1.5 : 0,
          borderColor: palette.border,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: space[3],
          opacity: disabled ? 0.5 : 1,
        }];
      }}
    >
      {loading ? (
        <ActivityIndicator color={labelColor(variant, theme)} />
      ) : (
        <>
          {leading ? <View style={{ justifyContent: 'center' }}>{leading}</View> : null}
          <Text
            variant={textVariant}
            weight="700"
            style={{
              color: labelColor(variant, theme),
              fontFamily: typography.family.sans,
            }}
          >
            {label}
          </Text>
          {trailing ? <View style={{ justifyContent: 'center' }}>{trailing}</View> : null}
        </>
      )}
    </Pressable>
  );
};

function paletteFor(
  variant: ButtonVariant,
  pressed: boolean,
  disabled: boolean,
  theme: ReturnType<typeof useTheme>['theme'],
) {
  const c = theme.color;
  switch (variant) {
    case 'primary':
      return {
        bg: pressed ? c.accentPressed : c.accent,
        border: undefined as string | undefined,
      };
    case 'secondary':
      return {
        bg: pressed ? c.surfaceSunken : c.surface,
        border: c.borderStrong,
      };
    case 'ghost':
      return {
        bg: pressed ? c.surfaceSunken : 'transparent',
        border: undefined,
      };
    case 'danger':
      return {
        bg: pressed ? c.danger : c.danger,
        border: undefined,
      };
  }
}

function labelColor(variant: ButtonVariant, theme: ReturnType<typeof useTheme>['theme']): string {
  const c = theme.color;
  switch (variant) {
    case 'primary': return c.accentOn;
    case 'secondary': return c.text;
    case 'ghost': return c.textAccent;
    case 'danger': return '#fff';
  }
}
