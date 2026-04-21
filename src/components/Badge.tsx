import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export type BadgeTone = 'neutral' | 'accent' | 'support' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  label: string;
  tone?: BadgeTone;
  size?: BadgeSize;
  /** Dot indicator on the left */
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  tone = 'neutral',
  size = 'sm',
  dot = false,
  style,
  ...rest
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  const palette = (() => {
    switch (tone) {
      case 'accent':  return { bg: c.accentSoft, fg: c.textAccent, dot: c.accent };
      case 'support': return { bg: c.supportSoft, fg: c.support, dot: c.support };
      case 'success': return { bg: c.successSoft, fg: c.success, dot: c.success };
      case 'warning': return { bg: c.warningSoft, fg: c.warning, dot: c.warning };
      case 'danger':  return { bg: c.dangerSoft, fg: c.danger, dot: c.danger };
      default:        return { bg: c.surfaceSunken, fg: c.textMuted, dot: c.textSubtle };
    }
  })();

  const h = size === 'sm' ? 22 : 28;
  const padH = size === 'sm' ? space[3] : space[4];

  return (
    <View
      {...rest}
      style={[{
        height: h,
        paddingHorizontal: padH,
        borderRadius: radius.pill,
        backgroundColor: palette.bg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[2],
        alignSelf: 'flex-start',
      }, style]}
    >
      {dot ? (
        <View style={{
          width: 6, height: 6, borderRadius: 3, backgroundColor: palette.dot,
        }} />
      ) : null}
      <Text variant="caption" weight="600" style={{ color: palette.fg }}>
        {label}
      </Text>
    </View>
  );
};
