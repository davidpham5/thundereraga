// Desktop shell primitives for StandStrong.
// Direction: "reading-room calm" — thin top nav, centered max-widths,
// generous negative space. No sidebar on purpose — this is not a dashboard.

/* ───────── TopNav ───────── */
function TopNav({ active, onChange, handle, onHandleClick }) {
  const tabs = [
    { id: 'dashboard',  label: 'Home' },
    { id: 'chat',       label: 'Chat' },
    { id: 'counselors', label: 'Counselors' },
    { id: 'resources',  label: 'Resources' },
    { id: 'profile',    label: 'Profile' },
  ];
  return (
    <div style={{
      height: 'var(--nav-h)', background: T.bg,
      borderBottom: `1px solid ${T.border}`,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{
        maxWidth: 'var(--content-wide)', height: '100%',
        margin: '0 auto', paddingInline: 32,
        display: 'flex', alignItems: 'center', gap: 32,
      }}>
        <Wordmark />
        <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
          {tabs.map(t => {
            const on = t.id === active;
            return (
              <button key={t.id} onClick={() => onChange(t.id)} style={{
                background: 'transparent', border: 0, cursor: 'pointer',
                padding: '10px 14px', borderRadius: 8,
                color: on ? T.text : T.textMuted,
                fontFamily: 'Inter', fontSize: 14, fontWeight: on ? 700 : 500,
                position: 'relative',
                transition: 'color 160ms',
              }}
              onMouseOver={(e) => !on && (e.currentTarget.style.color = T.text)}
              onMouseOut={(e)  => !on && (e.currentTarget.style.color = T.textMuted)}>
                {t.label}
                {on && <div style={{
                  position: 'absolute', left: 14, right: 14, bottom: -14,
                  height: 2, background: T.accent, borderRadius: 2,
                }} />}
              </button>
            );
          })}
        </nav>
        <HandleChip handle={handle} onClick={onHandleClick} />
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: T.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.3,
      }}>S</div>
      <span style={{
        fontFamily: 'Inter', fontWeight: 800, fontSize: 16,
        letterSpacing: -0.2, color: T.text,
      }}>StandStrong</span>
    </div>
  );
}

function HandleChip({ handle, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      height: 36, paddingInline: 12, borderRadius: 999,
      background: T.sunken, border: `1px solid ${T.border}`,
      cursor: 'pointer', fontFamily: 'Inter',
    }}
    onMouseOver={(e) => e.currentTarget.style.borderColor = T.borderStrong}
    onMouseOut={(e)  => e.currentTarget.style.borderColor = T.border}>
      <span style={{
        width: 22, height: 22, borderRadius: 11, background: T.accentHover,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 10, fontWeight: 700,
      }}>{(handle?.[0] || 'A').toUpperCase()}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {handle || 'Anonymous'}
      </span>
    </button>
  );
}

/* ───────── DesktopAppShell ───────── */
function DesktopAppShell({ children, active, onChange, handle, onHandleClick }) {
  return (
    <>
      <TopNav active={active} onChange={onChange} handle={handle} onHandleClick={onHandleClick} />
      <main style={{ flex: 1, width: '100%' }}>{children}</main>
      <DesktopFooter />
    </>
  );
}

function DesktopFooter() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`, background: T.bg, marginTop: 64,
      paddingBlock: 20,
    }}>
      <div style={{
        maxWidth: 'var(--content-wide)', margin: '0 auto', paddingInline: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: 4, background: T.success,
          }} />
          <Text variant="caption" tone="muted">
            Anonymous · Peer-led · Your information is yours alone.
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <FooterLink>Privacy</FooterLink>
          <FooterLink>Help</FooterLink>
          <FooterLink>About</FooterLink>
        </div>
      </div>
    </footer>
  );
}
function FooterLink({ children }) {
  return <button style={{
    background: 'transparent', border: 0, cursor: 'pointer',
    color: T.textMuted, fontSize: 12, fontWeight: 600,
    fontFamily: 'Inter', padding: 0,
  }} onMouseOver={(e) => e.currentTarget.style.color = T.text}
     onMouseOut ={(e) => e.currentTarget.style.color = T.textMuted}>
    {children}
  </button>;
}

/* ───────── OnboardingShell ───────── */
// Centered 560px column, thin progress indicator top, no tabs.
// The space around the column is intentionally empty — breathing room.
function OnboardingShell({ step, total, onBack, children }) {
  return (
    <>
      <div style={{
        height: 'var(--nav-h)', background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{
          maxWidth: 'var(--content-wide)', height: '100%',
          margin: '0 auto', paddingInline: 32,
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <Wordmark />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <StepDots step={step} total={total} />
          </div>
          {onBack ? (
            <button onClick={onBack} style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: T.textMuted, fontSize: 13, fontWeight: 600,
              fontFamily: 'Inter', padding: '8px 10px', borderRadius: 6,
            }}
            onMouseOver={(e) => e.currentTarget.style.color = T.text}
            onMouseOut ={(e) => e.currentTarget.style.color = T.textMuted}>
              ← Back
            </button>
          ) : <span style={{ width: 52 }} />}
        </div>
      </div>
      <main style={{ flex: 1, paddingBlock: 'clamp(40px, 7vh, 96px)' }}>
        <div style={{
          maxWidth: 'var(--content-narrow)', margin: '0 auto', paddingInline: 24,
        }} className="rise">
          {children}
        </div>
      </main>
    </>
  );
}

function StepDots({ step, total }) {
  if (!total) return null;
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i + 1 < step;
        const active = i + 1 === step;
        return (
          <div key={i} style={{
            width: active ? 28 : 8, height: 4, borderRadius: 2,
            background: active ? T.accent : done ? T.borderStrong : T.border,
            transition: 'width 220ms, background 220ms',
          }} />
        );
      })}
    </div>
  );
}

/* ───────── TwoPane (used by Chat) ───────── */
function TwoPane({ left, right, leftWidth = 320 }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `${leftWidth}px 1fr`,
      gap: 0, height: 'calc(100vh - var(--nav-h))',
      maxWidth: 'var(--content-wide)', margin: '0 auto',
      background: T.bg, borderInline: `1px solid ${T.border}`,
    }}>
      <aside style={{ borderRight: `1px solid ${T.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {left}
      </aside>
      <section style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {right}
      </section>
    </div>
  );
}

/* ───────── Page containers ───────── */
function Page({ width = 'mid', style, children }) {
  const maxW = { narrow: 'var(--content-narrow)', mid: 'var(--content-mid)', wide: 'var(--content-wide)' }[width];
  return (
    <div style={{
      maxWidth: maxW, margin: '0 auto',
      paddingInline: 32, paddingBlock: 32,
      ...(style||{}),
    }}>{children}</div>
  );
}

function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 24, marginBottom: 24, flexWrap: 'wrap',
    }}>
      <div>
        {eyebrow && <Text variant="label" tone="subtle" style={{ marginBottom: 6 }}>{eyebrow}</Text>}
        <div style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 32, letterSpacing: -0.6, lineHeight: 1.1, color: T.text }}>
          {title}
        </div>
        {subtitle && <Text variant="body" tone="muted" style={{ marginTop: 6, maxWidth: 560 }}>{subtitle}</Text>}
      </div>
      {actions}
    </div>
  );
}

function SectionHead({ title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 14, marginTop: 28,
    }}>
      <Text variant="label" tone="subtle">{title}</Text>
      {action}
    </div>
  );
}

/* ───────── Display headline (Onboarding H1) ───────── */
function DisplayHeadline({ children, style }) {
  return (
    <h1 style={{
      fontFamily: 'Inter', fontWeight: 800, fontSize: 36, letterSpacing: -0.8,
      lineHeight: 1.1, color: T.text, margin: 0, ...(style||{}),
    }}>{children}</h1>
  );
}

Object.assign(window, {
  TopNav, Wordmark, HandleChip,
  DesktopAppShell, DesktopFooter,
  OnboardingShell, StepDots, TwoPane,
  Page, PageHeader, SectionHead, DisplayHeadline,
});
