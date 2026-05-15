// Desktop versions of each tab screen. Reuses primitives + data wholesale.

/* ───────────── Dashboard ───────────── */
function DesktopDashboard({ persona, setPersona, setScreen, tweaks = {} }) {
  const p = PERSONAS[persona];
  const showMood = tweaks.showMoodCheckin !== false;
  const showProgress = tweaks.showProgressWidget !== false;
  const showCommunity = tweaks.showCommunityWidget !== false;
  const hasAside = showMood || showProgress || showCommunity;
  return (
    <PageWrap>
      <PageHeader
        title={`Hi, ${p.displayName}`}
        subtitle={p.role}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Text variant="caption" tone="subtle">DEV · Persona</Text>
            <button
              onClick={() => {
                const i = PERSONA_ORDER.indexOf(persona);
                setPersona(PERSONA_ORDER[(i + 1) % PERSONA_ORDER.length]);
              }}
              style={{
                background: T.bg, border: `1.5px solid ${T.border}`,
                paddingInline: 12, paddingBlock: 7, borderRadius: 999,
                color: T.text, fontSize: 12, fontWeight: 700, fontFamily: 'Inter',
                letterSpacing: 0.4, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <Avatar size="xs" tint={p.tint} initials={p.initials} />
              {persona.toUpperCase()} ↻
            </button>
          </div>
        }
      />

      {/* Banner full-width — most important */}
      <div style={{ marginBottom: 24 }}>
        <Alert
          tone={p.banner.tone}
          title={p.banner.title}
          message={p.banner.body}
          actionLabel={p.banner.cta}
          onAction={() => setScreen(p.banner.ctaScreen)}
        />
      </div>

      {/* Two-column body */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: hasAside ? '1fr 360px' : '1fr',
        gap: 24, alignItems: 'start',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <SectionHeader title="RIGHT NOW" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {p.quickActions.map((qa, i) => (
                <DesktopQuickAction key={i} {...qa} onClick={() => setScreen(qa.screen)} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              title="FOR YOUR SITUATION"
              action={<button onClick={() => setScreen('resources')} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: T.accent, fontWeight: 600, fontSize: 13, fontFamily: 'Inter',
              }}>See all →</button>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.recommended.map(id => {
                const r = RESOURCES[id]; if (!r) return null;
                return <ResourceCard key={id} {...r} onClick={() => setScreen('resources')} />;
              })}
            </div>
          </section>

          <section>
            <SectionHeader title="PEER COUNSELORS · AVAILABLE TODAY"
              action={<button onClick={() => setScreen('counselors')} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: T.accent, fontWeight: 600, fontSize: 13, fontFamily: 'Inter',
              }}>Browse all →</button>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {COUNSELORS.filter(c => c.availableToday).map(co => (
                <CounselorCard key={co.id} {...co} onClick={() => setScreen('counselors')} />
              ))}
            </div>
          </section>
        </div>

        {/* Right column — sidebar widgets */}
        {hasAside && (
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {showMood && (
          <Card variant="soft">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 20, background: T.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, border: `1px solid ${T.border}`,
              }}>💚</div>
              <div style={{ flex: 1 }}>
                <Text variant="subtitle">How are you feeling?</Text>
                <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>
                  60-second private check-in
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['😞 Rough', '😐 Numb', '🙂 Coping', '💪 OK'].map(m => (
                <button key={m} style={{
                  background: T.bg, border: `1.5px solid ${T.border}`,
                  paddingInline: 10, paddingBlock: 7, borderRadius: 999,
                  fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: T.text,
                  cursor: 'pointer',
                }}>{m}</button>
              ))}
            </div>
          </Card>
          )}

          {showProgress && (
          <Card variant="outline">
            <Text variant="label" tone="subtle" style={{ marginBottom: 12 }}>YOUR PROGRESS</Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ProgressRow label="Read your severance offer" done />
              <ProgressRow label="File for unemployment" done />
              <ProgressRow label="Talk to a peer counselor" />
              <ProgressRow label="Update LinkedIn quietly" />
            </div>
            <div style={{
              marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Text variant="caption" tone="muted">2 of 4 · Day 4</Text>
              <button style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                color: T.accent, fontWeight: 700, fontSize: 12, fontFamily: 'Inter',
              }}>View checklist →</button>
            </div>
          </Card>
          )}

          {showCommunity && (
          <Card variant="outline">
            <Text variant="label" tone="subtle" style={{ marginBottom: 10 }}>COMMUNITY</Text>
            <Text variant="body" weight={600}>
              387 people in your situation are here right now.
            </Text>
            <Text variant="caption" tone="muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
              You're not alone. Join an anonymous group thread or read what others are working through.
            </Text>
            <button style={{
              marginTop: 12, background: T.bg, border: `1.5px solid ${T.borderStrong}`,
              paddingInline: 14, paddingBlock: 8, borderRadius: 8,
              fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: T.text,
              cursor: 'pointer',
            }}>Open community →</button>
          </Card>
          )}
        </aside>
        )}
      </div>
    </PageWrap>
  );
}

function DesktopQuickAction({ label, sublabel, tint, onClick }) {
  const tintMap = {
    accent:  { bg: T.accentSoft,  fg: T.accent,  rail: T.accent },
    success: { bg: T.successSoft, fg: T.success, rail: T.success },
    warning: { bg: T.warningSoft, fg: T.warning, rail: T.warning },
    danger:  { bg: T.dangerSoft,  fg: T.danger,  rail: T.danger },
    sunken:  { bg: T.sunken,      fg: T.text,    rail: T.borderStrong },
  };
  const c = tintMap[tint] || tintMap.sunken;
  return (
    <button onClick={onClick} style={{
      position: 'relative', overflow: 'hidden',
      background: c.bg, border: 0, borderRadius: 12, padding: '18px 16px',
      cursor: 'pointer', textAlign: 'left', minHeight: 96,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: 'Inter',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c.rail }} />
      <Text variant="body" weight={700}>{label}</Text>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Text variant="caption" tone="muted">{sublabel}</Text>
        <span style={{ color: c.fg, fontSize: 18, fontWeight: 700 }}>→</span>
      </div>
    </button>
  );
}

function ProgressRow({ label, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 18, height: 18, borderRadius: 9,
        border: `2px solid ${done ? T.success : T.border}`,
        background: done ? T.success : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {done && <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>✓</span>}
      </div>
      <Text variant="bodySm" tone={done ? 'muted' : 'default'}
        style={{ textDecoration: done ? 'line-through' : 'none' }}>
        {label}
      </Text>
    </div>
  );
}

/* ───────────── Chat ───────────── */
function DesktopChat() {
  const [active, setActive] = React.useState('vol12');
  const threads = [
    { id: 'vol12', name: 'Anon_Volunteer_12', tag: 'Peer volunteer', tint: T.success,
      preview: "Take your time. What's weighing on you most?", time: '2:16 PM', unread: 0, online: true },
    { id: 'vol04', name: 'Anon_Volunteer_04', tag: 'Severance specialist', tint: T.accent,
      preview: 'Sent you a draft response to the NDA clause.', time: '11:42 AM', unread: 2, online: true },
    { id: 'circ1', name: 'Severance Circle', tag: '4 members · group',  tint: T.purple,
      preview: 'Maya: I tried negotiating an extra 4 weeks…', time: 'Yesterday', unread: 0, online: false },
    { id: 'vol22', name: 'Anon_Volunteer_22', tag: 'H-1B peer',           tint: T.pink,
      preview: 'Yes — your 60 days starts the day after termination.', time: 'Mon', unread: 0, online: false },
    { id: 'circ2', name: 'Day-1 Circle',      tag: '12 members · group', tint: T.warning,
      preview: 'David: Day 4. Slept 5 hours. Better than Day 2.', time: 'Mar 24', unread: 0, online: false },
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
    const mine = { id: Date.now(), from: 'me', text: draft.trim(), time };
    setMessages(ms => [...ms, mine]);
    setDraft('');
    setTimeout(() => {
      setMessages(ms => [...ms, {
        id: Date.now() + 1, from: 'them',
        text: "Thanks for sharing that. Take your time. What's weighing on you most right now?", time,
      }]);
    }, 1200);
  };

  const activeThread = threads.find(t => t.id === active) || threads[0];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '320px 1fr',
      height: '100vh', background: T.bg,
    }}>
      {/* Thread list */}
      <div style={{
        borderRight: `1px solid ${T.border}`, background: T.bg,
        display: 'flex', flexDirection: 'column', minHeight: 0,
      }}>
        <div style={{ padding: '20px 20px 12px' }}>
          <Text variant="display" style={{ fontSize: 22, lineHeight: '28px' }}>Chat</Text>
          <Text variant="caption" tone="muted" style={{ marginTop: 4 }}>
            Anonymous & confidential
          </Text>
        </div>
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{
            background: T.sunken, borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: T.textSubtle, fontSize: 14 }}>⌕</span>
            <input placeholder="Search threads"
              style={{
                flex: 1, background: 'transparent', border: 0, outline: 'none',
                fontFamily: 'Inter', fontSize: 13, color: T.text,
              }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {threads.map(t => {
            const on = t.id === active;
            return (
              <button key={t.id} onClick={() => setActive(t.id)} style={{
                width: '100%', textAlign: 'left', cursor: 'pointer',
                background: on ? T.accentSoft : 'transparent',
                border: 0, borderLeft: `3px solid ${on ? T.accent : 'transparent'}`,
                padding: '12px 16px 12px 13px',
                display: 'flex', gap: 10, fontFamily: 'Inter',
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar size="md" tint={t.tint} initials={t.name.slice(0, 2).toUpperCase()} />
                  {t.online && <span style={{
                    position: 'absolute', right: -1, bottom: -1, width: 10, height: 10,
                    borderRadius: 5, background: T.success, border: `2px solid ${T.bg}`,
                  }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text,
                                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 11, color: T.textSubtle, fontWeight: 500 }}>{t.time}</div>
                  </div>
                  <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, marginTop: 1 }}>
                    {t.tag}
                  </div>
                  <div style={{
                    fontSize: 12, color: T.textMuted, marginTop: 4, lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {t.preview}
                  </div>
                </div>
                {t.unread > 0 && (
                  <div style={{
                    minWidth: 18, height: 18, borderRadius: 9, background: T.danger,
                    paddingInline: 5, color: '#fff', fontSize: 10, fontWeight: 800,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    alignSelf: 'center',
                  }}>{t.unread}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active conversation */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: T.sunken }}>
        <div style={{
          background: T.bg, borderBottom: `1px solid ${T.border}`,
          padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Avatar size="md" tint={activeThread.tint} initials={activeThread.name.slice(0, 2).toUpperCase()} />
          <div style={{ flex: 1 }}>
            <Text variant="subtitle">{activeThread.name}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: T.success }} />
              <Text variant="caption" tone="muted">Online · {activeThread.tag}</Text>
            </div>
          </div>
          <button style={{
            background: 'transparent', border: `1.5px solid ${T.border}`,
            paddingInline: 12, paddingBlock: 7, borderRadius: 8,
            fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: T.textMuted,
            cursor: 'pointer',
          }}>Block / Report</button>
          <button style={{
            background: 'transparent', border: `1.5px solid ${T.border}`,
            paddingInline: 12, paddingBlock: 7, borderRadius: 8,
            fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: T.danger,
            cursor: 'pointer',
          }}>End chat</button>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <Alert tone="info" title="Anonymous & confidential"
              message="Volunteers can't see your real identity. You can end this chat anytime." />
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
              {messages.map((msg, i) => {
                const prev = messages[i - 1];
                return (
                  <MessageBubble
                    key={msg.id}
                    from={msg.from}
                    author={activeThread.name}
                    authorTag={activeThread.tag}
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
          background: T.bg, borderTop: `1px solid ${T.border}`,
          padding: '14px 32px',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message…"
              style={{
                flex: 1, height: 44, paddingInline: 16, borderRadius: 22,
                background: T.sunken, border: 0, outline: 'none',
                fontFamily: 'Inter', fontSize: 14, color: T.text,
              }}
            />
            <button onClick={send} disabled={!draft.trim()} style={{
              height: 44, paddingInline: 18, borderRadius: 22,
              background: draft.trim() ? T.accent : T.borderStrong,
              border: 0, color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: draft.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Inter',
            }}>Send ↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Counselors ───────────── */
function DesktopCounselors({ persona }) {
  const initialFilter = persona === 'priya' ? 'H-1B' : persona === 'james' ? 'ADEA' : 'All';
  const [tag, setTag] = React.useState(initialFilter);
  const [availability, setAvailability] = React.useState('any'); // any | today
  const ALL_TAGS = ['All', 'Severance', 'NDA', 'COBRA', 'H-1B', 'ADEA', 'Benefits', 'Legal', 'Visa', 'Unemployment'];

  let filtered = COUNSELORS;
  if (tag !== 'All') filtered = filtered.filter(c => c.tags.includes(tag));
  if (availability === 'today') filtered = filtered.filter(c => c.availableToday);

  return (
    <PageWrap>
      <PageHeader
        title="Peer Counselors"
        subtitle="All counselors are vetted volunteers who've been through layoffs themselves. Free, confidential, scheduled at your pace."
        right={
          <button style={{
            background: T.accent, border: 0, color: '#fff',
            paddingInline: 16, paddingBlock: 10, borderRadius: 8,
            fontFamily: 'Inter', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>+ Request specialist</button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Filter rail */}
        <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card variant="outline">
            <Text variant="label" tone="subtle" style={{ marginBottom: 10 }}>AVAILABILITY</Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'any',   label: 'Any time' },
                { id: 'today', label: 'Available today' },
              ].map(o => {
                const on = o.id === availability;
                return (
                  <button key={o.id} onClick={() => setAvailability(o.id)} style={{
                    background: on ? T.accentSoft : 'transparent',
                    border: 0, paddingInline: 10, paddingBlock: 8, borderRadius: 6,
                    fontFamily: 'Inter', fontSize: 13, fontWeight: on ? 700 : 500,
                    color: on ? T.accent : T.text, textAlign: 'left', cursor: 'pointer',
                  }}>{o.label}</button>
                );
              })}
            </div>
          </Card>

          <Card variant="outline">
            <Text variant="label" tone="subtle" style={{ marginBottom: 10 }}>SPECIALTY</Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {ALL_TAGS.map(t => {
                const on = t === tag;
                return (
                  <button key={t} onClick={() => setTag(t)} style={{
                    background: on ? T.accentSoft : 'transparent',
                    border: 0, paddingInline: 10, paddingBlock: 8, borderRadius: 6,
                    fontFamily: 'Inter', fontSize: 13, fontWeight: on ? 700 : 500,
                    color: on ? T.accent : T.text, textAlign: 'left', cursor: 'pointer',
                  }}>{t}</button>
                );
              })}
            </div>
          </Card>

          <Card variant="soft">
            <Text variant="subtitle" style={{ marginBottom: 6 }}>Want to volunteer?</Text>
            <Text variant="caption" tone="muted" style={{ lineHeight: 1.5 }}>
              If you've been through this and want to help, we'd love to hear from you.
            </Text>
            <button style={{
              marginTop: 10, background: T.bg, border: `1.5px solid ${T.borderStrong}`,
              paddingInline: 12, paddingBlock: 7, borderRadius: 8,
              fontFamily: 'Inter', fontSize: 12, fontWeight: 700, color: T.text,
              cursor: 'pointer',
            }}>Apply →</button>
          </Card>
        </aside>

        {/* Result grid */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <Text variant="subtitle">
              {filtered.length} counselor{filtered.length === 1 ? '' : 's'}
              {tag !== 'All' && <Text variant="subtitle" tone="muted" style={{ display: 'inline', fontWeight: 500 }}> · {tag}</Text>}
            </Text>
            <Text variant="caption" tone="muted">Sorted by availability</Text>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {filtered.map(co => <CounselorCard key={co.id} {...co} />)}
            {filtered.length === 0 && (
              <Card variant="soft" style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center' }}>
                <Text variant="subtitle">No counselors match these filters.</Text>
                <Text variant="caption" tone="muted" style={{ marginTop: 6 }}>
                  Try widening availability, or request a specialist for your situation.
                </Text>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

/* ───────────── Resources ───────────── */
function DesktopResources() {
  const [cat, setCat] = React.useState('All');
  const CATS = ['All', 'Severance', 'Benefits', 'H-1B', 'Legal', 'Wellbeing'];
  const list = Object.entries(RESOURCES).map(([id, r]) => ({ id, ...r }))
    .filter(r => cat === 'All' ? true : r.tag === cat);
  const vids = cat === 'All' ? VIDEOS : VIDEOS.filter(v => v.category === cat.toUpperCase());

  return (
    <PageWrap maxWidth={1240}>
      <PageHeader
        title="Resources"
        subtitle="Plain-English guides, checklists, and short videos. No legalese, no MBA-speak."
      />

      {/* Featured */}
      <div style={{ marginBottom: 28 }}>
        <DesktopFeatured />
      </div>

      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 24,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {CATS.map(x => {
          const active = x === cat;
          return (
            <button key={x} onClick={() => setCat(x)} style={{
              paddingInline: 14, paddingBlock: 10,
              background: 'transparent',
              border: 0, borderBottom: `2px solid ${active ? T.accent : 'transparent'}`,
              fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? T.accent : T.textMuted,
              cursor: 'pointer', fontFamily: 'Inter', marginBottom: -1,
            }}>{x}</button>
          );
        })}
      </div>

      {/* Quick guides — 2 cols on desktop */}
      <section style={{ marginBottom: 36 }}>
        <SectionHeader title="QUICK GUIDES & ARTICLES" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {list.map(r => <ResourceCard key={r.id} {...r} />)}
          {list.length === 0 && (
            <Card variant="soft" style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center' }}>
              <Text variant="bodySm" tone="muted">No guides in this category yet.</Text>
            </Card>
          )}
        </div>
      </section>

      {/* Video grid — 3 cols on desktop */}
      <section>
        <SectionHeader title="VIDEO LIBRARY" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {vids.map(v => (
            <VideoCard key={v.id} title={v.title}
              duration={v.meta.split(' · ')[0]} category={v.category} />
          ))}
        </div>
      </section>
    </PageWrap>
  );
}

function DesktopFeatured() {
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
      background: T.accentHover,
      display: 'grid', gridTemplateColumns: '1.4fr 1fr',
      minHeight: 280,
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
            width: 72, height: 72, borderRadius: 36, background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.accent, fontSize: 28, paddingLeft: 5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>▶</div>
        </div>
        <div style={{
          position: 'absolute', top: 16, left: 16,
          paddingInline: 10, paddingBlock: 5, borderRadius: 4,
          background: 'rgba(0,0,0,0.4)',
          color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 1,
        }}>FEATURED · ESSENTIALS</div>
      </div>
      <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Text variant="display" style={{ color: '#fff', fontSize: 26, lineHeight: '32px' }}>
          Know Your Rights After a Layoff
        </Text>
        <Text variant="body" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 10, lineHeight: 1.5 }}>
          A 12-minute walkthrough of severance, NDAs, the WARN Act, and what to sign vs. negotiate.
          Made with employment attorneys.
        </Text>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, alignItems: 'center' }}>
          <button style={{
            background: '#fff', color: T.accent, border: 0,
            paddingInline: 16, paddingBlock: 10, borderRadius: 8,
            fontFamily: 'Inter', fontSize: 13, fontWeight: 800, cursor: 'pointer',
          }}>▶ Watch now</button>
          <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>
            12 min · Free · ★ 4.9
          </Text>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Profile ───────────── */
function DesktopProfile({ setScreen, state, persona }) {
  const p = PERSONAS[persona];
  return (
    <PageWrap maxWidth={1080}>
      <PageHeader title="Profile" subtitle="Your account, privacy, and preferences." />

      <Card variant="outline" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Avatar size="xl" tint={p.tint} initials={p.initials} />
          <div style={{ flex: 1 }}>
            <Text variant="title">{state.handle || p.displayName}</Text>
            <Text variant="caption" tone="muted" style={{ marginTop: 4 }}>
              Member since Oct 2025 · {p.role}
            </Text>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <Badge tone="accent" label="Anonymous" dot />
              <Badge tone="success" label="Verified" />
              <Badge tone="neutral" label="3 active threads" />
            </div>
          </div>
          <button style={{
            background: T.bg, border: `1.5px solid ${T.borderStrong}`,
            paddingInline: 16, paddingBlock: 10, borderRadius: 8,
            fontFamily: 'Inter', fontSize: 13, fontWeight: 700, color: T.text,
            cursor: 'pointer',
          }}>Edit profile</button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <DesktopProfileGroup title="PRIVACY">
          <ListItem title="Privacy settings" subtitle="Data sharing, visibility" onClick={() => {}} />
          <Divider />
          <ListItem title="Block & mute" subtitle="Manage your boundaries" onClick={() => {}} />
          <Divider />
          <ListItem title="Download my data" subtitle="Get a copy of everything" onClick={() => {}} />
        </DesktopProfileGroup>

        <DesktopProfileGroup title="PREFERENCES">
          <ListItem title="Notifications" subtitle="Peer messages, check-ins" onClick={() => {}} />
          <Divider />
          <ListItem title="Appearance" subtitle="System" onClick={() => {}} />
          <Divider />
          <ListItem title="Language" subtitle="English" onClick={() => {}} />
        </DesktopProfileGroup>

        <DesktopProfileGroup title="SUPPORT">
          <ListItem title="Help center" onClick={() => {}} />
          <Divider />
          <ListItem title="Report a problem" onClick={() => {}} />
          <Divider />
          <ListItem title={`About ${state.brand || 'StandStrong'}`} subtitle="Our mission, funding, team" onClick={() => {}} />
        </DesktopProfileGroup>

        <DesktopProfileGroup title="ACCOUNT">
          <ListItem title="Sign out" onClick={() => setScreen('welcome')} />
          <Divider />
          <ListItem title="Reset onboarding"
            subtitle="Wipe local state and restart the intake flow."
            onClick={() => {
              try { localStorage.removeItem('standstrong:desktop:state'); } catch {}
              window.location.assign(window.location.pathname + '?reset');
            }} />
          <Divider />
          <ListItem title="Delete my account and data"
            subtitle="Permanent. Cannot be undone." onClick={() => {}} />
        </DesktopProfileGroup>
      </div>

      <Text variant="caption" tone="subtle" align="center" style={{ marginTop: 32 }}>
        {state.brand || 'StandStrong'} v0.1 · Made with care by laid-off workers, for laid-off workers.
      </Text>
    </PageWrap>
  );
}

function DesktopProfileGroup({ title, children }) {
  return (
    <div>
      <SectionHeader title={title} />
      <Card variant="outline" padding={0} style={{ padding: '0 16px' }}>
        {children}
      </Card>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.border }} />;
}

Object.assign(window, {
  DesktopDashboard, DesktopChat, DesktopCounselors, DesktopResources, DesktopProfile,
});
