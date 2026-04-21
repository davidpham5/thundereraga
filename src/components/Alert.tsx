import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  title: string;
  message?: string;
  tone?: AlertTone;
  /** Optional inline action (e.g. "Dismiss", "Book a review"). */
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  title, message, tone = 'info', actionLabel, onAction, onClose,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  const pal = {
    info:    { bg: c.supportSoft, fg: c.support, rail: c.support, icon: 'ⓘ' },
    success: { bg: c.successSoft, fg: c.success, rail: c.success, icon: '✓' },
    warning: { bg: c.warningSoft, fg: c.warning, rail: c.warning, icon: '!' },
    danger:  { bg: c.dangerSoft,  fg: c.danger,  rail: c.danger,  icon: '!' },
  }[tone];

  return (
    <View style={{
      flexDirection: 'row', gap: space[4],
      padding: space[5], borderRadius: radius.md,
      backgroundColor: pal.bg, overflow: 'hidden', position: 'relative',
    }}>
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: pal.rail }} />
      <View style={{
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: pal.rail, alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{pal.icon}</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" weight="700">{title}</Text>
        {message ? <Text variant="bodySm" tone="muted">{message}</Text> : null}
        {actionLabel ? (
          <Pressable onPress={onAction} hitSlop={6}>
            <Text variant="bodySm" weight="700" style={{ color: pal.fg, marginTop: 6 }}>
              {actionLabel} →
            </Text>
          </Pressable>
        ) : null}
      </View>
      {onClose ? (
        <Pressable onPress={onClose} hitSlop={8}>
          <Text variant="body" tone="muted">×</Text>
        </Pressable>
      ) : null}
    </View>
  );
};
