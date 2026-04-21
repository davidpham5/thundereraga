import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Screen, Text, TopBar, BackButton, Avatar, Badge,
  MessageBubble, useTheme, Alert,
} from '../../src';

/**
 * S11 — Peer Chat / Hotline
 *
 * 1:1 anonymous chat with a peer volunteer. For demo purposes the
 * volunteer's replies are scripted. The input bar is keyboard-aware via
 * Screen's `keyboardAware` prop.
 */
type Msg = { id: string; from: 'me' | 'them'; text: string; time: string };

const seed: Msg[] = [
  { id: '1', from: 'them', text: "Hi — I saw you just signed up. No pressure to talk, but I'm here if you want to. I've been through this too.", time: '2:14 PM' },
  { id: '2', from: 'me',   text: "Thanks. I'm not really sure where to start honestly.", time: '2:16 PM' },
  { id: '3', from: 'them', text: "That's really common. Would it help if we just ran through what you're dealing with right now? You can share as much or as little as you want.", time: '2:16 PM' },
];

const volunteer = { handle: 'Anon_Volunteer_12', tag: 'Peer volunteer', initials: 'V' };

export default function Chat() {
  const router = useRouter();
  const { space, theme } = useTheme();
  const c = theme.color;
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `${((now.getHours() + 11) % 12) + 1}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    const mine: Msg = { id: String(Date.now()), from: 'me', text: draft.trim(), time };
    setMessages((m) => [...m, mine]);
    setDraft('');
    // Scripted reply
    setTimeout(() => {
      setMessages((m) => [...m, {
        id: String(Date.now() + 1),
        from: 'them',
        text: "Thanks for sharing that. Take your time. What's weighing on you most right now?",
        time,
      }]);
    }, 1200);
  };

  return (
    <Screen padded={false} keyboardAware>
      <TopBar
        title=""
        leading={<BackButton onPress={() => router.back()} label="" />}
        trailing={
          <View style={{ paddingRight: space(3) }}>
            <Text variant="caption" tone="accent" weight="600">End chat</Text>
          </View>
        }
      />
      <View style={{ paddingHorizontal: space(5), paddingBottom: space(4),
        borderBottomWidth: 1, borderBottomColor: c.divider,
        flexDirection: 'row', alignItems: 'center', gap: space(3) }}>
        <Avatar size="md" name={volunteer.initials} ring="support" />
        <View style={{ flex: 1 }}>
          <Text variant="subtitle" weight="700">{volunteer.handle}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space(2), marginTop: 2 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.success }} />
            <Text variant="caption" tone="muted">Online · Peer volunteer</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: space(5), paddingBottom: space(6) }}
        showsVerticalScrollIndicator={false}
      >
        <Alert
          tone="info"
          title="Anonymous & confidential"
          message="Volunteers can't see your real identity. You can end this chat anytime."
        />
        <View style={{ marginTop: space(5) }}>
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const continues = prev && prev.from === m.from;
            return (
              <MessageBubble
                key={m.id}
                from={m.from}
                text={m.text}
                time={m.time}
                author={volunteer.handle}
                authorTag={volunteer.tag}
                continues={!!continues}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Composer */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: space(3),
        padding: space(4), borderTopWidth: 1, borderTopColor: c.divider,
        backgroundColor: c.surface,
      }}>
        <View style={{
          flex: 1, minHeight: 44,
          paddingHorizontal: space(4), paddingVertical: space(3),
          borderRadius: 999, backgroundColor: c.surfaceSunken,
        }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message…"
            placeholderTextColor={c.textSubtle}
            style={{ fontSize: 15, color: c.text }}
            onSubmitEditing={send}
            returnKeyType="send"
          />
        </View>
        <Pressable
          onPress={send}
          disabled={!draft.trim()}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: draft.trim() ? c.accent : c.borderStrong,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>↑</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
