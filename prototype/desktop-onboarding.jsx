// Desktop onboarding flow — auto-gated entry on desktop.html.
// 7 steps: Welcome → Triage → CreateHandle → Safety → Location → Consent → Confirm.
// Reuses mobile copy and persona-routing logic from screens-onboarding.jsx;
// only the layout adapts to the desktop centered-card pattern.

const ONB_TOTAL_STEPS = 7;
const ONB_HANDLES = [
  'Portland-Eng-42',
  'Denver-Hiker-07',
  'Austin-Reader-91',
  'Boston-Tea-18',
  'Seattle-Cloud-23',
  'NYC-Commuter-55',
];
const randomOnbHandle = () => ONB_HANDLES[Math.floor(Math.random() * ONB_HANDLES.length)];

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

function OnbShell({ step, brand, tagline, children }) {
  return (
    <div style={{
      position: 'relative',
      width: '100vw', height: '100vh',
      background: T.sunken, color: T.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      overflowY: 'auto',
    }}>
      <BrandLockup brand={brand} tagline={tagline} />
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

function OnbWelcome({ goto, setState, brand = 'StandStrong' }) {
  const start = (mode) => {
    setState((s) => ({ ...s, triageMode: mode }));
    goto(2);
  };
  return (
    <OnbCard width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36, background: T.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 32, fontWeight: 800,
        }}>{(brand[0] || 'S').toUpperCase()}</div>
        <Text variant="display" align="center">{brand}</Text>
        <Text variant="body" tone="muted" align="center">You're not alone in this.</Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="success" label="Free forever" />
        <Badge tone="neutral" label="Anonymous" />
        <Badge tone="accent" label="Peer-led" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button label="I just got laid off" variant="primary" size="lg" fullWidth
                onClick={() => start('laid_off')} />
        <Button label="I have an account" variant="secondary" size="lg" fullWidth
                onClick={() => start('returning')} />
        <Button label="I'm preparing, just in case" variant="ghost" size="md" fullWidth
                onClick={() => start('preparing')} />
      </div>

      <Text variant="caption" tone="subtle" align="center">
        We never share your identity with your employer.<br/>
        Your information is encrypted and yours alone.
      </Text>
    </OnbCard>
  );
}

function OnbTriage({ goto, back, state, setState }) {
  const initial =
    state.triageMode === 'preparing' ? 'imminent'
    : state.triageMode === 'returning' ? 'returning'
    : 'laid_off';
  const [status, setStatus] = React.useState(state.triageStatus || initial);
  const [flags, setFlags] = React.useState(state.triageFlags || []);

  const toggle = (f) =>
    setFlags((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  const route = () => {
    if (flags.includes('visa_concern')) return 'priya';
    if (flags.includes('discrimination')) return 'james';
    if (flags.includes('severance_deadline')) return 'maya';
    if (status === 'laid_off' && (flags.includes('benefits_ending') || flags.includes('struggling'))) return 'david';
    if (status === 'imminent' || status === 'not_affected') return 'kiesha';
    return 'maya';
  };

  return (
    <OnbCard width={640} back={back}>
      <div>
        <Text variant="display">We'll personalize what you see.</Text>
        <Text variant="body" tone="muted" style={{ marginTop: 6 }}>
          Your answers are private and can be changed anytime.
        </Text>
      </div>

      <RadioGroup
        label="What's your situation?"
        value={status}
        onChange={setStatus}
        options={[
          { value: 'laid_off', label: 'I was laid off' },
          { value: 'imminent', label: 'I think I might be laid off soon' },
          { value: 'not_affected', label: "I'm not affected yet, but preparing" },
          { value: 'returning', label: "I've used this before" },
        ]}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Text variant="label" tone="subtle">ANYTHING URGENT? (OPTIONAL)</Text>
        <Checkbox checked={flags.includes('severance_deadline')}
          onChange={() => toggle('severance_deadline')}
          label="I have a severance deadline" />
        <Checkbox checked={flags.includes('visa_concern')}
          onChange={() => toggle('visa_concern')}
          label="I'm on a work visa (H-1B, etc.)" />
        <Checkbox checked={flags.includes('benefits_ending')}
          onChange={() => toggle('benefits_ending')}
          label="My benefits are ending soon" />
        <Checkbox checked={flags.includes('discrimination')}
          onChange={() => toggle('discrimination')}
          label="I think this may be discrimination" />
        <Checkbox checked={flags.includes('struggling')}
          onChange={() => toggle('struggling')}
          label="I'm struggling — I need to talk to someone" />
      </div>

      {flags.includes('struggling') && (
        <Alert tone="info"
          title="We're here for you."
          message="After you sign up you can chat with a peer volunteer right away — no waiting." />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button label="Continue" variant="primary" size="lg" fullWidth
          onClick={() => {
            setState((s) => ({ ...s, persona: route(), triageStatus: status, triageFlags: flags }));
            goto(3);
          }} />
        <Button label="Skip for now" variant="ghost" size="md" fullWidth
          onClick={() => {
            setState((s) => ({ ...s, persona: 'maya' }));
            goto(3);
          }} />
      </div>
    </OnbCard>
  );
}

function OnbCreateHandle({ goto, back, state, setState }) {
  const [handle, setHandle] = React.useState(state.handle || randomOnbHandle());
  return (
    <OnbCard width={520} back={back}>
      <div>
        <Text variant="display">Pick a name to go by.</Text>
        <Text variant="body" tone="muted" style={{ marginTop: 6 }}>
          This is what other members and counselors will see. Your real name is never required.
        </Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TextField
          label="HANDLE"
          value={handle}
          onChange={setHandle}
          helperText="Letters, numbers, and dashes. Change anytime in Settings." />
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge tone="neutral" label="Randomly generated" />
          <Badge tone="success" label="Available" dot />
        </div>
      </div>

      <Alert tone="info"
        title="Why anonymous?"
        message="We never link your handle to your real identity or employer. Even our own staff can't see who you are unless you choose to verify." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button label="Continue" variant="primary" size="lg" fullWidth
          onClick={() => {
            setState((s) => ({ ...s, handle }));
            goto(4);
          }} />
        <Button label="Generate another" variant="secondary" size="md" fullWidth
          onClick={() => setHandle(randomOnbHandle())} />
      </div>
    </OnbCard>
  );
}

function OnbSafety({ goto, back }) {
  const pledges = [
    { t: 'We never share your identity with your employer.',
      s: 'Not your name, not your handle, not your activity.' },
    { t: 'We never sell your data.',
      s: "We're a nonprofit. Donor-funded, not ad-funded." },
    { t: 'Peer counselors are vetted volunteers.',
      s: 'Background-checked and trained, but not licensed attorneys.' },
    { t: 'You can delete everything anytime.',
      s: 'One tap in Settings. Full wipe, including message history.' },
  ];
  return (
    <OnbCard width={640} back={back}>
      <div>
        <Text variant="display">Before we continue.</Text>
        <Text variant="body" tone="muted" style={{ marginTop: 6 }}>
          Four things we promise, and one thing we ask.
        </Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pledges.map((p, i) => (
          <Card key={i} variant="outline">
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14,
                background: T.successSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.success, fontWeight: 800, flexShrink: 0,
              }}>✓</div>
              <div style={{ flex: 1 }}>
                <Text variant="body" weight={600}>{p.t}</Text>
                <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>{p.s}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card variant="soft" accent="accent">
        <Text variant="label" tone="accent">WE ASK ONE THING</Text>
        <Text variant="body" style={{ marginTop: 6 }}>
          Treat other members with respect. This is a safe space for everyone.
        </Text>
      </Card>

      <Button label="I understand — continue" variant="primary" size="lg" fullWidth
        onClick={() => goto(5)} />
    </OnbCard>
  );
}

function OnbLocation({ goto, back, setState }) {
  const [st, setSt] = React.useState('');
  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'OR', label: 'Oregon' },
    { value: 'WA', label: 'Washington' },
    { value: 'TX', label: 'Texas' },
    { value: 'GA', label: 'Georgia' },
    { value: 'NY', label: 'New York' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'CO', label: 'Colorado' },
  ];
  return (
    <OnbCard width={520} back={back}>
      <div>
        <Text variant="display">We'll show state-specific resources.</Text>
        <Text variant="body" tone="muted" style={{ marginTop: 6 }}>
          Unemployment rules, worker-protection laws, and local counselors vary by state.
        </Text>
      </div>

      <Select label="STATE" value={st} onChange={setSt}
        placeholder="Choose your state" options={stateOptions} />

      <Alert tone="info"
        title="Only your state is used for routing."
        message="We don't store your city or precise location." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button label="Continue" variant="primary" size="lg" fullWidth disabled={!st}
          onClick={() => {
            setState((s) => ({ ...s, stateCode: st }));
            goto(6);
          }} />
        <Button label="Prefer not to say" variant="ghost" size="md" fullWidth
          onClick={() => goto(6)} />
      </div>
    </OnbCard>
  );
}

function OnbConsent({ goto, back }) {
  const [tos, setTos] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const canContinue = tos && privacy;
  return (
    <OnbCard width={640} back={back}>
      <div>
        <Text variant="display">Agreements.</Text>
        <Text variant="body" tone="muted" style={{ marginTop: 6 }}>
          Two required, one optional.
        </Text>
      </div>

      <Card variant="outline">
        <Checkbox checked={tos} onChange={setTos}
          label="I agree to the Terms of Service"
          description="The basics of how the platform works and what we expect." />
      </Card>
      <Card variant="outline">
        <Checkbox checked={privacy} onChange={setPrivacy}
          label="I agree to the Privacy Policy"
          description="We explain exactly what we store, for how long, and why." />
      </Card>
      <Card variant="outline">
        <Checkbox checked={analytics} onChange={setAnalytics}
          label="Help us improve (optional)"
          description="Anonymous usage analytics. Never linked to your handle. Turn off anytime." />
      </Card>

      <Button label="Create my account" variant="primary" size="lg" fullWidth
        disabled={!canContinue}
        onClick={() => goto(7)} />
    </OnbCard>
  );
}

function OnbConfirm({ state, finish }) {
  return (
    <OnbCard width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40,
          background: T.successSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.success, fontSize: 36, fontWeight: 800,
        }}>✓</div>
        <Text variant="display" align="center">Welcome.</Text>
        <Text variant="body" tone="muted" align="center">You're signed in as</Text>
        <Badge tone="accent" label={state.handle || 'Anonymous-User'} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        <Text variant="heading" align="center">What would help right now?</Text>
        <Button label="Open my dashboard" variant="primary" size="lg" fullWidth
          onClick={() => finish('dashboard')} />
        <Button label="Chat with a volunteer now" variant="secondary" size="lg" fullWidth
          onClick={() => finish('chat')} />
        <Button label="Browse resources first" variant="ghost" size="md" fullWidth
          onClick={() => finish('resources')} />
      </div>
    </OnbCard>
  );
}

function DesktopOnboarding({ onComplete, brand = 'StandStrong', tagline = 'Peer support, anonymous' }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    triageMode: 'laid_off',
    triageStatus: 'laid_off',
    triageFlags: [],
    handle: '',
    persona: 'maya',
    stateCode: '',
  });

  const goto = (n) => setStep(n);
  const back = () => setStep((s) => Math.max(1, s - 1));
  const finish = (landingScreen) => {
    onComplete({ handle: data.handle, persona: data.persona, screen: landingScreen });
  };
  const stepProps = { goto, back, state: data, setState: setData, finish, brand };

  let body = null;
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  else if (step === 3) body = <OnbCreateHandle {...stepProps} />;
  else if (step === 4) body = <OnbSafety {...stepProps} />;
  else if (step === 5) body = <OnbLocation {...stepProps} />;
  else if (step === 6) body = <OnbConsent {...stepProps} />;
  else if (step === 7) body = <OnbConfirm {...stepProps} />;

  return <OnbShell step={step} brand={brand} tagline={tagline}>{body}</OnbShell>;
}

Object.assign(window, { DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup, OnbWelcome, OnbTriage, OnbCreateHandle, OnbSafety, OnbLocation, OnbConsent, OnbConfirm });
