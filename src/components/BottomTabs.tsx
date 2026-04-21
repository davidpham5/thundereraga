import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface BottomTabItem {
  key: string;
  label: string;
  /** Emoji or a <Svg> icon component. Kept flexible by design. */
  icon: React.ReactNode;
  /** Optional badge count shown on the icon */
  badge?: number;
}

export interface BottomTabsProps {
  items: BottomTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  /** Add safe-area bottom inset if not inside a SafeAreaView */
  bottomInset?: number;
  style?: ViewStyle;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  items, activeKey, onChange, bottomInset = 0, style,
}) => {
  const { theme, space } = useTheme();
  const c = theme.color;

  return (
    <View style={[{
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderTopWidth: 1,
      borderTopColor: c.divider,
      paddingBottom: bottomInset,
    }, style]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(item.key)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: space[4],
              alignItems: 'center',
              gap: 2,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View style={{ position: 'relative' }}>
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 24 }}>
                {/* Icon slot; consumer passes emoji or SVG */}
                <Text style={{ fontSize: 20, color: active ? c.accent : c.textMuted }}>
                  {item.icon as any}
                </Text>
              </View>
              {item.badge && item.badge > 0 ? (
                <View style={{
                  position: 'absolute', top: -2, right: -8,
                  minWidth: 16, height: 16, borderRadius: 8,
                  backgroundColor: c.danger,
                  paddingHorizontal: 4,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              variant="caption"
              weight={active ? '700' : '500'}
              style={{ color: active ? c.accent : c.textMuted }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
