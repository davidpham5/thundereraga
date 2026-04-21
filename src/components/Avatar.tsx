import React from 'react';
import { View, Image, ViewProps, ImageSourcePropType } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ViewProps {
  size?: AvatarSize;
  /** If provided, shows a photo. Otherwise shows initials + deterministic tint. */
  source?: ImageSourcePropType;
  /** Used to generate a color when no source is provided. Pass display name / handle. */
  name?: string;
  /** Overrides generated initials */
  initials?: string;
  /** Show a small ring (e.g. "verified" / "online"). */
  ring?: 'none' | 'support' | 'accent';
}

const sizeMap: Record<AvatarSize, { d: number; font: number }> = {
  xs: { d: 24, font: 11 },
  sm: { d: 32, font: 12 },
  md: { d: 44, font: 15 },
  lg: { d: 56, font: 18 },
  xl: { d: 72, font: 24 },
};

// 8 warm, accessible tints (match the Figma palette sensibility)
const TINTS = [
  '#C56641', '#A65236', '#B86E1E', '#2E8B57',
  '#3F8A82', '#255851', '#6B4EA8', '#8B3A6E',
];

function hashTint(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return TINTS[Math.abs(h) % TINTS.length];
}

function deriveInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/[\s-_]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  name,
  initials,
  ring = 'none',
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const { d, font } = sizeMap[size];

  const tint = hashTint(name ?? 'user');
  const ringColor =
    ring === 'support' ? theme.color.support
    : ring === 'accent' ? theme.color.accent
    : 'transparent';

  const inner = d - (ring !== 'none' ? 4 : 0);

  return (
    <View
      {...rest}
      style={[{
        width: d, height: d, borderRadius: d / 2,
        backgroundColor: ringColor,
        alignItems: 'center', justifyContent: 'center',
        padding: ring !== 'none' ? 2 : 0,
      }, style]}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View
          style={{
            width: inner, height: inner, borderRadius: inner / 2,
            backgroundColor: tint,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: font,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {initials ?? deriveInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};
