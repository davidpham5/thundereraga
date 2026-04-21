import React from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen, Text, Button, Badge, useTheme } from "../../src";

/**
 * S07 — Confirm
 *
 * Celebration moment without being saccharine. Three onward actions,
 * chosen based on the persona branch so the user lands where they need
 * to go fastest.
 */
export default function Confirm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ persona?: string; handle?: string }>();
  const { space, theme } = useTheme();

  return (
    <Screen scroll>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: space(7),
          paddingVertical: space(9),
        }}>
        <View style={{ alignItems: "center", gap: space(4) }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.color.successSoft,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text style={{ fontSize: 36, color: theme.color.success }}>✓</Text>
          </View>
          <Text variant='display' align='center'>
            Welcome.
          </Text>
          <Text variant='body' tone='muted' align='center'>
            You're signed in as
          </Text>
          <Badge
            tone='accent'
            label={params.handle ?? "Anonymous-User"}
            size='md'
          />
        </View>

        <View style={{ gap: space(4) }}>
          <Text variant='heading' align='center'>
            What would help right now?
          </Text>
          <Button
            label='Open my dashboard'
            variant='primary'
            size='lg'
            fullWidth
            onPress={() => router.replace("/tabs/dashboard")}
          />
          <Button
            label='Chat with a volunteer now'
            variant='secondary'
            size='lg'
            fullWidth
            onPress={() => router.replace("/tabs/chat")}
          />
          <Button
            label='Browse resources first'
            variant='ghost'
            size='md'
            fullWidth
            onPress={() => router.replace("/tabs/resources")}
          />
        </View>
      </View>
    </Screen>
  );
}
