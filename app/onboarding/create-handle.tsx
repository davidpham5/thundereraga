import React, { useState } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Text,
  Button,
  TopBar,
  BackButton,
  TextField,
  Badge,
  Alert,
  useTheme,
} from "../../src";
import { generateHandle } from "../../src/utils/generateHandle";

/**
 * S03 — Create Anonymous Handle
 *
 * Users never enter a real name. We generate a random handle they can
 * accept, regenerate, or customize.
 */
export default function CreateHandle() {
  const router = useRouter();
  const { space } = useTheme();
  const params = useLocalSearchParams<{ persona?: string }>();
  const [handle, setHandle] = useState(() => generateHandle());

  return (
    <Screen padded={false}>
      <TopBar
        title='Your anonymous handle'
        leading={<BackButton onPress={() => router.back()} />}
      />
      <View style={{ padding: space(5), gap: space(7) }}>
        <View>
          <Text variant='title'>Pick a name to go by.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: space(2) }}>
            This is what other members and counselors will see. Your real name
            is never required.
          </Text>
        </View>

        <View style={{ gap: space(4) }}>
          <TextField
            label='HANDLE'
            value={handle}
            onChangeText={setHandle}
            helperText='Letters, numbers, and dashes. Change anytime in Settings.'
          />
          <View style={{ flexDirection: "row", gap: space(3) }}>
            <Badge tone='neutral' label='Randomly generated' />
            <Badge tone='success' label='Available' dot />
          </View>
        </View>

        <Alert
          tone='info'
          title='Why anonymous?'
          message="We never link your handle to your real identity or employer. Even our own staff can't see who you are unless you choose to verify."
        />

        <View style={{ gap: space(3) }}>
          <Button
            label='Continue'
            variant='primary'
            size='lg'
            fullWidth
            onPress={() =>
              router.push(
                `/onboarding/safety?persona=${params.persona}&handle=${encodeURIComponent(handle)}`,
              )
            }
          />
          <Button
            label='Generate another'
            variant='secondary'
            size='md'
            fullWidth
            onPress={() => setHandle(generateHandle())}
          />
        </View>
      </View>
    </Screen>
  );
}
