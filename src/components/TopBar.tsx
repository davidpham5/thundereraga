import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface TopBarProps {
  title?: string;
  /** Element rendered on the left (e.g. <BackButton />) */
  leading?: React.ReactNode;
  /** Element rendered on the right (e.g. avatar, icon button) */
  trailing?: React.ReactNode;
  /** If true, shows a hairline divider under the bar */
  divider?: boolean;
  style?: ViewStyle;
}

export const TopBar: React.FC<TopBarProps> = ({
  title, leading, trailing, divider = true, style,
}) => {
  const { theme, space } = useTheme();
  const c = theme.color;

  return (
    <View style={[{
      minHeight: 52,
      paddingHorizontal: space[4],
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: c.bg,
      borderBottomWidth: divider ? 1 : 0,
      borderBottomColor: c.divider,
    }, style]}>
      <View style={{ minWidth: 56, flexDirection: 'row', alignItems: 'center' }}>
        {leading}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {title ? (
          <Text variant="subtitle" weight="700" numberOfLines={1}>{title}</Text>
        ) : null}
      </View>
      <View style={{ minWidth: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {trailing}
      </View>
    </View>
  );
};

export interface BackButtonProps {
  onPress?: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, label = 'Back' }) => {
  const { theme, space } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 2,
        paddingVertical: space[3], paddingHorizontal: space[2],
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text variant="body" style={{ color: theme.color.textLink, fontSize: 18, lineHeight: 20 }}>‹</Text>
      <Text variant="body" style={{ color: theme.color.textLink }}>{label}</Text>
    </Pressable>
  );
};

export interface SectionHeaderProps {
  title: string;
  /** Right-aligned action (usually a "See all" pressable text). */
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, style }) => {
  const { space } = useTheme();
  return (
    <View style={[{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: space[3],
    }, style]}>
      <Text variant="eyebrow" tone="subtle">{title}</Text>
      {action}
    </View>
  );
};
