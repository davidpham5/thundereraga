import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  Screen,
  Text,
  TopBar,
  ListItem,
  Avatar,
  SectionHeader,
  Card,
  useTheme,
  Badge,
} from "../../src";

/**
 * S14 — Profile / Settings
 *
 * Anonymous by design — handle + joined date only. Settings are grouped:
 * Privacy, Preferences, Support, Account. Destructive "Delete everything"
 * is separated at the bottom with a warning tone.
 */
export default function Profile() {
  const router = useRouter();
  const { space, theme } = useTheme();
  const c = theme.color;

  return (
    <Screen padded={false} scroll>
      <TopBar title='Profile' />
      <View style={{ padding: space(5), gap: space(6) }}>
        {/* Identity card */}
        <Card variant='outline' padding={space(5)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space(4),
            }}>
            <Avatar size='xl' name='Portland-Eng-42' />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant='title'>Portland-Eng-42</Text>
              <Text variant='caption' tone='muted'>
                Member since Oct 2025
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: space(2),
                  marginTop: space(2),
                }}>
                <Badge tone='accent' label='Anonymous' dot />
                <Badge tone='success' label='Verified email' />
              </View>
            </View>
          </View>
        </Card>

        {/* Privacy */}
        <View>
          <SectionHeader title='PRIVACY' />
          <Card variant='outline' padding={0}>
            <ListItem
              title='Privacy settings'
              subtitle='Data sharing, visibility'
              onPress={() => {}}
            />
            <Divider />
            <ListItem
              title='Block & mute'
              subtitle='Manage your boundaries'
              onPress={() => {}}
            />
            <Divider />
            <ListItem
              title='Download my data'
              subtitle='Get a copy of everything'
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Preferences */}
        <View>
          <SectionHeader title='PREFERENCES' />
          <Card variant='outline' padding={0}>
            <ListItem
              title='Notifications'
              subtitle='Peer messages, check-ins'
              onPress={() => {}}
            />
            <Divider />
            <ListItem title='Appearance' subtitle='System' onPress={() => {}} />
            <Divider />
            <ListItem title='Language' subtitle='English' onPress={() => {}} />
          </Card>
        </View>

        {/* Support */}
        <View>
          <SectionHeader title='SUPPORT' />
          <Card variant='outline' padding={0}>
            <ListItem title='Help center' onPress={() => {}} />
            <Divider />
            <ListItem title='Report a problem' onPress={() => {}} />
            <Divider />
            <ListItem
              title='About StandStrong'
              subtitle='Our mission, funding, team'
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Account */}
        <View>
          <SectionHeader title='ACCOUNT' />
          <Card variant='outline' padding={0}>
            <ListItem title='Sign out' onPress={() => router.replace("/")} />
            <Divider />
            <ListItem
              title='Delete my account and data'
              subtitle='Permanent. Cannot be undone.'
              onPress={() => {}}
            />
          </Card>
        </View>

        <Text
          variant='caption'
          tone='subtle'
          align='center'
          style={{ marginTop: space(4) }}>
          StandStrong v0.1 · Made with care by laid-off workers, for laid-off
          workers.
        </Text>
      </View>
    </Screen>
  );
}

function Divider() {
  const { theme, space } = useTheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.color.divider,
        marginHorizontal: space(5),
      }}
    />
  );
}
