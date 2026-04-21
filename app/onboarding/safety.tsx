import React from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Text,
  Button,
  TopBar,
  BackButton,
  Card,
  useTheme,
} from "../../src";

/**
 * S04 — Safety & Privacy Pledge
 *
 * Trust moment before any sensitive info is requested. Plain, specific copy.
 */
const pledges = [
  {
    t: "We never share your identity with your employer.",
    s: "Not your name, not your handle, not your activity.",
  },
  {
    t: "We never sell your data.",
    s: "We're a nonprofit. Donor-funded, not ad-funded.",
  },
  {
    t: "Peer counselors are vetted volunteers.",
    s: "Background-checked and trained, but not licensed attorneys.",
  },
  {
    t: "You can delete everything anytime.",
    s: "One tap in Settings. Full wipe, including message history.",
  },
];

export default function Safety() {
  const router = useRouter();
  const params = useLocalSearchParams<{ persona?: string; handle?: string }>();
  const { space, theme } = useTheme();
  const c = theme.color;

  return (
    <Screen padded={false} scroll>
      <TopBar
        title='Our pledge to you'
        leading={<BackButton onPress={() => router.back()} />}
      />
      <View style={{ padding: space(5), gap: space(6) }}>
        <View>
          <Text variant='title'>Before we continue.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: space(2) }}>
            Four things we promise, and one thing we ask.
          </Text>
        </View>

        <View style={{ gap: space(3) }}>
          {pledges.map((p, i) => (
            <Card key={i} variant='outline' padding={space(5)}>
              <View style={{ flexDirection: "row", gap: space(4) }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: c.successSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Text style={{ color: c.success, fontWeight: "800" }}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant='body' weight='600'>
                    {p.t}
                  </Text>
                  <Text variant='caption' tone='muted' style={{ marginTop: 2 }}>
                    {p.s}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Card variant='soft' accent='accent' padding={space(5)}>
          <Text variant='caption' weight='700' tone='accent'>
            WE ASK ONE THING
          </Text>
          <Text variant='body' style={{ marginTop: space(2) }}>
            Treat other members with respect. This is a safe space for everyone.
          </Text>
        </Card>

        <Button
          label='I understand — continue'
          variant='primary'
          size='lg'
          fullWidth
          onPress={() =>
            router.push(
              `/onboarding/location?persona=${params.persona}&handle=${params.handle}`,
            )
          }
        />
      </View>
    </Screen>
  );
}
