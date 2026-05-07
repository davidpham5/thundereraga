// Desktop onboarding flow — auto-gated entry on desktop.html.
// 7 steps: Welcome → Triage → CreateHandle → Safety → Location → Consent → Confirm.
// Reuses mobile copy and persona-routing logic from screens-onboarding.jsx;
// only the layout adapts to the desktop centered-card pattern.

function DesktopOnboarding({ onComplete }) {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: T.sunken, color: T.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <Text variant="display">Onboarding stub</Text>
    </div>
  );
}

Object.assign(window, { DesktopOnboarding });
