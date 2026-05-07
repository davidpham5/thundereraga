// Desktop shell: sidebar nav + content area, plus a dev panel.
// Reuses mobile design tokens (T) and primitives wholesale.

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Home',       icon: HomeIcon },
  { id: 'chat',       label: 'Chat',       icon: ChatIcon, badge: 1 },
  { id: 'counselors', label: 'Counselors', icon: HeartIcon },
  { id: 'resources',  label: 'Resources',  icon: BookIcon },
  { id: 'profile',    label: 'Profile',    icon: UserIcon },
];

function HomeIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
    </svg>
  );
}
function ChatIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
    </svg>
  );
}
function HeartIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 6.6a5 5 0 0 0-7-.4L12 7.7l-1.8-1.5a5 5 0 1 0-6.6 7.4L12 21l8.4-7.4a5 5 0 0 0 .4-7z" />
    </svg>
  );
}
function BookIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" /><path d="M4 17h15" />
    </svg>
  );
}
function UserIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
function SettingsIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}
function LogoMark({ size = 28, letter = 'S' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: `linear-gradient(135deg, var(--accent), var(--accent-hover))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.5, letterSpacing: -0.5,
      flexShrink: 0,
    }}>{letter}</div>
  );
}

/* ───────────── Sidebar ───────────── */
function Sidebar({ active, onChange, persona, brand = 'StandStrong', tagline = 'Peer support, anonymous', showCrisisLine = true }) {
  const p = PERSONAS[persona];
  return (
    <aside style={{
      width: 248, flexShrink: 0, background: T.bg,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <LogoMark size={30} letter={(brand[0] || 'S').toUpperCase()} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: -0.2 }}>{brand}</div>
          <div style={{ fontSize: 11, color: T.textSubtle, fontWeight: 500 }}>{tagline}</div>
        </div>
      </div>

      {/* You-card */}
      <div style={{ paddingInline: 12, paddingBottom: 10 }}>
        <div style={{
          background: T.sunken, borderRadius: 10, padding: 12,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar size="md" tint={p.tint} initials={p.initials} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.displayName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: T.success }} />
              <span style={{ fontSize: 11, color: T.textMuted }}>Anonymous · Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ paddingInline: 12, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1, color: T.textSubtle,
          padding: '12px 8px 6px',
        }}>NAVIGATION</div>
        {NAV_ITEMS.map(item => {
          const on = item.id === active;
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => onChange(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingInline: 10, paddingBlock: 9, borderRadius: 8,
              background: on ? T.accentSoft : 'transparent',
              border: 0, cursor: 'pointer', textAlign: 'left',
              color: on ? T.accent : T.text,
              fontFamily: 'Inter', fontSize: 14, fontWeight: on ? 700 : 500,
              transition: 'background 120ms',
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = T.sunken; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={18} color={on ? T.accent : T.textMuted} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9, background: T.danger,
                  paddingInline: 5, color: '#fff', fontSize: 10, fontWeight: 800,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{item.badge}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Footer: crisis line + settings */}
      <div style={{ padding: 12, borderTop: `1px solid ${T.border}` }}>
        {showCrisisLine && (
          <div style={{
            background: T.dangerSoft, borderRadius: 10, padding: 12,
            marginBottom: 8,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
                          color: T.danger, textTransform: 'uppercase' }}>In crisis?</div>
            <div style={{ fontSize: 12, color: T.text, marginTop: 4, lineHeight: 1.4 }}>
              988 — Suicide & Crisis Lifeline. Call or text, free, 24/7.
            </div>
          </div>
        )}
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          paddingInline: 10, paddingBlock: 8, borderRadius: 8,
          background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
          color: T.textMuted, fontFamily: 'Inter', fontSize: 13, fontWeight: 500,
        }}>
          <SettingsIcon size={16} color={T.textMuted} />
          Settings
        </button>
      </div>
    </aside>
  );
}

/* ───────────── Page chrome ───────────── */
function PageHeader({ title, subtitle, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 24, marginBottom: 24,
    }}>
      <div>
        <Text variant="display" style={{ fontSize: 28, lineHeight: '34px', letterSpacing: -0.4 }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="body" tone="muted" style={{ marginTop: 6, maxWidth: 640 }}>
            {subtitle}
          </Text>
        )}
      </div>
      {right}
    </div>
  );
}

function PageWrap({ children, maxWidth = 1180 }) {
  return (
    <div style={{
      maxWidth, margin: '0 auto', padding: '32px 40px 56px',
    }}>
      {children}
    </div>
  );
}

Object.assign(window, { Sidebar, PageHeader, PageWrap, NAV_ITEMS, LogoMark });
