import React, { useState } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Text,
  Button,
  TopBar,
  BackButton,
  Select,
  Alert,
  useTheme,
} from "../../src";

/**
 * S05 — Location
 *
 * State drives the State Guide content. City is optional (used only for
 * in-person resource suggestions).
 */
const STATES = [
  { value: "CA", label: "California" },
  { value: "OR", label: "Oregon" },
  { value: "WA", label: "Washington" },
  { value: "TX", label: "Texas" },
  { value: "GA", label: "Georgia" },
  { value: "NY", label: "New York" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "MA", label: "Massachusetts" },
  { value: "CO", label: "Colorado" },
];

export default function Location() {
  const router = useRouter();
  const params = useLocalSearchParams<{ persona?: string; handle?: string }>();
  const { space } = useTheme();
  const [stateCode, setStateCode] = useState<string>("");

  return (
    <Screen padded={false} scroll>
      <TopBar
        title='Where are you based?'
        leading={<BackButton onPress={() => router.back()} />}
      />
      <View style={{ padding: space(5), gap: space(7) }}>
        <View>
          <Text variant='title'>We'll show you state-specific resources.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: space(2) }}>
            Unemployment rules, worker-protection laws, and local counselors
            vary by state.
          </Text>
        </View>

        <Select
          label='STATE'
          value={stateCode}
          onChange={setStateCode}
          placeholder='Choose your state'
          options={STATES}
        />

        <Alert
          tone='info'
          title='Only your state is used for routing.'
          message="We don't store your city or precise location."
        />

        <View style={{ gap: space(3) }}>
          <Button
            label='Continue'
            variant='primary'
            size='lg'
            fullWidth
            disabled={!stateCode}
            onPress={() =>
              router.push(
                `/onboarding/consent?persona=${params.persona}&handle=${params.handle}&state=${stateCode}`,
              )
            }
          />
          <Button
            label='Prefer not to say'
            variant='ghost'
            size='md'
            fullWidth
            onPress={() =>
              router.push(
                `/onboarding/consent?persona=${params.persona}&handle=${params.handle}&state=`,
              )
            }
          />
        </View>
      </View>
    </Screen>
  );
}
