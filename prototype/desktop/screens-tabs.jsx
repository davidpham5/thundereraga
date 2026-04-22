// Desktop tab screens. Each takes { persona, setPersona, setScreen }.
// Layouts use Page with per-screen max-widths.

/* ───────── Dashboard ───────── */
function DDashboardTab({ persona, setPersona, setScreen }) {
  const p = PERSONAS[persona];
  return (
    <Page width="mid">
      <div className="rise rise-1" style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap', marginBottom: 24,
      }}>
        <div>
          <Text variant="body" tone="muted">Hi,</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
            <Avatar size="lg" tint={p.tint} initials={p.initials} />
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, letterSpacing: -0.4, color: T.text }}>
                {p.displayName}
              </div>
              <Text variant="caption" tone="subtle" style={{ marginTop: 4 }}>{p.role}</Text>
            </div>
          </div>
        </div>
        <button onClick={() => {
          const i = PERSONA_ORDER.indexOf(persona);
          setPersona(PERSONA_ORDER[(i + 1) % PERSONA_ORDER.length]);
        }} style={{
          background: T.bg, border: `1px solid ${T.border}`, borderRadius: 999,
          padding: '8px 14px', cursor: 'pointer', fontFamily: 'Inter',
          fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.6,
        }} title="Switch persona (dev)">
          {persona.toUpperCase()} ↻
        </button>
      </div>

      <div className="rise rise-2">
        <Alert
          tone={p.banner.tone}
          title={p.banner.title}
          message={p.banner.body}
          actionLabel={p.banner.cta}
          onAction={() => setScreen(p.banner.ctaScreen)}
        />
      </div>

      <SectionHead title="RIGHT NOW" />
      <div className="rise rise-3" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12,
      }}>
        {p.quickActions.map((qa, i) => (
          <DQuickAction key={i} {...qa} onClick={() => setScreen(qa.screen)} />
        ))}
      </div>

      <SectionHead title="FOR YOUR SITUATION" action={
        <button onClick={() => setScreen('resources')} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          color: T.accent, fontWeight: 600, fontSize: 13, fontFamily: 'Inter',
        }}>See all →</button>
      }/>
      <div className="rise rise-4" style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12,
      }}>
        {p.recommended.map(id => {
          const r = RESOURCES[id]; if (!r) return null;
          return <div key={id} className="hoverable"><ResourceCard {...r} onClick={() => setScreen('resources')} /></div>;
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <Card variant="soft" accent="success">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 24, background: T.successSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>💚</div>
            <div style={{ flex: 1 }}>
              <Text variant="subtitle">How are you feeling?</Text>
              <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>
                Take 60 seconds — no one sees your answer.
              </Text>
            </div>
            <Button label="Check in" variant="secondary" size="sm" />
          </div>
        </Card>
      </div>
    </Page>
  );
}

function DQuickAction({ label, sublabel, tint, onClick }) {
  const tintMap = {
    accent: T.accentSoft, success: T.successSoft,
    warning: T.warningSoft, danger: T.dangerSoft, sunken: T.mutedSurface,
  };
  return (
    <button onClick={onClick} className="hoverable" style={{
      background: tintMap[tint] || T.mutedSurface,
      border: 0, borderRadius: 12, padding: 18, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 4, minHeight: 96,
      justifyContent: 'center', textAlign: 'left', fontFamily: 'Inter',
    }}>
      <Text variant="body" weight={700}>{label}</Text>
      <Text variant="caption" tone="muted">{sublabel}</Text>
    </button>
  );
}

/* ───────── Chat (two-pane) ───────── */
function DChatTab({ setScreen }) {
  const threads = [
    { id: 't1', name: 'Anon_Volunteer_12', tag: 'Peer volunteer', preview: "That's really common. Would it help if we just…", time: '2:16 PM', unread: 0, online: true, active: true },
    { id: 't2', name: 'Anon_Volunteer_08', tag: 'Peer volunteer', preview: "Let me know when you're ready to chat.", time: 'Yesterday', unread: 2, online: false },
    { id: 't3', name: 'StandStrong Care', tag: 'Check-in',      preview: 'How are you doing today?',              time: 'Apr 18', unread: 0, online: false },
  ];
  const seed = [
    { id: 1, from: 'them', text: "Hi — I saw you just signed up. No pressure to talk, but I'm here if you want to. I've been through this too.", time: '2:14 PM' },
    { id: 2, from: 'me',   text: "Thanks. I'm not really sure where to start honestly.", time: '2:16 PM' },
    { id: 3, from: 'them', text: "That's really common. Would it help if we just ran through what you're dealing with right now? You can share as much or as little as you want.", time: '2:16 PM' },
  ];
  const [messages, setMessages] = React.useState(seed);
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const h = ((now.getHours() + 11) % 12) + 1;
    const m = String(now.getMinutes()).padStart(2, '0');
    const ap = now.getHours() >= 12 ? 'PM' : 'AM';
    const time = `${h}:${m} ${ap}`;
    setMessages(ms => [...ms, { id: Date.now(), from: 'me', text: draft.trim(), time }]);
    setDraft('');
    setTimeout(() => setMessages(ms => [...ms, {
      id: Date.now() + 1, from: 'them',
      text: "Thanks for sharing that. Take your time. What's weighing on you most right now?",
      time,
    }]), 1200);
  };

  const left = (
    <>
      <div style={{
        padding: '18px 20px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Text variant="subtitle">Conversations</Text>
        <Text variant="caption" tone="subtle">{threads.length}</Text>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {threads.map(t => (
          <button key={t.id} style={{
            width: '100%', textAlign: 'left',
            display: 'flex', gap: 12, padding: '14px 20px',
            background: t.active ? T.sunken : 'transparent', border: 0, cursor: 'pointer',
            borderLeft: `3px solid ${t.active ? T.accent : 'transparent'}`,
            fontFamily: 'Inter',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar size="md" tint={T.success} initials={t.name.split('_')[1]?.[0] || 'V'} name={t.name} />
              {t.online && <span style={{
                position: 'absolute', right: -2, bottom: -2,
                width: 11, height: 11, borderRadius: 6, background: T.success,
                border: `2px solid ${T.bg}`,
              }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <Text variant="bodySm" weight={700} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.name}
                </Text>
                <Text variant="caption" tone="subtle">{t.time}</Text>
              </div>
              <Text variant="caption" tone="muted" style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.preview}
              </Text>
            </div>
            {t.unread > 0 && (
              <span style={{
                alignSelf: 'center',
                minWidth: 18, height: 18, borderRadius: 9, background: T.accent,
                color: '#fff', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingInline: 5,
              }}>{t.unread}</span>
            )}
          </button>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${T.border}` }}>
        <Button label="Start new chat" variant="secondary" size="md" fullWidth />
      </div>
    </>
  );

  const right = (
    <>
      <div style={{
        padding: '14px 24px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Avatar size="md" tint={T.success} initials="V" />
        <div style={{ flex: 1 }}>
          <Text variant="subtitle">Anon_Volunteer_12</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: T.success }} />
            <Text variant="caption" tone="muted">Online · Peer volunteer</Text>
          </div>
        </div>
        <button style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          color: T.accent, fontWeight: 600, fontSize: 13, fontFamily: 'Inter',
          padding: '6px 10px',
        }}>End chat</button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Alert tone="info" title="Anonymous & confidential"
            message="Volunteers can't see your real identity. You can end this chat anytime." />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, i) => {
              const prev = messages[i - 1];
              return (
                <MessageBubble key={msg.id}
                  from={msg.from}
                  author="Anon_Volunteer_12"
                  authorTag="Peer volunteer"
                  text={msg.text}
                  time={msg.time}
                  continues={prev && prev.from === msg.from}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: 14, borderTop: `1px solid ${T.border}`, background: T.bg,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', display: 'flex', gap: 10 }}>
          <input
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message…"
            style={{
              flex: 1, height: 44, paddingInline: 16, borderRadius: 22,
              background: T.sunken, border: 0, outline: 'none',
              fontFamily: 'Inter', fontSize: 15, color: T.text,
            }}
          />
          <button onClick={send} disabled={!draft.trim()} style={{
            width: 44, height: 44, borderRadius: 22,
            background: draft.trim() ? T.accent : T.borderStrong,
            border: 0, color: '#fff', fontSize: 18, fontWeight: 700,
            cursor: draft.trim() ? 'pointer' : 'not-allowed',
          }}>↑</button>
        </div>
      </div>
    </>
  );

  return <TwoPane left={left} right={right} />;
}

/* ───────── Counselors ───────── */
function DCounselorsTab({ persona }) {
  const initialFilter = persona === 'priya' ? 'H-1B' : persona === 'james' ? 'ADEA' : 'All';
  const [tag, setTag] = React.useState(initialFilter);
  const ALL = ['All', 'Available today', 'Severance', 'NDA', 'COBRA', 'H-1B', 'ADEA'];
  const filtered = tag === 'All' ? COUNSELORS
    : tag === 'Available today' ? COUNSELORS.filter(c => c.availableToday)
    : COUNSELORS.filter(c => c.tags.includes(tag));

  return (
    <Page width="wide">
      <PageHeader
        eyebrow="PEER COUNSELORS"
        title="Talk to someone who's been there."
        subtitle="Every counselor is a vetted volunteer — background-checked and trained. Free. Anonymous. No appointment commitment."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, marginTop: 8 }}>
        <aside>
          <Text variant="label" tone="subtle" style={{ marginBottom: 10 }}>FILTER BY</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ALL.map(x => {
              const active = x === tag;
              return (
                <button key={x} onClick={() => setTag(x)} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                  background: active ? T.accentSoft : 'transparent',
                  color: active ? T.accent : T.textMuted, border: 0, cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 13, fontWeight: active ? 700 : 500,
                }}>
                  {x}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 24, padding: 14, background: T.sunken, borderRadius: 10 }}>
            <Text variant="caption" weight={700} tone="muted">ABOUT VOLUNTEERS</Text>
            <Text variant="caption" tone="muted" style={{ marginTop: 6, lineHeight: '16px' }}>
              Trained peers, not licensed attorneys. For specific legal action, we'll refer you out.
            </Text>
          </div>
        </aside>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <Text variant="subtitle">{filtered.length} counselor{filtered.length === 1 ? '' : 's'}</Text>
            <Text variant="caption" tone="muted">Sorted by availability</Text>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
            {filtered.map(co => (
              <div key={co.id} className="hoverable">
                <CounselorCard {...co} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ───────── Resources ───────── */
function DResourcesTab() {
  const [cat, setCat] = React.useState('All');
  const CATS = ['All', 'Severance', 'Benefits', 'H-1B', 'Legal', 'Wellbeing'];
  const list = Object.entries(RESOURCES).map(([id, r]) => ({ id, ...r }))
    .filter(r => cat === 'All' ? true : r.tag === cat);
  const vids = cat === 'All' ? VIDEOS : VIDEOS.filter(v => v.category === cat.toUpperCase());

  return (
    <Page width="wide">
      <PageHeader
        eyebrow="RESOURCES"
        title="Straight answers, not fluff."
        subtitle="Guides, checklists, and short videos — written by peers who've been through it and reviewed for accuracy."
      />

      <DFeaturedCard />

      <div style={{ marginTop: 28, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CATS.map(x => {
          const active = x === cat;
          return (
            <button key={x} onClick={() => setCat(x)} style={{
              paddingInline: 14, height: 32, borderRadius: 999,
              background: active ? T.accent : T.bg, color: active ? '#fff' : T.text,
              border: `1.5px solid ${active ? T.accent : T.border}`,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter',
            }}>{x}</button>
          );
        })}
      </div>

      <SectionHead title="QUICK GUIDES" action={
        <Text variant="caption" tone="muted">{list.length} results</Text>
      } />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {list.map(r => (
          <div key={r.id} className="hoverable"><ResourceCard {...r} /></div>
        ))}
      </div>

      <SectionHead title="VIDEO LIBRARY" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        {vids.map(v => (
          <div key={v.id} className="hoverable">
            <VideoCard title={v.title} duration={v.meta.split(' · ')[0]} category={v.category} />
          </div>
        ))}
      </div>
    </Page>
  );
}

function DFeaturedCard() {
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      minHeight: 260,
    }}>
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${T.accent}, ${T.accentHover})`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36,
            background: 'rgba(255,255,255,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.accent, fontSize: 28, paddingLeft: 6,
          }}>▶</div>
        </div>
        <div style={{
          position: 'absolute', top: 16, left: 16,
          paddingInline: 10, paddingBlock: 4, borderRadius: 4,
          background: 'rgba(0,0,0,0.35)',
          color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
        }}>ESSENTIALS</div>
      </div>
      <div style={{
        background: 'var(--paper)', padding: 32,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        border: `1px solid ${T.border}`, borderLeft: 0,
      }}>
        <Text variant="label" tone="accent">FEATURED</Text>
        <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 24, letterSpacing: -0.4, lineHeight: 1.2, marginTop: 10, color: T.text }}>
          Know Your Rights After a Layoff
        </div>
        <Text variant="body" tone="muted" style={{ marginTop: 10, lineHeight: '22px' }}>
          Twelve minutes on severance, NDAs, the WARN Act, and what "signed and final"
          actually means. Start here if you're unsure where to start.
        </Text>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <Text variant="caption" tone="muted">12 min · ★ 4.9 · Free</Text>
        </div>
      </div>
    </div>
  );
}

/* ───────── Profile ───────── */
function DProfileTab({ setScreen, state, persona }) {
  const p = PERSONAS[persona];
  return (
    <Page width="mid">
      <Card variant="outline" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Avatar size="xl" tint={p.tint} initials={p.initials} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 24, letterSpacing: -0.4, color: T.text }}>
              {state.handle || p.displayName}
            </div>
            <Text variant="caption" tone="muted" style={{ marginTop: 4 }}>
              Member since Oct 2025 · {p.role}
            </Text>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <Badge tone="accent" label="Anonymous" dot />
              <Badge tone="success" label="Verified" />
            </div>
          </div>
          <Button label="Edit profile" variant="secondary" size="md" />
        </div>
      </Card>

      <div style={{
        marginTop: 24, display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20,
      }}>
        <DProfileGroup title="PRIVACY">
          <DRow title="Privacy settings" subtitle="Data sharing, visibility" />
          <DRow title="Block & mute" subtitle="Manage your boundaries" />
          <DRow title="Download my data" subtitle="Get a copy of everything" />
        </DProfileGroup>

        <DProfileGroup title="PREFERENCES">
          <DRow title="Notifications" subtitle="Peer messages, check-ins" />
          <DRow title="Appearance" subtitle="System" />
          <DRow title="Language" subtitle="English" />
        </DProfileGroup>

        <DProfileGroup title="SUPPORT">
          <DRow title="Help center" />
          <DRow title="Report a problem" />
          <DRow title="About StandStrong" subtitle="Our mission, funding, team" />
        </DProfileGroup>

        <DProfileGroup title="ACCOUNT">
          <DRow title="Sign out" onClick={() => setScreen('welcome')} />
          <DRow title="Delete my account and data" subtitle="Permanent. Cannot be undone." tone="danger" />
        </DProfileGroup>
      </div>

      <Text variant="caption" tone="subtle" align="center" style={{ marginTop: 32 }}>
        StandStrong v0.1 · Made with care by laid-off workers, for laid-off workers.
      </Text>
    </Page>
  );
}

function DProfileGroup({ title, children }) {
  return (
    <div>
      <Text variant="label" tone="subtle" style={{ marginBottom: 10 }}>{title}</Text>
      <div style={{
        background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12,
        overflow: 'hidden',
      }}>
        {React.Children.map(children, (c, i, arr) => (
          <>
            {c}
            {i < React.Children.count(children) - 1 && (
              <div style={{ height: 1, background: T.border }} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

function DRow({ title, subtitle, tone, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', background: 'transparent',
      border: 0, cursor: 'pointer', fontFamily: 'Inter',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          color: tone === 'danger' ? T.danger : T.text,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <span style={{ color: T.textSubtle, fontSize: 16 }}>›</span>
    </button>
  );
}

Object.assign(window, {
  DDashboardTab, DChatTab, DCounselorsTab, DResourcesTab, DProfileTab,
});
