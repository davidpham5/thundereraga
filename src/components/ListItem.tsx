import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  /** Leading slot — usually an Avatar, icon, or emoji Text. */
  leading?: React.ReactNode;
  /** Trailing slot — usually a chevron, badge, or Text value. */
  trailing?: React.ReactNode;
  onPress?: () => void;
  /** Render inside a bordered card surface. Off by default (for use inside a Card). */
  bordered?: boolean;
  /** Hides the default chevron when onPress is set. */
  hideChevron?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * ListItem
 *
 * The universal horizontal row: settings items, resource links, search results.
 * Adds a chevron automatically when `onPress` is set unless `hideChevron`.
 */
export const ListItem: React.FC<ListItemProps> = ({
  title, subtitle, leading, trailing, onPress,
  bordered = false, hideChevron = false, disabled = false, style,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  const interactive = !!onPress && !disabled;

  const Row: React.FC<{ pressed?: boolean }> = ({ pressed }) => (
    <View
      style={[{
        flexDirection: 'row', alignItems: 'center', gap: space[4],
        minHeight: 56,
        paddingHorizontal: bordered ? space[5] : 0,
        paddingVertical: space[3],
        borderRadius: bordered ? radius.md : 0,
        borderWidth: bordered ? 1.5 : 0,
        borderColor: c.border,
        backgroundColor:
          bordered ? (pressed ? c.surfaceSunken : c.surface)
          : pressed ? c.surfaceSunken : 'transparent',
        opacity: disabled ? 0.5 : 1,
      }, style]}
    >
      {leading ? <View>{leading}</View> : null}
      <View style={{ flex: 1 }}>
        <Text variant="body" weight="500" numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={1} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
      {interactive && !hideChevron && !trailing ? (
        <Text variant="body" tone="subtle" style={{ marginLeft: 2 }}>›</Text>
      ) : null}
    </View>
  );

  if (interactive) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        disabled={disabled}
      >
        {({ pressed }) => <Row pressed={pressed} />}
      </Pressable>
    );
  }
  return <Row />;
};
