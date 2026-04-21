import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message, style }) => {
  const { theme, space } = useTheme();
  return (
    <View style={[{
      alignItems: 'center', justifyContent: 'center',
      paddingVertical: space[9], gap: space[4],
    }, style]}>
      <ActivityIndicator color={theme.color.accent} />
      {message ? <Text variant="bodySm" tone="muted">{message}</Text> : null}
    </View>
  );
};
