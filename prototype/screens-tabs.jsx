// Tab screens for the prototype. Each takes { persona, setPersona, setScreen }.

/* ───────────── Dashboard ───────────── */
function DashboardTab({ persona, setPersona, setScreen }) {
  const p = PERSONAS[persona];

  return (
    <div style={{ background: T.sunken, minHeight: "100%" }}>
      <TopBar
        title='StandStrong'
        trailing={
          <button
            onClick={() => {
              const i = PERSONA_ORDER.indexOf(persona);
              setPersona(PERSONA_ORDER[(i + 1) % PERSONA_ORDER.length]);
            }}
            title='Switch persona'
            style={{
              background: T.sunken,
              border: 0,
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: 999,
              color: T.textMuted,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "Inter",
              letterSpacing: 0.5,
              marginRight: 12,
            }}>
            {persona.toUpperCase()} ↻
          </button>
        }
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
        <div>
          <Text variant='body' tone='muted'>
            Hi,
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 4,
            }}>
            <Avatar size='md' tint={p.tint} initials={p.initials} />
            <Text variant='title'>{p.displayName}</Text>
          </div>
          <Text variant='caption' tone='subtle' style={{ marginTop: 2 }}>
            {p.role}
          </Text>
        </div>

        <Alert
          tone={p.banner.tone}
          title={p.banner.title}
          message={p.banner.body}
          actionLabel={p.banner.cta}
          onAction={() => setScreen(p.banner.ctaScreen)}
        />

        <div>
          <SectionHeader title='RIGHT NOW' />
          <div style={{ display: "flex", gap: 10 }}>
            {p.quickActions.map((qa, i) => (
              <QuickAction
                key={i}
                {...qa}
                onClick={() => setScreen(qa.screen)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            title='FOR YOUR SITUATION'
            action={
              <button
                onClick={() => setScreen("resources")}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  color: T.accent,
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: "Inter",
                }}>
                See all
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {p.recommended.slice(0, 3).map((id) => {
              const r = RESOURCES[id];
              if (!r) return null;
              return (
                <ResourceCard
                  key={id}
                  {...r}
                  onClick={() => setScreen("resources")}
                />
              );
            })}
          </div>
        </div>

        <Card variant='soft' accent='success'>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: T.successSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}>
              💚
            </div>
            <div style={{ flex: 1 }}>
              <Text variant='subtitle'>How are you feeling?</Text>
              <Text variant='caption' tone='muted' style={{ marginTop: 2 }}>
                Take 60 seconds — no one sees your answer.
              </Text>
            </div>
            <Text variant='body' tone='subtle'>
              ›
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ label, sublabel, tint, onClick }) {
  const tintMap = {
    accent: T.accentSoft,
    success: T.successSoft,
    warning: T.warningSoft,
    danger: T.dangerSoft,
    sunken: T.mutedSurface,
  };
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: tintMap[tint] || T.mutedSurface,
        border: 0,
        borderRadius: 10,
        padding: 12,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 80,
        justifyContent: "center",
        textAlign: "left",
        fontFamily: "Inter",
      }}>
      <Text variant='bodySm' weight={700}>
        {label}
      </Text>
      <Text variant='caption' tone='muted'>
        {sublabel}
      </Text>
    </button>
  );
}

/* ───────────── Chat ───────────── */
function ChatTab({ back }) {
  const seed = [
    {
      id: 1,
      from: "them",
      text: "Hi — I saw you just signed up. No pressure to talk, but I'm here if you want to. I've been through this too.",
      time: "2:14 PM",
    },
    {
      id: 2,
      from: "me",
      text: "Thanks. I'm not really sure where to start honestly.",
      time: "2:16 PM",
    },
    {
      id: 3,
      from: "them",
      text: "That's really common. Would it help if we just ran through what you're dealing with right now? You can share as much or as little as you want.",
      time: "2:16 PM",
    },
  ];
  const [messages, setMessages] = React.useState(seed);
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const h = ((now.getHours() + 11) % 12) + 1;
    const m = String(now.getMinutes()).padStart(2, "0");
    const ap = now.getHours() >= 12 ? "PM" : "AM";
    const time = `${h}:${m} ${ap}`;
    const mine = { id: Date.now(), from: "me", text: draft.trim(), time };
    setMessages((ms) => [...ms, mine]);
    setDraft("");
    setTimeout(() => {
      setMessages((ms) => [
        ...ms,
        {
          id: Date.now() + 1,
          from: "them",
          text: "Thanks for sharing that. Take your time. What's weighing on you most right now?",
          time,
        },
      ]);
    }, 1200);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: T.sunken,
      }}>
      <TopBar
        leading={<BackButton label='' onClick={back} />}
        trailing={
          <button
            onClick={back}
            style={{
              background: "transparent",
              border: 0,
              cursor: "pointer",
              paddingRight: 12,
              color: T.accent,
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "Inter",
            }}>
            End chat
          </button>
        }
      />
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
        <Avatar size='md' tint={T.success} initials='V' />
        <div style={{ flex: 1 }}>
          <Text variant='subtitle'>Anon_Volunteer_12</Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 2,
            }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: T.success,
              }}
            />
            <Text variant='caption' tone='muted'>
              Online · Peer volunteer
            </Text>
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <Alert
          tone='info'
          title='Anonymous & confidential'
          message="Volunteers can't see your real identity. You can end this chat anytime."
        />
        <div
          style={{ marginTop: 16, display: "flex", flexDirection: "column" }}>
          {messages.map((msg, i) => {
            const prev = messages[i - 1];
            return (
              <MessageBubble
                key={msg.id}
                from={msg.from}
                author='Anon_Volunteer_12'
                authorTag='Peer volunteer'
                text={msg.text}
                time={msg.time}
                continues={prev && prev.from === msg.from}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderTop: `1px solid ${T.border}`,
          background: T.bg,
        }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder='Type a message…'
          style={{
            flex: 1,
            height: 44,
            paddingInline: 16,
            borderRadius: 22,
            background: T.sunken,
            border: 0,
            outline: "none",
            fontFamily: "Inter",
            fontSize: 15,
            color: T.text,
          }}
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: draft.trim() ? T.accent : T.borderStrong,
            border: 0,
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            cursor: draft.trim() ? "pointer" : "not-allowed",
          }}>
          ↑
        </button>
      </div>
    </div>
  );
}

/* ───────────── Counselors ───────────── */
function CounselorsTab({ persona }) {
  const initialFilter =
    persona === "priya" ? "H-1B" : persona === "james" ? "ADEA" : "All";
  const [tag, setTag] = React.useState(initialFilter);
  const ALL = [
    "All",
    "Available today",
    "Severance",
    "NDA",
    "COBRA",
    "H-1B",
    "ADEA",
  ];
  const filtered =
    tag === "All"
      ? COUNSELORS
      : tag === "Available today"
        ? COUNSELORS.filter((c) => c.availableToday)
        : COUNSELORS.filter((c) => c.tags.includes(tag));

  return (
    <div style={{ background: T.sunken, minHeight: "100%" }}>
      <TopBar title='Peer Counselors' />
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}>
        {ALL.map((x) => {
          const active = x === tag;
          return (
            <button
              key={x}
              onClick={() => setTag(x)}
              style={{
                paddingInline: 12,
                paddingBlock: 8,
                borderRadius: 999,
                background: active ? T.accent : T.bg,
                color: active ? "#fff" : T.text,
                border: `1.5px solid ${active ? T.accent : T.border}`,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "Inter",
              }}>
              {x}
            </button>
          );
        })}
      </div>
      <div
        style={{
          padding: "0 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}>
          <Text variant='subtitle'>
            {filtered.length} counselor{filtered.length === 1 ? "" : "s"}
          </Text>
          <Text variant='caption' tone='muted'>
            All vetted volunteers
          </Text>
        </div>
        {filtered.map((co) => (
          <CounselorCard key={co.id} {...co} />
        ))}
      </div>
    </div>
  );
}

/* ───────────── Resources ───────────── */
function ResourcesTab() {
  const [cat, setCat] = React.useState("All");
  const CATS = ["All", "Severance", "Benefits", "H-1B", "Legal", "Wellbeing"];
  const list = Object.entries(RESOURCES)
    .map(([id, r]) => ({ id, ...r }))
    .filter((r) => (cat === "All" ? true : r.tag === cat))
    .slice(0, 6);
  const vids =
    cat === "All"
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === cat.toUpperCase());

  return (
    <div style={{ background: T.sunken, minHeight: "100%" }}>
      <TopBar title='Resources' />
      <div style={{ padding: 20 }}>
        <FeaturedCard />
      </div>
      <div
        style={{
          padding: "0 20px 12px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}>
        {CATS.map((x) => {
          const active = x === cat;
          return (
            <button
              key={x}
              onClick={() => setCat(x)}
              style={{
                paddingInline: 12,
                paddingBlock: 8,
                borderRadius: 999,
                background: active ? T.accent : T.bg,
                color: active ? "#fff" : T.text,
                border: `1.5px solid ${active ? T.accent : T.border}`,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "Inter",
              }}>
              {x}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "0 20px" }}>
        <SectionHeader title='QUICK GUIDES' />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map((r) => (
            <ResourceCard key={r.id} {...r} />
          ))}
        </div>
      </div>
      <div style={{ padding: "24px 20px 20px" }}>
        <SectionHeader title='VIDEO LIBRARY' />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {vids.map((v) => (
            <VideoCard
              key={v.id}
              title={v.title}
              duration={v.meta.split(" · ")[0]}
              category={v.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard() {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        background: T.accentHover,
        cursor: "pointer",
      }}>
      <div
        style={{
          aspectRatio: "16/9",
          position: "relative",
          background: `linear-gradient(135deg, ${T.accent}, ${T.accentHover})`,
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.accent,
              fontSize: 22,
              paddingLeft: 4,
            }}>
            ▶
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            paddingInline: 8,
            paddingBlock: 3,
            borderRadius: 4,
            background: "rgba(0,0,0,0.35)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.8,
          }}>
          ESSENTIALS
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <Text variant='title' style={{ color: "#fff" }}>
          Know Your Rights After a Layoff
        </Text>
        <Text
          variant='caption'
          style={{ color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
          12 min · Free · ★ 4.9
        </Text>
      </div>
    </div>
  );
}

/* ───────────── Profile ───────────── */
function ProfileTab({ setScreen, state, persona }) {
  const p = PERSONAS[persona];
  return (
    <div style={{ background: T.sunken, minHeight: "100%" }}>
      <TopBar title='Profile' />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
        <Card variant='outline'>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar size='xl' tint={p.tint} initials={p.initials} />
            <div style={{ flex: 1 }}>
              <Text variant='title'>{state.handle || p.displayName}</Text>
              <Text variant='caption' tone='muted' style={{ marginTop: 2 }}>
                Member since Oct 2025
              </Text>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <Badge tone='accent' label='Anonymous' dot />
                <Badge tone='success' label='Verified' />
              </div>
            </div>
          </div>
        </Card>

        <ProfileGroup title='PRIVACY'>
          <ListItem
            title='Privacy settings'
            subtitle='Data sharing, visibility'
            onClick={() => {}}
          />
          <Divider />
          <ListItem
            title='Block & mute'
            subtitle='Manage your boundaries'
            onClick={() => {}}
          />
          <Divider />
          <ListItem
            title='Download my data'
            subtitle='Get a copy of everything'
            onClick={() => {}}
          />
        </ProfileGroup>

        <ProfileGroup title='PREFERENCES'>
          <ListItem
            title='Notifications'
            subtitle='Peer messages, check-ins'
            onClick={() => {}}
          />
          <Divider />
          <ListItem title='Appearance' subtitle='System' onClick={() => {}} />
          <Divider />
          <ListItem title='Language' subtitle='English' onClick={() => {}} />
        </ProfileGroup>

        <ProfileGroup title='SUPPORT'>
          <ListItem title='Help center' onClick={() => {}} />
          <Divider />
          <ListItem title='Report a problem' onClick={() => {}} />
          <Divider />
          <ListItem
            title='About StandStrong'
            subtitle='Our mission, funding, team'
            onClick={() => {}}
          />
        </ProfileGroup>

        <ProfileGroup title='ACCOUNT'>
          <ListItem title='Sign out' onClick={() => setScreen("welcome")} />
          <Divider />
          <ListItem
            title='Delete my account and data'
            subtitle='Permanent. Cannot be undone.'
            onClick={() => {}}
          />
        </ProfileGroup>

        <Text
          variant='caption'
          tone='subtle'
          align='center'
          style={{ marginTop: 8 }}>
          StandStrong v0.1 · Made with care by laid-off workers, for laid-off
          workers.
        </Text>
      </div>
    </div>
  );
}

function ProfileGroup({ title, children }) {
  return (
    <div>
      <SectionHeader title={title} />
      <Card variant='outline' padding={0} style={{ padding: "0 16px" }}>
        {children}
      </Card>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.border }} />;
}

Object.assign(window, {
  DashboardTab,
  ChatTab,
  CounselorsTab,
  ResourcesTab,
  ProfileTab,
});
