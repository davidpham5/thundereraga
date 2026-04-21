import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from './Text';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { useTheme } from '../ThemeProvider';

export interface CounselorCardProps {
  name: string;
  headline: string;               // e.g. "Former Eng Manager · 6 yrs peer support"
  tags?: string[];                // e.g. ["Severance", "H-1B"]
  availability?: string;          // e.g. "Available today"
  rating?: number;                // 0..5
  sessions?: number;              // total sessions completed
  avatarName?: string;            // seed for avatar tint; defaults to name
  available?: boolean;            // dot color hint
  onPress?: () => void;
}

export const CounselorCard: React.FC<CounselorCardProps> = ({
  name, headline, tags = [], availability, rating, sessions, avatarName, available, onPress,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  return (
    <Pressable onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}>
      {({ pressed }) => (
        <View style={{
          backgroundColor: pressed ? c.surfaceSunken : c.surface,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: c.border,
          padding: space[5],
          gap: space[4],
        }}>
          <View style={{ flexDirection: 'row', gap: space[4], alignItems: 'flex-start' }}>
            <Avatar size="lg" name={avatarName ?? name} ring={available ? 'support' : 'none'} />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
                <Text variant="subtitle" weight="700" style={{ flex: 1 }}>{name}</Text>
                {availability ? (
                  <Badge label={availability}
                    tone={available ? 'success' : 'neutral'} dot={available} />
                ) : null}
              </View>
              <Text variant="bodySm" tone="muted" numberOfLines={2}>{headline}</Text>
            </View>
          </View>
          {tags.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
              {tags.map((t) => (
                <Badge key={t} label={t} tone="accent" />
              ))}
            </View>
          ) : null}
          {(rating != null || sessions != null) ? (
            <View style={{ flexDirection: 'row', gap: space[5], alignItems: 'center' }}>
              {rating != null ? (
                <Text variant="caption" tone="muted">★ {rating.toFixed(1)}</Text>
              ) : null}
              {sessions != null ? (
                <Text variant="caption" tone="muted">{sessions}+ sessions</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      )}
    </Pressable>
  );
};
