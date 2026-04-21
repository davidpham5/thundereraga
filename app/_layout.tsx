import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/ThemeProvider";

/**
 * Root layout.
 *
 * Wraps the whole app in Tether's ThemeProvider so every screen can call
 * `useTheme()` for colors, spacing, typography, and motion tokens.
 *
 * The navigator is a native-stack; headers are hidden here because every
 * screen uses Tether's <TopBar> which matches the Figma system exactly.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='onboarding' />
        <Stack.Screen name='tabs' />
      </Stack>
    </ThemeProvider>
  );
}
