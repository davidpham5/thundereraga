import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface MessageBubbleProps {
  /** 'me' right-aligned, accent fill; 'them' left-aligned, surface fill. */
  from: 'me' | 'them';
  /** Sender label shown above 'them' bubbles (e.g. "Anonymous_Eng_91"). */
  author?: string;
  text: string;
  /** HH:MM formatted or relative time string. */
  time?: string;
  /** Optional small role tag shown next to author (e.g. "Peer counselor"). */
  authorTag?: string;
  /** Visually group consecutive bubbles from the same sender. */
  continues?: boolean;
  style?: ViewStyle;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  from, author, authorTag, text, time, continues = false, style,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  const mine = from === 'me';
  const bg = mine ? c.accent : c.surface;
  const fg = mine ? c.accentOn : c.text;
  const corner = radius.lg;
  const tailRadius = 4;

  return (
    <View style={[{
      alignSelf: mine ? 'flex-end' : 'flex-start',
      maxWidth: '82%',
      marginTop: continues ? space[2] : space[4],
    }, style]}>
      {author && !mine && !continues ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, paddingHorizontal: 4 }}>
          <Text variant="caption" weight="600" tone="muted">{author}</Text>
          {authorTag ? (
            <Text variant="caption" tone="accent" weight="600">· {authorTag}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={{
        backgroundColor: bg,
        borderWidth: mine ? 0 : 1.5,
        borderColor: c.border,
        paddingHorizontal: space[5],
        paddingVertical: space[4],
        borderRadius: corner,
        borderBottomRightRadius: mine ? (continues ? corner : tailRadius) : corner,
        borderBottomLeftRadius:  !mine ? (continues ? corner : tailRadius) : corner,
      }}>
        <Text variant="body" style={{ color: fg }}>{text}</Text>
      </View>
      {time ? (
        <Text variant="caption" tone="subtle" style={{
          marginTop: 4, paddingHorizontal: 4,
          textAlign: mine ? 'right' : 'left',
        }}>{time}</Text>
      ) : null}
    </View>
  );
};
