import React from 'react';
import { View, Pressable, Animated, Easing } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface ToggleProps {
  label?: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label, description, value, onChange, disabled,
}) => {
  const { theme, space } = useTheme();
  const c = theme.color;
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [c.borderStrong, c.accent],
  });
  const thumbX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[4],
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {(label || description) ? (
        <View style={{ flex: 1 }}>
          {label ? <Text variant="body" weight="500">{label}</Text> : null}
          {description ? (
            <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>
              {description}
            </Text>
          ) : null}
        </View>
      ) : null}
      <Animated.View style={{
        width: 46, height: 26, borderRadius: 13,
        backgroundColor: trackColor as unknown as string,
        justifyContent: 'center',
      }}>
        <Animated.View style={{
          width: 22, height: 22, borderRadius: 11,
          backgroundColor: '#fff',
          transform: [{ translateX: thumbX }],
          shadowColor: '#000', shadowOpacity: 0.15,
          shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }} />
      </Animated.View>
    </Pressable>
  );
};
