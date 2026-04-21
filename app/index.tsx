import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Screen, Text, Button, Badge, useTheme } from "../src";

/**
 * S01 — Entry / Welcome
 *
 * First impression. Non-judgmental tone. Three affordances:
 *   • "I just got laid off" → triage (most common)
 *   • "I have an account"
 *   • "I'm preparing, just in case" (Kiesha-style preemptive users)
 */
export default function Welcome() {
  const router = useRouter();
  const { theme, space } = useTheme();

  return (
    <Screen scroll>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingVertical: space(9),
        }}>
        {/* Brand mark */}
        <View style={{ alignItems: "center", marginBottom: space(9) }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: theme.color.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: space(5),
            }}>
            <Text variant='display' tone='inverse'>
              S
            </Text>
          </View>
          <Text variant='display' align='center'>
            StandStrong
          </Text>
          <Text
            variant='body'
            tone='muted'
            align='center'
            style={{ marginTop: space(2) }}>
            You're not alone in this.
          </Text>
        </View>

        {/* Trust strip */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: space(3),
            marginBottom: space(9),
          }}>
          <Badge tone='success' label='Free forever' />
          <Badge tone='neutral' label='Anonymous' />
          <Badge tone='accent' label='Peer-led' />
        </View>

        <View style={{ gap: space(4) }}>
          <Button
            label='I just got laid off'
            variant='primary'
            size='lg'
            fullWidth
            onPress={() => router.push("/onboarding/triage")}
          />
          <Button
            label='I have an account'
            variant='secondary'
            size='lg'
            fullWidth
            onPress={() => router.push("/onboarding/triage?mode=returning")}
          />
          <Button
            label="I'm preparing, just in case"
            variant='ghost'
            size='md'
            fullWidth
            onPress={() => router.push("/onboarding/triage?mode=preparing")}
          />
        </View>

        <Text
          variant='caption'
          tone='subtle'
          align='center'
          style={{ marginTop: space(9) }}>
          We never share your identity with your employer.{"\n"}
          Your information is encrypted and yours alone.
        </Text>
      </View>
    </Screen>
  );
}
