import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from './Text';
import { Badge } from './Badge';
import { useTheme } from '../ThemeProvider';

export type ResourceKind = 'article' | 'pdf' | 'video' | 'guide' | 'link';

export interface ResourceCardProps {
  title: string;
  meta?: string;          // e.g. "3 min read", "PDF download"
  kind?: ResourceKind;
  tag?: string;           // e.g. "WARN Act", "Severance"
  description?: string;
  onPress?: () => void;
}

const kindEmoji: Record<ResourceKind, string> = {
  article: '📄', pdf: '📎', video: '▶', guide: '🧭', link: '↗',
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title, meta, kind = 'article', tag, description, onPress,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: space[4],
          backgroundColor: pressed ? c.surfaceSunken : c.surface,
          borderRadius: radius.md,
          borderWidth: 1.5, borderColor: c.border,
          paddingHorizontal: space[5], paddingVertical: space[4],
          minHeight: 64,
        }}>
          <View style={{
            width: 40, height: 40, borderRadius: radius.sm,
            backgroundColor: c.surfaceSunken,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 18 }}>{kindEmoji[kind]}</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="body" weight="600" numberOfLines={1}>{title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
              {meta ? <Text variant="caption" tone="muted">{meta}</Text> : null}
              {tag ? <Badge label={tag} tone="accent" /> : null}
            </View>
            {description ? (
              <Text variant="caption" tone="muted" numberOfLines={2} style={{ marginTop: 2 }}>
                {description}
              </Text>
            ) : null}
          </View>
          <Text variant="body" tone="subtle">›</Text>
        </View>
      )}
    </Pressable>
  );
};
