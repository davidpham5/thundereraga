import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../ThemeProvider';

export type CardVariant = 'surface' | 'outline' | 'soft';
export type CardAccent = 'none' | 'warning' | 'danger' | 'success' | 'accent';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  /** Optional colored left-rail accent (for status / urgency cards). */
  accent?: CardAccent;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  variant = 'outline',
  accent = 'none',
  padding,
  style,
  children,
  ...rest
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  const pad = padding ?? space[5];

  const variantStyle = (() => {
    switch (variant) {
      case 'surface':
        return { backgroundColor: c.surface, borderWidth: 0 };
      case 'outline':
        return { backgroundColor: c.surface, borderWidth: 1.5, borderColor: c.border };
      case 'soft':
        return { backgroundColor: c.surfaceSunken, borderWidth: 0 };
    }
  })();

  const accentColor = (() => {
    switch (accent) {
      case 'warning': return c.warning;
      case 'danger':  return c.danger;
      case 'success': return c.success;
      case 'accent':  return c.accent;
      default: return null;
    }
  })();

  // Warm-toned soft background when accent is set
  const accentBg = (() => {
    switch (accent) {
      case 'warning': return c.warningSoft;
      case 'danger':  return c.dangerSoft;
      case 'success': return c.successSoft;
      case 'accent':  return c.accentSoft;
      default: return null;
    }
  })();

  return (
    <View
      {...rest}
      style={[
        {
          borderRadius: radius.lg,
          padding: pad,
          ...variantStyle,
          ...(accentBg ? { backgroundColor: accentBg, borderWidth: 0 } : {}),
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {accentColor ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 4,
            backgroundColor: accentColor,
          }}
        />
      ) : null}
      {children}
    </View>
  );
};
