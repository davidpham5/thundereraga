import React, { useState } from 'react';
import { View, Pressable, Modal, FlatList, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface SelectProps<T extends string = string> {
  label?: string;
  placeholder?: string;
  value?: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export function Select<T extends string = string>({
  label, placeholder = 'Select…', value, options, onChange,
  helperText, errorText, disabled, containerStyle,
}: SelectProps<T>) {
  const { theme, space, radius } = useTheme();
  const c = theme.color;
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.value === value);
  const hasError = !!errorText;

  return (
    <View style={[{ gap: space[2] }, containerStyle]}>
      {label ? (
        <Text variant="caption" weight="600" tone="muted">{label}</Text>
      ) : null}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={({ pressed }) => ({
          minHeight: 52,
          paddingHorizontal: space[5],
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor: hasError ? c.danger : c.borderStrong,
          backgroundColor: pressed ? c.surfaceSunken : c.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: disabled ? 0.5 : 1,
        })}
      >
        <Text variant="body" tone={current ? 'default' : 'subtle'}>
          {current ? current.label : placeholder}
        </Text>
        <Text variant="body" tone="muted">▾</Text>
      </Pressable>

      {errorText ? (
        <Text variant="caption" tone="danger">{errorText}</Text>
      ) : helperText ? (
        <Text variant="caption" tone="subtle">{helperText}</Text>
      ) : null}

      <Modal
        transparent
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={() => { /* trap */ }}
            style={{
              backgroundColor: c.surface,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingVertical: space[5],
              paddingHorizontal: space[5],
              gap: space[3],
              maxHeight: '70%',
            }}
          >
            <View style={{
              alignSelf: 'center', width: 40, height: 4,
              borderRadius: 2, backgroundColor: c.borderStrong,
              marginBottom: space[3],
            }} />
            {label ? <Text variant="subtitle">{label}</Text> : null}
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: c.divider }} />
              )}
              renderItem={({ item }) => {
                const selected = item.value === value;
                return (
                  <Pressable
                    onPress={() => { onChange(item.value); setOpen(false); }}
                    style={({ pressed }) => ({
                      paddingVertical: space[4],
                      backgroundColor: pressed ? c.surfaceSunken : 'transparent',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: space[3],
                    })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text variant="body" weight={selected ? '600' : '400'}>
                        {item.label}
                      </Text>
                      {item.description ? (
                        <Text variant="caption" tone="muted">{item.description}</Text>
                      ) : null}
                    </View>
                    {selected ? (
                      <Text variant="body" style={{ color: c.accent }}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
