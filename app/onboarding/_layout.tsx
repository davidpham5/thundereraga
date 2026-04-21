import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="triage" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="create-handle" />
      <Stack.Screen name="safety" />
      <Stack.Screen name="consent" />
      <Stack.Screen name="location" />
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
