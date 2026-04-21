import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabs } from '../../src';

/**
 * Main app tab layout.
 *
 * Uses Expo Router's <Tabs> but swaps in Tether's <BottomTabs> for the
 * tab bar so it matches the Figma system. Five tabs: Dashboard, Chat,
 * Counselors, Resources, Profile.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <BottomTabs
          activeKey={state.routes[state.index].name}
          onChange={(key) => navigation.navigate(key)}
          items={[
            { key: 'dashboard',  label: 'Home',       icon: '⌂' },
            { key: 'chat',       label: 'Chat',       icon: '💬', badge: 1 },
            { key: 'counselors', label: 'Counselors', icon: '👥' },
            { key: 'resources',  label: 'Resources',  icon: '📚' },
            { key: 'profile',    label: 'Profile',    icon: '◉' },
          ]}
        />
      )}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="counselors" />
      <Tabs.Screen name="resources" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
