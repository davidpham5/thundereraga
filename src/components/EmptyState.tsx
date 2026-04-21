import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { useTheme } from '../ThemeProvider';

export interface EmptyStateProps {
  /** Emoji or icon node rendered in the soft circle. */
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '✨', title, message, actionLabel, onAction, style,
}) => {
  const { theme, space } = useTheme();
  const c = theme.color;
  return (
    <View style={[{
      alignItems: 'center', justifyContent: 'center',
      paddingVertical: space[9], paddingHorizontal: space[6],
      gap: space[4],
    }, style]}>
      <View style={{
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center',
      }}>
        {typeof icon === 'string'
          ? <Text style={{ fontSize: 32 }}>{icon}</Text>
          : icon}
      </View>
      <View style={{ alignItems: 'center', gap: 6, maxWidth: 320 }}>
        <Text variant="heading" align="center">{title}</Text>
        {message ? (
          <Text variant="bodySm" tone="muted" align="center">{message}</Text>
        ) : null}
      </View>
      {actionLabel ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
};
