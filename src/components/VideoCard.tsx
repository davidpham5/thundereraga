import React from 'react';
import { View, Pressable, ImageBackground, ImageSourcePropType } from 'react-native';
import { Text } from './Text';
import { Badge } from './Badge';
import { useTheme } from '../ThemeProvider';

export interface VideoCardProps {
  title: string;
  duration: string;             // "6:42"
  instructor?: string;
  category?: string;            // "NEGOTIATION"
  thumbnail?: ImageSourcePropType;
  /** Solid-color fallback when no thumbnail is provided. */
  thumbnailTint?: string;
  onPress?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  title, duration, instructor, category, thumbnail, thumbnailTint, onPress,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  const Inner = (
    <View style={{ flex: 1, justifyContent: 'flex-end', padding: space[3] }}>
      <View style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center', justifyContent: 'center',
        position: 'absolute', left: '50%', top: '50%',
        marginLeft: -22, marginTop: -22,
      }}>
        <Text style={{ fontSize: 18, color: c.accent, marginLeft: 3 }}>▶</Text>
      </View>
      <View style={{
        position: 'absolute', right: space[3], bottom: space[3],
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: radius.sm,
      }}>
        <Text variant="caption" weight="600" style={{ color: '#fff' }}>{duration}</Text>
      </View>
    </View>
  );

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <View style={{
          borderRadius: radius.md,
          backgroundColor: c.surface,
          borderWidth: 1.5, borderColor: c.border,
          overflow: 'hidden',
          opacity: pressed ? 0.92 : 1,
        }}>
          <View style={{
            aspectRatio: 16 / 9,
            backgroundColor: thumbnailTint ?? c.surfaceSunken,
          }}>
            {thumbnail ? (
              <ImageBackground source={thumbnail} style={{ flex: 1 }}>
                {Inner}
              </ImageBackground>
            ) : Inner}
          </View>
          <View style={{ padding: space[4], gap: 4 }}>
            {category ? (
              <Text variant="eyebrow" tone="subtle">{category}</Text>
            ) : null}
            <Text variant="subtitle" weight="700" numberOfLines={2}>{title}</Text>
            {instructor ? (
              <Text variant="caption" tone="muted">{instructor}</Text>
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
};
