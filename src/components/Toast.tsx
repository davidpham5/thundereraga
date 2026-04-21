import React, { useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export type ToastTone = 'neutral' | 'success' | 'danger';

export interface ToastProps {
  visible: boolean;
  label: string;
  tone?: ToastTone;
  /** Auto-dismiss duration in ms. Set 0 to disable. */
  duration?: number;
  onDismiss?: () => void;
  style?: ViewStyle;
}

/**
 * Toast — floating feedback. Host as a sibling at the root of your screen
 * and control with state. A provider / queue can be added later.
 */
export const Toast: React.FC<ToastProps> = ({
  visible, label, tone = 'neutral', duration = 3000, onDismiss, style,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;
  const anim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0, duration: 180, useNativeDriver: true,
    }).start();
    if (visible && duration > 0) {
      const t = setTimeout(() => onDismiss?.(), duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration, anim, onDismiss]);

  const bg =
    tone === 'success' ? c.success
    : tone === 'danger' ? c.danger
    : c.text;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[{
        position: 'absolute', bottom: space[8], left: space[5], right: space[5],
        padding: space[4], borderRadius: radius.md,
        backgroundColor: bg,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 }, elevation: 6,
      }, style]}
    >
      <Text variant="bodySm" weight="600" style={{ color: '#fff', textAlign: 'center' }}>
        {label}
      </Text>
    </Animated.View>
  );
};
