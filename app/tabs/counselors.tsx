import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Screen, Text, TopBar, BackButton, CounselorCard, Badge, useTheme,
} from '../../src';
import { counselors } from '../../src/data/mock';

/**
 * S09 — Counselor Directory
 *
 * Filter pills up top. Cards list below. Tap → profile. Supports ?tag=h1b
 * query from Dashboard deep-links (e.g. Priya's banner CTA).
 */
const ALL_TAGS = ['All', 'Available today', 'Severance', 'NDA', 'COBRA', 'H-1B', 'ADEA'];

export default function Counselors() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tag?: string }>();
  const { space, theme } = useTheme();
  const c = theme.color;

  const initialTag = params.tag === 'h1b' ? 'H-1B'
    : params.tag === 'adea' ? 'ADEA'
    : 'All';
  const [activeTag, setActiveTag] = useState<string>(initialTag);

  const filtered = useMemo(() => {
    if (activeTag === 'All') return counselors;
    if (activeTag === 'Available today') return counselors.filter(c => c.availableToday);
    return counselors.filter(c => c.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <Screen padded={false} scroll>
      <TopBar title="Peer Counselors" leading={<BackButton onPress={() => router.back()} label="" />} />

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space(5), paddingVertical: space(4), gap: space(3) }}
      >
        {ALL_TAGS.map((tag) => {
          const active = tag === activeTag;
          return (
            <Pressable key={tag} onPress={() => setActiveTag(tag)}>
              <View style={{
                paddingHorizontal: space(4), paddingVertical: space(3),
                borderRadius: 999,
                backgroundColor: active ? c.accent : c.surfaceSunken,
                borderWidth: 1.5, borderColor: active ? c.accent : c.border,
              }}>
                <Text variant="caption" weight="700"
                  style={{ color: active ? '#fff' : c.text }}>
                  {tag}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: space(5), paddingBottom: space(8), gap: space(4) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text variant="subtitle" weight="700">
            {filtered.length} counselor{filtered.length === 1 ? '' : 's'}
          </Text>
          <Text variant="caption" tone="muted">All vetted volunteers</Text>
        </View>
        {filtered.map((co) => (
          <CounselorCard
            key={co.id}
            name={co.initials}
            headline={co.headline}
            tags={co.tags}
            availability={co.availability}
            rating={co.rating}
            sessions={co.sessions}
            available={co.availableToday}
            avatarName={co.initials}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
