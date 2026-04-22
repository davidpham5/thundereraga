// Desktop onboarding screens. Each takes { goto, back, state, setState }.
// Uses OnboardingShell for the thin top bar + centered 560px column.

const D_HANDLES = [
  'Portland-Eng-42', 'Denver-Hiker-07', 'Austin-Reader-91',
  'Boston-Tea-18', 'Seattle-Cloud-23', 'NYC-Commuter-55',
];
const dRandomHandle = () => D_HANDLES[Math.floor(Math.random() * D_HANDLES.length)];

/* ───────── S01 Welcome (desktop) ───────── */
// Split layout: copy/CTAs left, editorial pullquote right.
// On narrow desktop it stacks via flex-wrap.
function DWelcome({ goto }) {
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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Wordmark />
          <button onClick={() => goto('triage', { mode: 'returning' })} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: T.accent, fontWeight: 600, fontSize: 13,
            fontFamily: 'Inter', padding: '8px 10px',
          }}>I have an account →</button>
        </div>
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', paddingBlock: 64 }}>
        <div style={{
          maxWidth: 'var(--content-wide)', margin: '0 auto',
          paddingInline: 32, width: '100%',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 64, alignItems: 'center',
        }}>
          <div className="rise rise-1">
            <Text variant="label" tone="accent" style={{ marginBottom: 12 }}>
              PEER-LED SUPPORT FOR LAID-OFF WORKERS
            </Text>
            <DisplayHeadline style={{ fontSize: 48, letterSpacing: -1.2 }}>
              You're not alone<br/>in this.
            </DisplayHeadline>
            <Text variant="body" tone="muted" style={{ marginTop: 16, fontSize: 16, lineHeight: '24px', maxWidth: 420 }}>
              A quiet place to think, get real information, and talk to someone
              who's been through it. Anonymous by default. Free forever.
            </Text>

            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
              <Button label="I just got laid off" variant="primary" size="lg" fullWidth
                onClick={() => goto('triage', { mode: 'laid_off' })} />
              <Button label="I'm preparing, just in case" variant="secondary" size="md" fullWidth
                onClick={() => goto('triage', { mode: 'preparing' })} />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
              <Badge tone="success" label="Free forever" dot />
              <Badge tone="neutral" label="Anonymous" />
              <Badge tone="accent" label="Peer-led" />
            </div>
          </div>

          <div className="rise rise-3" style={{
            background: 'var(--paper)', borderRadius: 20, padding: '48px 40px',
            border: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              borderRadius: '50%', background: T.accentSoft, opacity: 0.6,
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 48, lineHeight: 1, color: T.accent, marginBottom: 12 }}>"</div>
              <div className="editorial" style={{
                fontSize: 22, lineHeight: 1.4, color: 'var(--ink-soft)',
              }}>
                The day after I was laid off, I didn't know where to start.
                Talking to someone who'd been through it — someone who wasn't
                trying to sell me anything — was the thing that kept me moving.
              </div>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar size="sm" tint="#6B4EA8" initials="JR" name="JR" />
                <div>
                  <Text variant="bodySm" weight={700}>Jordan R.</Text>
                  <Text variant="caption" tone="muted">Used StandStrong · Now volunteers</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{
        borderTop: `1px solid ${T.border}`, background: T.bg,
        paddingBlock: 24, marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: 'var(--content-wide)', margin: '0 auto', paddingInline: 32,
        }}>
          <Text variant="caption" tone="subtle" align="center">
            We never share your identity with your employer.
            Your information is encrypted and yours alone.
          </Text>
        </div>
      </div>
    </>
  );
}

/* ───────── S02 Triage ───────── */
function DTriage({ goto, back, state, setState }) {
  const initial = state.triageMode === 'preparing' ? 'imminent'
                : state.triageMode === 'returning' ? 'returning' : 'laid_off';
  const [status, setStatus] = React.useState(state.triageStatus || initial);
  const [flags, setFlags] = React.useState(state.triageFlags || []);
  const toggle = (f) => setFlags(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);

  const route = () => {
    if (flags.includes('visa_concern')) return 'priya';
    if (flags.includes('discrimination')) return 'james';
    if (flags.includes('severance_deadline')) return 'maya';
    if (status === 'laid_off' && (flags.includes('benefits_ending') || flags.includes('struggling'))) return 'david';
    if (status === 'imminent' || status === 'not_affected') return 'kiesha';
    return 'maya';
  };

  return (
    <OnboardingShell step={1} total={6} onBack={back}>
      <DisplayHeadline>A couple of questions.</DisplayHeadline>
      <Text variant="body" tone="muted" style={{ marginTop: 10, fontSize: 16 }}>
        We'll personalize what you see. Your answers are private and can be changed anytime.
      </Text>

      <div style={{ marginTop: 32 }}>
        <RadioGroup
          label="What's your situation?"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'laid_off',     label: 'I was laid off' },
            { value: 'imminent',     label: 'I think I might be laid off soon' },
            { value: 'not_affected', label: "I'm not affected yet, but preparing" },
            { value: 'returning',    label: "I've used this before" },
          ]}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <Text variant="label" tone="subtle" style={{ marginBottom: 12 }}>
          ANYTHING URGENT? (OPTIONAL)
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Checkbox checked={flags.includes('severance_deadline')} onChange={() => toggle('severance_deadline')} label="I have a severance deadline" />
          <Checkbox checked={flags.includes('visa_concern')}       onChange={() => toggle('visa_concern')}       label="I'm on a work visa (H-1B, etc.)" />
          <Checkbox checked={flags.includes('benefits_ending')}    onChange={() => toggle('benefits_ending')}    label="My benefits are ending soon" />
          <Checkbox checked={flags.includes('discrimination')}     onChange={() => toggle('discrimination')}     label="I think this may be discrimination" />
          <Checkbox checked={flags.includes('struggling')}         onChange={() => toggle('struggling')}         label="I'm struggling — I need to talk to someone" />
        </div>
      </div>

      {flags.includes('struggling') && (
        <div style={{ marginTop: 24 }}>
          <Alert tone="info" title="We're here for you."
            message="After you sign up you can chat with a peer volunteer right away — no waiting." />
        </div>
      )}

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button label="Continue" variant="primary" size="lg" fullWidth
          onClick={() => {
            setState(s => ({ ...s, persona: route(), triageStatus: status, triageFlags: flags }));
            goto('create-handle');
          }} />
        <Button label="Skip for now" variant="ghost" size="md" fullWidth
          onClick={() => { setState(s => ({ ...s, persona: 'maya' })); goto('create-handle'); }} />
      </div>
    </OnboardingShell>
  );
}

/* ───────── S03 Create Handle ───────── */
function DCreateHandle({ goto, back, state, setState }) {
  const [handle, setHandle] = React.useState(state.handle || dRandomHandle());
  return (
    <OnboardingShell step={2} total={6} onBack={back}>
      <DisplayHeadline>Pick a name to go by.</DisplayHeadline>
      <Text variant="body" tone="muted" style={{ marginTop: 10, fontSize: 16 }}>
        This is what other members and counselors will see. Your real name is never required.
      </Text>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TextField label="HANDLE" value={handle} onChange={setHandle}
          helperText="Letters, numbers, and dashes. Change anytime in Settings." />
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge tone="neutral" label="Randomly generated" />
          <Badge tone="success" label="Available" dot />
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <Alert tone="info" title="Why anonymous?"
          message="We never link your handle to your real identity or employer. Even our own staff can't see who you are unless you choose to verify." />
      </div>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button label="Continue" variant="primary" size="lg" fullWidth
          onClick={() => { setState(s => ({ ...s, handle })); goto('safety'); }} />
        <Button label="Generate another" variant="secondary" size="md" fullWidth
          onClick={() => setHandle(dRandomHandle())} />
      </div>
    </OnboardingShell>
  );
}

/* ───────── S04 Safety ───────── */
// Desktop variant: 2-column pledge grid so it breathes at wider viewports.
function DSafety({ goto, back }) {
  const pledges = [
    { t: "We never share your identity with your employer.", s: "Not your name, not your handle, not your activity." },
    { t: "We never sell your data.",                          s: "We're a nonprofit. Donor-funded, not ad-funded." },
    { t: "Peer counselors are vetted volunteers.",            s: "Background-checked and trained, but not licensed attorneys." },
    { t: "You can delete everything anytime.",                s: "One tap in Settings. Full wipe, including message history." },
  ];
  return (
    <OnboardingShell step={3} total={6} onBack={back}>
      <DisplayHeadline>Before we continue.</DisplayHeadline>
      <Text variant="body" tone="muted" style={{ marginTop: 10, fontSize: 16 }}>
        Four things we promise, and one thing we ask.
      </Text>

      <div style={{
        marginTop: 32, display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12,
      }}>
        {pledges.map((p, i) => (
          <div key={i} style={{
            background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: 16, display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14, background: T.successSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.success, fontWeight: 800, flexShrink: 0,
            }}>✓</div>
            <div>
              <Text variant="body" weight={700}>{p.t}</Text>
              <Text variant="caption" tone="muted" style={{ marginTop: 4 }}>{p.s}</Text>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <Card variant="soft" accent="accent">
          <Text variant="label" tone="accent">WE ASK ONE THING</Text>
          <Text variant="body" style={{ marginTop: 6 }}>
            Treat other members with respect. This is a safe space for everyone.
          </Text>
        </Card>
      </div>

      <div style={{ marginTop: 36 }}>
        <Button label="I understand — continue" variant="primary" size="lg" fullWidth
          onClick={() => goto('location')} />
      </div>
    </OnboardingShell>
  );
}

/* ───────── S05 Location ───────── */
function DLocation({ goto, back, setState }) {
  const [st, setSt] = React.useState('');
  const stateOptions = [
    { value: 'CA', label: 'California' }, { value: 'OR', label: 'Oregon' },
    { value: 'WA', label: 'Washington' }, { value: 'TX', label: 'Texas' },
    { value: 'GA', label: 'Georgia' },    { value: 'NY', label: 'New York' },
    { value: 'FL', label: 'Florida' },    { value: 'IL', label: 'Illinois' },
    { value: 'MA', label: 'Massachusetts' }, { value: 'CO', label: 'Colorado' },
  ];
  return (
    <OnboardingShell step={4} total={6} onBack={back}>
      <DisplayHeadline>Where are you based?</DisplayHeadline>
      <Text variant="body" tone="muted" style={{ marginTop: 10, fontSize: 16 }}>
        Unemployment rules, worker-protection laws, and local counselors vary by state.
      </Text>
      <div style={{ marginTop: 32 }}>
        <Select label="STATE" value={st} onChange={setSt} placeholder="Choose your state" options={stateOptions} />
      </div>
      <div style={{ marginTop: 24 }}>
        <Alert tone="info" title="Only your state is used for routing." message="We don't store your city or precise location." />
      </div>
      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button label="Continue" variant="primary" size="lg" fullWidth disabled={!st}
          onClick={() => { setState(s => ({ ...s, stateCode: st })); goto('consent'); }} />
        <Button label="Prefer not to say" variant="ghost" size="md" fullWidth
          onClick={() => goto('consent')} />
      </div>
    </OnboardingShell>
  );
}

/* ───────── S06 Consent ───────── */
function DConsent({ goto, back }) {
  const [tos, setTos] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const canContinue = tos && privacy;
  return (
    <OnboardingShell step={5} total={6} onBack={back}>
      <DisplayHeadline>Agreements.</DisplayHeadline>
      <Text variant="body" tone="muted" style={{ marginTop: 10, fontSize: 16 }}>
        Two required, one optional.
      </Text>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card variant="outline">
          <Checkbox checked={tos} onChange={setTos} label="I agree to the Terms of Service"
            description="The basics of how the platform works and what we expect." />
        </Card>
        <Card variant="outline">
          <Checkbox checked={privacy} onChange={setPrivacy} label="I agree to the Privacy Policy"
            description="We explain exactly what we store, for how long, and why." />
        </Card>
        <Card variant="outline">
          <Checkbox checked={analytics} onChange={setAnalytics} label="Help us improve (optional)"
            description="Anonymous usage analytics. Never linked to your handle. Turn off anytime." />
        </Card>
      </div>
      <div style={{ marginTop: 36 }}>
        <Button label="Create my account" variant="primary" size="lg" fullWidth
          disabled={!canContinue} onClick={() => goto('confirm')} />
      </div>
    </OnboardingShell>
  );
}

/* ───────── S07 Confirm ───────── */
function DConfirm({ goto, state }) {
  return (
    <OnboardingShell step={6} total={6}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 48, background: T.successSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          color: T.success, fontSize: 44, fontWeight: 800,
        }}>✓</div>
        <DisplayHeadline style={{ fontSize: 40 }}>Welcome.</DisplayHeadline>
        <Text variant="body" tone="muted" style={{ marginTop: 10 }}>You're signed in as</Text>
        <div style={{ marginTop: 8, display: 'inline-flex' }}>
          <Badge tone="accent" label={state.handle || 'Anonymous-User'} />
        </div>
      </div>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
          What would help right now?
        </div>
        <Button label="Open my dashboard" variant="primary" size="lg" fullWidth
          onClick={() => goto('app:dashboard')} />
        <Button label="Chat with a volunteer now" variant="secondary" size="lg" fullWidth
          onClick={() => goto('app:chat')} />
        <Button label="Browse resources first" variant="ghost" size="md" fullWidth
          onClick={() => goto('app:resources')} />
      </div>
    </OnboardingShell>
  );
}

Object.assign(window, { DWelcome, DTriage, DCreateHandle, DSafety, DLocation, DConsent, DConfirm });
