import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../ThemeProvider';

export interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  inset?: number;
  strength?: 'subtle' | 'strong';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  inset = 0,
  strength = 'subtle',
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const color = strength === 'strong' ? theme.color.borderStrong : theme.color.divider;
  return (
    <View
      {...rest}
      style={[
        orientation === 'horizontal'
          ? { height: 1, backgroundColor: color, marginHorizontal: inset, alignSelf: 'stretch' }
          : { width: 1, backgroundColor: color, marginVertical: inset, alignSelf: 'stretch' },
        style,
      ]}
    />
  );
};
