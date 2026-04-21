import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Screen, Text, TopBar, SectionHeader, ResourceCard, VideoCard,
  Card, useTheme,
} from '../../src';
import { resources, videos, featuredVideo } from '../../src/data/mock';

/**
 * S12 — Resources hub
 *
 * Three rails: Featured video, Quick Guides (article+pdf+checklist cards),
 * Video Library grid. Filter chips across the top.
 */
const CATEGORIES = ['All', 'Severance', 'Benefits', 'H-1B', 'Legal', 'Wellbeing'];

export default function Resources() {
  const router = useRouter();
  const { space, theme } = useTheme();
  const c = theme.color;
  const [cat, setCat] = useState<string>('All');

  const resourceList = Object.values(resources).filter(r =>
    cat === 'All' ? true : (r.tag === cat),
  ).slice(0, 6);

  const videoList = cat === 'All' ? videos : videos.filter(v => v.category === cat);

  return (
    <Screen padded={false}>
      <TopBar title="Resources" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: space(8) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured */}
        <View style={{ padding: space(5) }}>
          <FeaturedCard onPress={() => {}} />
        </View>

        {/* Category pills */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space(5), gap: space(3), paddingBottom: space(4) }}
        >
          {CATEGORIES.map((x) => {
            const active = x === cat;
            return (
              <Pressable key={x} onPress={() => setCat(x)}>
                <View style={{
                  paddingHorizontal: space(4), paddingVertical: space(3),
                  borderRadius: 999,
                  backgroundColor: active ? c.accent : c.surfaceSunken,
                  borderWidth: 1.5, borderColor: active ? c.accent : c.border,
                }}>
                  <Text variant="caption" weight="700"
                    style={{ color: active ? '#fff' : c.text }}>
                    {x}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Quick guides */}
        <View style={{ paddingHorizontal: space(5) }}>
          <SectionHeader title="QUICK GUIDES" />
          <View style={{ gap: space(3) }}>
            {resourceList.map((r) => (
              <ResourceCard
                key={r.id}
                title={r.title}
                meta={r.meta}
                kind={r.kind === 'checklist' ? 'guide' : r.kind}
                tag={r.tag}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        {/* Video library */}
        <View style={{ paddingHorizontal: space(5), marginTop: space(7) }}>
          <SectionHeader title="VIDEO LIBRARY" />
          <View style={{ gap: space(4) }}>
            {videoList.map((v) => (
              <VideoCard
                key={v.id}
                title={v.title}
                duration={v.meta.split(' · ')[0]}
                category={v.category.toUpperCase()}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function FeaturedCard({ onPress }: { onPress: () => void }) {
  const { space, theme } = useTheme();
  const c = theme.color;
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={{
          borderRadius: 12, overflow: 'hidden',
          backgroundColor: c.accentHover,
          opacity: pressed ? 0.95 : 1,
        }}>
          <View style={{
            aspectRatio: 16 / 9, backgroundColor: c.accentHover,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <View style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: 'rgba(255,255,255,0.9)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 22, color: c.accent, marginLeft: 4 }}>▶</Text>
            </View>
            <View style={{
              position: 'absolute', top: space(4), left: space(4),
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}>
              <Text variant="caption" weight="700" style={{ color: '#fff' }}>ESSENTIALS</Text>
            </View>
          </View>
          <View style={{ padding: space(5), gap: 4 }}>
            <Text variant="title" style={{ color: '#fff' }}>{featuredVideo.title}</Text>
            <Text variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {featuredVideo.meta} · ★ {featuredVideo.rating}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
