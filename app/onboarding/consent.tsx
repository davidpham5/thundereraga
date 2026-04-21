import React, { useState } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Text,
  Button,
  TopBar,
  BackButton,
  Checkbox,
  Card,
  useTheme,
} from "../../src";

/**
 * S06 — Consent
 *
 * Final gate before we create an account. Required consents are the top
 * two; analytics is opt-in.
 */
export default function Consent() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    persona?: string;
    handle?: string;
    state?: string;
  }>();
  const { space } = useTheme();

  const [tos, setTos] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const canContinue = tos && privacy;

  return (
    <Screen padded={false} scroll>
      <TopBar
        title='Almost there'
        leading={<BackButton onPress={() => router.back()} />}
      />
      <View style={{ padding: space(5), gap: space(6) }}>
        <View>
          <Text variant='title'>Agreements.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: space(2) }}>
            Two required, one optional.
          </Text>
        </View>

        <Card variant='outline' padding={space(5)}>
          <Checkbox
            checked={tos}
            onChange={setTos}
            label='I agree to the Terms of Service'
            description='The basics of how the platform works and what we expect.'
          />
        </Card>

        <Card variant='outline' padding={space(5)}>
          <Checkbox
            checked={privacy}
            onChange={setPrivacy}
            label='I agree to the Privacy Policy'
            description='We explain exactly what we store, for how long, and why.'
          />
        </Card>

        <Card variant='outline' padding={space(5)}>
          <Checkbox
            checked={analytics}
            onChange={setAnalytics}
            label='Help us improve (optional)'
            description='Anonymous usage analytics. Never linked to your handle. You can turn this off anytime.'
          />
        </Card>

        <Button
          label='Create my account'
          variant='primary'
          size='lg'
          fullWidth
          disabled={!canContinue}
          onPress={() =>
            router.replace(
              `/onboarding/confirm?persona=${params.persona}&handle=${params.handle}&state=${params.state}`,
            )
          }
        />
      </View>
    </Screen>
  );
}
