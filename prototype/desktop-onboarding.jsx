// Desktop onboarding flow — auto-gated entry on desktop.html.
// 7 steps: Welcome → Triage → CreateHandle → Safety → Location → Consent → Confirm.
// Reuses mobile copy and persona-routing logic from screens-onboarding.jsx;
// only the layout adapts to the desktop centered-card pattern.

const ONB_TOTAL_STEPS = 7;

function BrandLockup({ brand = 'StandStrong', tagline = 'Peer support, anonymous' }) {
  return (
    <div style={{
      position: 'absolute', top: 24, left: 32,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <LogoMark size={30} letter={(brand[0] || 'S').toUpperCase()} />
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: -0.2 }}>{brand}</div>
        <div style={{ fontSize: 11, color: T.textSubtle, fontWeight: 500 }}>{tagline}</div>
      </div>
    </div>
  );
}

function Stepper({ step, total = ONB_TOTAL_STEPS }) {
  return (
    <div style={{
      display: 'flex', gap: 6,
      marginBottom: 24,
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const done = idx < step;
        const current = idx === step;
        const bg = done ? T.accent : current ? T.accent : T.border;
        return (
          <div key={i} style={{
            width: current ? 40 : 32,
            height: 4,
            borderRadius: 2,
            background: bg,
            opacity: done ? 0.55 : 1,
            transition: 'width 160ms, background 160ms, opacity 160ms',
          }} />
        );
      })}
    </div>
  );
}

function OnbCard({ width = 520, back, children }) {
  return (
    <div style={{
      width, maxWidth: 'calc(100vw - 32px)',
      background: T.bg,
      borderRadius: 16,
      border: `1px solid ${T.border}`,
      boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
      padding: '32px 36px',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      {back && (
        <button
          onClick={back}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent', border: 0, cursor: 'pointer',
            color: T.textMuted, fontFamily: 'Inter', fontSize: 13, fontWeight: 600,
            padding: 0,
          }}
        >← Back</button>
      )}
      {children}
    </div>
  );
}

function OnbShell({ step, children }) {
  return (
    <div style={{
      position: 'relative',
      width: '100vw', height: '100vh',
      background: T.sunken, color: T.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      overflowY: 'auto',
    }}>
      <BrandLockup />
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '88px 16px 32px',
      }}>
        <Stepper step={step} />
        {children}
      </div>
    </div>
  );
}

function DesktopOnboarding({ onComplete }) {
  return (
    <OnbShell step={1}>
      <OnbCard width={520}>
        <Text variant="display" align="center">Shell preview</Text>
        <Text tone="muted" align="center">Step components are not wired up yet.</Text>
      </OnbCard>
    </OnbShell>
  );
}

Object.assign(window, { DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup });
