// Onboarding screen set. Each export takes { goto, back, state, setState }
// so App.jsx can wire up the stack.

const HANDLES = [
  "Portland-Eng-42",
  "Denver-Hiker-07",
  "Austin-Reader-91",
  "Boston-Tea-18",
  "Seattle-Cloud-23",
  "NYC-Commuter-55",
];
const randomHandle = () => HANDLES[Math.floor(Math.random() * HANDLES.length)];

/* ───────────── S01 Welcome ───────────── */
function Welcome({ goto }) {
  return (
    <div
      style={{
        minHeight: "100%",
        padding: 24,
        background: T.sunken,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            background: T.accent,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 32,
            fontWeight: 700,
          }}>
          R
        </div>
        <Text variant='display' align='center'>
          StandStrong
        </Text>
        <Text
          variant='body'
          tone='muted'
          align='center'
          style={{ marginTop: 8 }}>
          You're not alone in this.
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 40,
        }}>
        <Badge tone='success' label='Free forever' />
        <Badge tone='neutral' label='Anonymous' />
        <Badge tone='accent' label='Peer-led' />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Button
          label='I just got laid off'
          variant='primary'
          size='lg'
          fullWidth
          onClick={() => goto("triage", { mode: "laid_off" })}
        />
        <Button
          label='I have an account'
          variant='secondary'
          size='lg'
          fullWidth
          onClick={() => goto("triage", { mode: "returning" })}
        />
        <Button
          label="I'm preparing, just in case"
          variant='ghost'
          size='md'
          fullWidth
          onClick={() => goto("triage", { mode: "preparing" })}
        />
      </div>

      <Text
        variant='caption'
        tone='subtle'
        align='center'
        style={{ marginTop: 40 }}>
        We never share your identity with your employer.
        <br />
        Your information is encrypted and yours alone.
      </Text>
    </div>
  );
}

/* ───────────── S02 Triage ───────────── */
function Triage({ goto, back, state, setState }) {
  const initial =
    state.triageMode === "preparing"
      ? "imminent"
      : state.triageMode === "returning"
        ? "returning"
        : "laid_off";
  const [status, setStatus] = React.useState(state.triageStatus || initial);
  const [flags, setFlags] = React.useState(state.triageFlags || []);

  const toggle = (f) =>
    setFlags((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  const route = () => {
    if (flags.includes("visa_concern")) return "priya";
    if (flags.includes("discrimination")) return "james";
    if (flags.includes("severance_deadline")) return "maya";
    if (
      status === "laid_off" &&
      (flags.includes("benefits_ending") || flags.includes("struggling"))
    )
      return "david";
    if (status === "imminent" || status === "not_affected") return "kiesha";
    return "maya";
  };

  return (
    <div style={{ minHeight: "100%", background: T.sunken }}>
      <TopBar
        title='A couple of questions'
        leading={<BackButton onClick={back} />}
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>
        <div>
          <Text variant='title'>We'll personalize what you see.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: 6 }}>
            Your answers are private and can be changed anytime.
          </Text>
        </div>

        <RadioGroup
          label="What's your situation?"
          value={status}
          onChange={setStatus}
          options={[
            { value: "laid_off", label: "I was laid off" },
            { value: "imminent", label: "I think I might be laid off soon" },
            {
              value: "not_affected",
              label: "I'm not affected yet, but preparing",
            },
            { value: "returning", label: "I've used this before" },
          ]}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Text variant='label' tone='subtle'>
            ANYTHING URGENT? (OPTIONAL)
          </Text>
          <Checkbox
            checked={flags.includes("severance_deadline")}
            onChange={() => toggle("severance_deadline")}
            label='I have a severance deadline'
          />
          <Checkbox
            checked={flags.includes("visa_concern")}
            onChange={() => toggle("visa_concern")}
            label="I'm on a work visa (H-1B, etc.)"
          />
          <Checkbox
            checked={flags.includes("benefits_ending")}
            onChange={() => toggle("benefits_ending")}
            label='My benefits are ending soon'
          />
          <Checkbox
            checked={flags.includes("discrimination")}
            onChange={() => toggle("discrimination")}
            label='I think this may be discrimination'
          />
          <Checkbox
            checked={flags.includes("struggling")}
            onChange={() => toggle("struggling")}
            label="I'm struggling — I need to talk to someone"
          />
        </div>

        {flags.includes("struggling") && (
          <Alert
            tone='info'
            title="We're here for you."
            message='After you sign up you can chat with a peer volunteer right away — no waiting.'
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button
            label='Continue'
            variant='primary'
            size='lg'
            fullWidth
            onClick={() => {
              setState((s) => ({
                ...s,
                persona: route(),
                triageStatus: status,
                triageFlags: flags,
              }));
              goto("create-handle");
            }}
          />
          <Button
            label='Skip for now'
            variant='ghost'
            size='md'
            fullWidth
            onClick={() => {
              setState((s) => ({ ...s, persona: "maya" }));
              goto("create-handle");
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────── S03 Create Handle ───────────── */
function CreateHandle({ goto, back, state, setState }) {
  const [handle, setHandle] = React.useState(state.handle || randomHandle());
  return (
    <div style={{ minHeight: "100%", background: T.sunken }}>
      <TopBar
        title='Your anonymous handle'
        leading={<BackButton onClick={back} />}
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>
        <div>
          <Text variant='title'>Pick a name to go by.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: 6 }}>
            This is what other members and counselors will see. Your real name
            is never required.
          </Text>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextField
            label='HANDLE'
            value={handle}
            onChange={setHandle}
            helperText='Letters, numbers, and dashes. Change anytime in Settings.'
          />
          <div style={{ display: "flex", gap: 8 }}>
            <Badge tone='neutral' label='Randomly generated' />
            <Badge tone='success' label='Available' dot />
          </div>
        </div>

        <Alert
          tone='info'
          title='Why anonymous?'
          message="We never link your handle to your real identity or employer. Even our own staff can't see who you are unless you choose to verify."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button
            label='Continue'
            variant='primary'
            size='lg'
            fullWidth
            onClick={() => {
              setState((s) => ({ ...s, handle }));
              goto("safety");
            }}
          />
          <Button
            label='Generate another'
            variant='secondary'
            size='md'
            fullWidth
            onClick={() => setHandle(randomHandle())}
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────── S04 Safety ───────────── */
function Safety({ goto, back }) {
  const pledges = [
    {
      t: "We never share your identity with your employer.",
      s: "Not your name, not your handle, not your activity.",
    },
    {
      t: "We never sell your data.",
      s: "We're a nonprofit. Donor-funded, not ad-funded.",
    },
    {
      t: "Peer counselors are vetted volunteers.",
      s: "Background-checked and trained, but not licensed attorneys.",
    },
    {
      t: "You can delete everything anytime.",
      s: "One tap in Settings. Full wipe, including message history.",
    },
  ];
  return (
    <div style={{ minHeight: "100%", background: T.sunken }}>
      <TopBar
        title='Our pledge to you'
        leading={<BackButton onClick={back} />}
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
        <div>
          <Text variant='title'>Before we continue.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: 6 }}>
            Four things we promise, and one thing we ask.
          </Text>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pledges.map((p, i) => (
            <Card key={i} variant='outline'>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    background: T.successSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.success,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}>
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <Text variant='body' weight={600}>
                    {p.t}
                  </Text>
                  <Text variant='caption' tone='muted' style={{ marginTop: 2 }}>
                    {p.s}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card variant='soft' accent='accent'>
          <Text variant='label' tone='accent'>
            WE ASK ONE THING
          </Text>
          <Text variant='body' style={{ marginTop: 6 }}>
            Treat other members with respect. This is a safe space for everyone.
          </Text>
        </Card>
        <Button
          label='I understand — continue'
          variant='primary'
          size='lg'
          fullWidth
          onClick={() => goto("location")}
        />
      </div>
    </div>
  );
}

/* ───────────── S05 Location ───────────── */
function Location({ goto, back, setState }) {
  const [st, setSt] = React.useState("");
  const stateOptions = [
    { value: "CA", label: "California" },
    { value: "OR", label: "Oregon" },
    { value: "WA", label: "Washington" },
    { value: "TX", label: "Texas" },
    { value: "GA", label: "Georgia" },
    { value: "NY", label: "New York" },
    { value: "FL", label: "Florida" },
    { value: "IL", label: "Illinois" },
    { value: "MA", label: "Massachusetts" },
    { value: "CO", label: "Colorado" },
  ];
  return (
    <div style={{ minHeight: "100%", background: T.sunken }}>
      <TopBar
        title='Where are you based?'
        leading={<BackButton onClick={back} />}
      />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}>
        <div>
          <Text variant='title'>We'll show state-specific resources.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: 6 }}>
            Unemployment rules, worker-protection laws, and local counselors
            vary by state.
          </Text>
        </div>
        <Select
          label='STATE'
          value={st}
          onChange={setSt}
          placeholder='Choose your state'
          options={stateOptions}
        />
        <Alert
          tone='info'
          title='Only your state is used for routing.'
          message="We don't store your city or precise location."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button
            label='Continue'
            variant='primary'
            size='lg'
            fullWidth
            disabled={!st}
            onClick={() => {
              setState((s) => ({ ...s, stateCode: st }));
              goto("consent");
            }}
          />
          <Button
            label='Prefer not to say'
            variant='ghost'
            size='md'
            fullWidth
            onClick={() => goto("consent")}
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────── S06 Consent ───────────── */
function Consent({ goto, back }) {
  const [tos, setTos] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const canContinue = tos && privacy;
  return (
    <div style={{ minHeight: "100%", background: T.sunken }}>
      <TopBar title='Almost there' leading={<BackButton onClick={back} />} />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
        <div>
          <Text variant='title'>Agreements.</Text>
          <Text variant='body' tone='muted' style={{ marginTop: 6 }}>
            Two required, one optional.
          </Text>
        </div>
        <Card variant='outline'>
          <Checkbox
            checked={tos}
            onChange={setTos}
            label='I agree to the Terms of Service'
            description='The basics of how the platform works and what we expect.'
          />
        </Card>
        <Card variant='outline'>
          <Checkbox
            checked={privacy}
            onChange={setPrivacy}
            label='I agree to the Privacy Policy'
            description='We explain exactly what we store, for how long, and why.'
          />
        </Card>
        <Card variant='outline'>
          <Checkbox
            checked={analytics}
            onChange={setAnalytics}
            label='Help us improve (optional)'
            description='Anonymous usage analytics. Never linked to your handle. Turn off anytime.'
          />
        </Card>
        <Button
          label='Create my account'
          variant='primary'
          size='lg'
          fullWidth
          disabled={!canContinue}
          onClick={() => goto("confirm")}
        />
      </div>
    </div>
  );
}

/* ───────────── S07 Confirm ───────────── */
function Confirm({ goto, state }) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: T.sunken,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: T.successSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.success,
            fontSize: 36,
          }}>
          ✓
        </div>
        <Text variant='display'>Welcome.</Text>
        <Text variant='body' tone='muted'>
          You're signed in as
        </Text>
        <Badge tone='accent' label={state.handle || "Anonymous-User"} />
      </div>
      <div
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
        <Text variant='heading' align='center'>
          What would help right now?
        </Text>
        <Button
          label='Open my dashboard'
          variant='primary'
          size='lg'
          fullWidth
          onClick={() => goto("app:dashboard")}
        />
        <Button
          label='Chat with a volunteer now'
          variant='secondary'
          size='lg'
          fullWidth
          onClick={() => goto("app:chat")}
        />
        <Button
          label='Browse resources first'
          variant='ghost'
          size='md'
          fullWidth
          onClick={() => goto("app:resources")}
        />
      </div>
    </div>
  );
}

Object.assign(window, {
  Welcome,
  Triage,
  CreateHandle,
  Safety,
  Location,
  Consent,
  Confirm,
});
