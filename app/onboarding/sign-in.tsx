import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  Screen,
  Text,
  Button,
  TopBar,
  BackButton,
  TextField,
  useTheme,
  Alert,
} from "../../src";

/**
 * Returning user sign-in. Handle + passcode (we never ask for email).
 */
export default function SignIn() {
  const router = useRouter();
  const { space } = useTheme();
  const [handle, setHandle] = useState("");
  const [passcode, setPasscode] = useState("");

  return (
    <Screen padded={false} scroll>
      <TopBar
        title='Welcome back'
        leading={<BackButton onPress={() => router.back()} />}
      />
      <View style={{ padding: space(5), gap: space(6) }}>
        <View>
          <Text variant='title'>Sign in.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: space(2) }}>
            Use your handle and passcode. We don't use email.
          </Text>
        </View>

        <TextField
          label='HANDLE'
          value={handle}
          onChangeText={setHandle}
          placeholder='e.g. Portland-Eng-42'
          autoCapitalize='none'
        />
        <TextField
          label='PASSCODE'
          value={passcode}
          onChangeText={setPasscode}
          placeholder='••••••'
          secureTextEntry
        />

        <Alert
          tone='info'
          title='Lost your passcode?'
          message="We can't recover a forgotten passcode — that's part of staying anonymous. You can always create a new handle."
        />

        <Button
          label='Sign in'
          variant='primary'
          size='lg'
          fullWidth
          disabled={!handle || !passcode}
          onPress={() => router.replace("/tabs/dashboard")}
        />
      </View>
    </Screen>
  );
}
