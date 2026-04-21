import React, { useState } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Text,
  Button,
  TopBar,
  BackButton,
  RadioGroup,
  Checkbox,
  useTheme,
  Alert,
} from "../../src";
import {
  routeToPersona,
  EmploymentStatus,
  UrgencyFlag,
} from "../../src/data/mock";

/**
 * S02 — Triage
 *
 * Two questions to determine persona routing. Skippable — skip routes to
 * Maya (severance-deadline) branch, the most common scenario.
 */
export default function Triage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { space } = useTheme();

  const [status, setStatus] = useState<EmploymentStatus>(
    params.mode === "preparing"
      ? "imminent"
      : params.mode === "returning"
        ? "returning"
        : "laid_off",
  );
  const [flags, setFlags] = useState<UrgencyFlag[]>([]);

  const toggleFlag = (f: UrgencyFlag) =>
    setFlags((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  const handleContinue = () => {
    const persona = routeToPersona(status, flags);
    router.push(`/onboarding/create-handle?persona=${persona}`);
  };

  return (
    <Screen padded={false}>
      <TopBar
        title='A couple of questions'
        leading={<BackButton onPress={() => router.back()} />}
      />
      <View style={{ padding: space(5), gap: space(7) }}>
        <View>
          <Text variant='title'>We'll personalize what you see.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: space(2) }}>
            Your answers are private and can be changed anytime.
          </Text>
        </View>

        <RadioGroup<EmploymentStatus>
          label="What's your situation?"
          value={status}
          onChange={setStatus}
          options={[
            { value: "laid_off", label: "I was laid off" },
            { value: "imminent", label: "I think I might be laid off soon" },
            {
              value: "not_affected",
              label: "I'm not affected yet, but preparing",
            },
            { value: "returning", label: "I've used this before" },
          ]}
        />

        <View style={{ gap: space(3) }}>
          <Text variant='caption' weight='600' tone='muted'>
            ANYTHING URGENT? (OPTIONAL — TAP ALL THAT APPLY)
          </Text>
          <View style={{ gap: space(3) }}>
            <Checkbox
              checked={flags.includes("severance_deadline")}
              onChange={() => toggleFlag("severance_deadline")}
              label='I have a severance deadline'
            />
            <Checkbox
              checked={flags.includes("visa_concern")}
              onChange={() => toggleFlag("visa_concern")}
              label="I'm on a work visa (H-1B, etc.)"
            />
            <Checkbox
              checked={flags.includes("benefits_ending")}
              onChange={() => toggleFlag("benefits_ending")}
              label='My benefits are ending soon'
            />
            <Checkbox
              checked={flags.includes("discrimination")}
              onChange={() => toggleFlag("discrimination")}
              label='I think this may be discrimination'
            />
            <Checkbox
              checked={flags.includes("struggling")}
              onChange={() => toggleFlag("struggling")}
              label="I'm struggling — I need to talk to someone"
            />
          </View>
        </View>

        {flags.includes("struggling") && (
          <Alert
            tone='info'
            title="We're here for you."
            message='After you sign up you can chat with a peer volunteer right away — no waiting.'
          />
        )}

        <View style={{ gap: space(3) }}>
          <Button
            label='Continue'
            variant='primary'
            size='lg'
            fullWidth
            onPress={handleContinue}
          />
          <Button
            label='Skip for now'
            variant='ghost'
            size='md'
            fullWidth
            onPress={() =>
              router.push("/onboarding/create-handle?persona=maya")
            }
          />
        </View>
      </View>
    </Screen>
  );
}
