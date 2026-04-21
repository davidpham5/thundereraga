import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Text,
  TopBar,
  Card,
  Alert,
  Button,
  Badge,
  ListItem,
  SectionHeader,
  Avatar,
  ResourceCard,
  useTheme,
} from "../../src";
import { personas, resources, personaIds, Persona } from "../../src/data/mock";

/**
 * S08 — Dashboard (Home tab)
 *
 * Persona-aware. Top banner reflects the user's urgency. Quick actions
 * are the 3 most-useful next steps for their situation. "Your Situation"
 * shows the recommended resource stack.
 *
 * Includes a persona switcher (top-right) so PM/design can demo any branch.
 * Remove in production or hide behind a dev flag.
 */
export default function Dashboard() {
  const router = useRouter();
  const params = useLocalSearchParams<{ persona?: string }>();
  const { space, theme } = useTheme();
  const c = theme.color;

  const initial = (params.persona as Persona["id"]) || "maya";
  const [personaId, setPersonaId] = useState<Persona["id"]>(initial);
  const persona = personas[personaId];

  const bannerTone =
    persona.dashboardBanner.tone === "danger"
      ? "danger"
      : persona.dashboardBanner.tone === "warning"
        ? "warning"
        : persona.dashboardBanner.tone === "success"
          ? "success"
          : "info";

  return (
    <Screen padded={false} scroll>
      <TopBar
        title='StandStrong'
        trailing={
          <PersonaSwitcher current={personaId} onChange={setPersonaId} />
        }
      />
      <View style={{ padding: space(5), gap: space(6) }}>
        {/* Greeting */}
        <View>
          <Text variant='body' tone='muted'>
            Hi,
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space(3),
              marginTop: 4,
            }}>
            <Avatar size='md' name={persona.displayName} />
            <Text variant='title'>{persona.displayName}</Text>
          </View>
        </View>

        {/* Urgency banner */}
        <Alert
          tone={bannerTone}
          title={persona.dashboardBanner.title}
          message={persona.dashboardBanner.body}
          actionLabel={persona.dashboardBanner.ctaLabel}
          onAction={() => router.push(persona.dashboardBanner.ctaHref as any)}
        />

        {/* Quick actions */}
        <View>
          <SectionHeader title='RIGHT NOW' />
          <View style={{ flexDirection: "row", gap: space(3) }}>
            {persona.quickActions.map((qa) => (
              <QuickAction
                key={qa.key}
                {...qa}
                onPress={() => router.push(qa.href as any)}
              />
            ))}
          </View>
        </View>

        {/* Recommended resources */}
        <View>
          <SectionHeader
            title='FOR YOUR SITUATION'
            action={
              <Pressable onPress={() => router.push("/tabs/resources")}>
                <Text variant='bodySm' weight='600' tone='accent'>
                  See all
                </Text>
              </Pressable>
            }
          />
          <View style={{ gap: space(3) }}>
            {persona.recommendedResources.slice(0, 3).map((id) => {
              const r = resources[id];
              if (!r) return null;
              return (
                <ResourceCard
                  key={id}
                  title={r.title}
                  meta={r.meta}
                  kind={r.kind === "checklist" ? "guide" : r.kind}
                  tag={r.tag}
                  description={r.description}
                  onPress={() => {}}
                />
              );
            })}
          </View>
        </View>

        {/* Support chip */}
        <Card variant='soft' accent='success' padding={space(5)}>
          <View
            style={{
              flexDirection: "row",
              gap: space(4),
              alignItems: "center",
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: c.successSoft,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 18 }}>💚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant='subtitle' weight='700'>
                How are you feeling?
              </Text>
              <Text variant='caption' tone='muted' style={{ marginTop: 2 }}>
                Take 60 seconds — no one sees your answer.
              </Text>
            </View>
            <Text variant='body' tone='subtle'>
              ›
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function QuickAction({
  label,
  sublabel,
  tint,
  onPress,
}: {
  label: string;
  sublabel: string;
  tint: string;
  onPress: () => void;
}) {
  const { theme, space, radius } = useTheme();
  const c = theme.color;
  const tintMap: Record<string, string> = {
    blue: c.accentSoft,
    green: c.successSoft,
    amber: c.warningSoft,
    red: c.dangerSoft,
    slate: c.surfaceSunken,
  };
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: pressed
              ? c.surfaceSunken
              : (tintMap[tint] ?? c.surfaceSunken),
            borderRadius: radius.md,
            padding: space(4),
            gap: 2,
            minHeight: 80,
            justifyContent: "center",
          }}>
          <Text variant='bodySm' weight='700'>
            {label}
          </Text>
          <Text variant='caption' tone='muted'>
            {sublabel}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function PersonaSwitcher({
  current,
  onChange,
}: {
  current: Persona["id"];
  onChange: (p: Persona["id"]) => void;
}) {
  const { theme, space } = useTheme();
  const c = theme.color;
  // Cycle through personas on tap
  const next = () => {
    const i = personaIds.indexOf(current);
    onChange(personaIds[(i + 1) % personaIds.length]);
  };
  return (
    <Pressable
      onPress={next}
      hitSlop={12}
      style={{
        paddingHorizontal: space(3),
        paddingVertical: space(2),
        borderRadius: 999,
        backgroundColor: c.surfaceSunken,
      }}>
      <Text variant='caption' weight='700' tone='muted'>
        {current.toUpperCase()} ↻
      </Text>
    </Pressable>
  );
}
