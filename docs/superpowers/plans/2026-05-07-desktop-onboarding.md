# Desktop Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 7-step intake flow to the desktop prototype that auto-gates `desktop.html` until a handle is created, mirroring the mobile flow.

**Architecture:** All onboarding lives in a new `prototype/desktop-onboarding.jsx` (orchestrator + step components + local helpers). `desktop-app.jsx` chooses between rendering `<DesktopOnboarding>` or the existing app shell based on `localStorage`, the `#onboarding` hash, and the `?reset` query. Step content, copy, and persona-routing logic are lifted verbatim from mobile's `screens-onboarding.jsx`. Layout: muted full-viewport canvas, 7-segment stepper, centered white card (520px or 640px wide), top-left brand lockup. No new primitives.

**Tech Stack:** React 18 + Babel-standalone in the browser. Existing primitives in `prototype/primitives.jsx` (Text, Button, Badge, Card, Avatar, Alert, RadioGroup, Checkbox, TextField, Select). Tokens via CSS variables on `:root`. No build step. No test framework — verification is manual browser checks via `npm run web`.

**Spec:** `docs/superpowers/specs/2026-05-07-desktop-onboarding-design.md`

**Verification convention:** Each task ends with a manual browser check — open `http://localhost:4244/desktop.html` (start once with `npm run web`) and follow the listed steps. If the prior task left the prototype in an "onboarded" state, append `?reset` to clear localStorage before testing.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `prototype/desktop-onboarding.jsx` | CREATE | Orchestrator (`DesktopOnboarding`), helpers (`OnbShell`, `Stepper`, `OnbCard`, `BrandLockup`), 7 step components |
| `prototype/desktop.html` | MODIFY | Add `<script>` tag for `desktop-onboarding.jsx` |
| `prototype/desktop-app.jsx` | MODIFY | Auto-gate: read `?reset`/`#onboarding`, branch between onboarding and app shell, hide Tweaks panel during onboarding |
| `prototype/desktop-screens.jsx` | MODIFY | Add "Reset onboarding" link inside `DesktopProfile`'s ACCOUNT group |

All step components and helpers are exported via `Object.assign(window, {...})` at the bottom of `desktop-onboarding.jsx` to match the existing pattern.

---

## Task 1: Create stub onboarding file and wire it into desktop.html

**Files:**
- Create: `prototype/desktop-onboarding.jsx`
- Modify: `prototype/desktop.html`

- [ ] **Step 1: Create the stub file**

Create `prototype/desktop-onboarding.jsx` with this exact content:

```jsx
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
```

- [ ] **Step 2: Add the script tag to desktop.html**

In `prototype/desktop.html`, add a new `<script>` tag for the onboarding file. It must load AFTER `desktop-screens.jsx` and BEFORE `desktop-app.jsx`. Replace this block:

```html
    <script type="text/babel" src="desktop-screens.jsx"></script>
    <script type="text/babel" src="desktop-app.jsx"></script>
```

with:

```html
    <script type="text/babel" src="desktop-screens.jsx"></script>
    <script type="text/babel" src="desktop-onboarding.jsx"></script>
    <script type="text/babel" src="desktop-app.jsx"></script>
```

- [ ] **Step 3: Verify the file loads without breaking the existing app**

Start the dev server (in a background shell) and load the page:

```bash
npm run web
```

Open `http://localhost:4244/desktop.html` in a browser. Expected: existing dashboard renders normally, no console errors. The onboarding stub is not visible yet (nothing renders it).

Open the DevTools console and run:

```js
typeof window.DesktopOnboarding
```

Expected: `"function"`.

- [ ] **Step 4: Commit**

```bash
git add prototype/desktop-onboarding.jsx prototype/desktop.html
git commit -m "scaffold desktop onboarding file"
```

---

## Task 2: Build the canvas, brand lockup, stepper, and card helpers

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the BrandLockup, Stepper, OnbCard, and OnbShell helpers**

Replace the entire current contents of `prototype/desktop-onboarding.jsx` with:

```jsx
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
```

- [ ] **Step 2: Temporarily mount onboarding to inspect the shell**

In `prototype/desktop-app.jsx`, change the `return` statement of `DesktopApp` to render `<DesktopOnboarding />` directly. Find this line:

```jsx
  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
```

and replace with (adding a leading `return <DesktopOnboarding />;` before the existing return):

```jsx
  return <DesktopOnboarding onComplete={() => {}} />;

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
```

The unreachable second `return` is intentional — it's a temporary preview hack we will undo in Task 3.

- [ ] **Step 3: Verify the shell renders**

With `npm run web` running, reload `http://localhost:4244/desktop.html`. Expected:
- Muted background covers the viewport.
- Top-left: "S" logo lockup with brand name and tagline.
- Centered: 7-segment stepper, first segment is wider and accent-colored, the other 6 are gray.
- Below the stepper: a 520px white card with "Shell preview" inside.
- No console errors.

- [ ] **Step 4: Revert the temporary mount**

In `prototype/desktop-app.jsx`, remove the temporary `return <DesktopOnboarding ... />;` line so the function falls through to the existing app shell return. The file should be back to its original state from Task 1 (script tag still present).

- [ ] **Step 5: Verify the existing app still works**

Reload. Expected: dashboard renders as before, no console errors.

- [ ] **Step 6: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "add onboarding shell, stepper, and card helpers"
```

---

## Task 3: Wire the auto-gate in desktop-app.jsx

**Files:**
- Modify: `prototype/desktop-app.jsx`

This task makes onboarding render whenever there's no saved handle, when `#onboarding` is in the URL, or after `?reset`. The existing app shell renders otherwise.

- [ ] **Step 1: Add the gating logic at the top of DesktopApp**

In `prototype/desktop-app.jsx`, the current `DesktopApp` function starts like this:

```jsx
function DesktopApp() {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('standstrong:desktop:state') || '{}'); }
    catch { return {}; }
  })();

  const [persona, setPersona] = useStateD(saved.persona || 'maya');
  const [handle] = useStateD(saved.handle || '');
  const [screen, setScreen] = useStateD(saved.screen || 'dashboard');
```

Replace that block (everything from `function DesktopApp()` through the `setScreen` line) with:

```jsx
function DesktopApp() {
  // ?reset: wipe persisted state and strip the query before React reads it.
  if (typeof window !== 'undefined' && window.location.search.includes('reset')) {
    try { localStorage.removeItem('standstrong:desktop:state'); } catch {}
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  }

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('standstrong:desktop:state') || '{}'); }
    catch { return {}; }
  })();

  const forceOnboarding = typeof window !== 'undefined' && window.location.hash === '#onboarding';
  const [onboarded, setOnboarded] = useStateD(!forceOnboarding && !!saved.handle);

  const [persona, setPersona] = useStateD(saved.persona || 'maya');
  const [handle, setHandle] = useStateD(saved.handle || '');
  const [screen, setScreen] = useStateD(saved.screen || 'dashboard');
```

Note: `handle` is now stateful (was destructured without a setter before) so the onboarding completion handler can write it.

- [ ] **Step 2: Add the completion handler and the early-return for onboarding**

Immediately after the `useEffectD` that writes `localStorage` (the one with `[persona, handle, screen]` deps), add the onboarding branch. Find this code:

```jsx
  useEffectD(() => {
    localStorage.setItem('standstrong:desktop:state', JSON.stringify({ persona, handle, screen }));
  }, [persona, handle, screen]);

  // Apply accent + density to the CSS variables on :root.
  useEffectD(() => {
```

and insert a new block between the two `useEffectD`s, plus the early return:

```jsx
  useEffectD(() => {
    localStorage.setItem('standstrong:desktop:state', JSON.stringify({ persona, handle, screen }));
  }, [persona, handle, screen]);

  const completeOnboarding = ({ handle: h, persona: p, screen: s }) => {
    setHandle(h);
    setPersona(p);
    setScreen(s || 'dashboard');
    setOnboarded(true);
    if (window.location.hash === '#onboarding') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Apply accent + density to the CSS variables on :root.
  useEffectD(() => {
```

Then, just before the existing `const state = ...` line near the bottom of the function (still above the `switch (screen)` block), add the early return:

Find:
```jsx
  const state = { persona, handle, stateCode: '', brand: t.brand };

  let body = null;
  switch (screen) {
```

Replace with:
```jsx
  if (!onboarded) {
    return <DesktopOnboarding onComplete={completeOnboarding} brand={t.brand} tagline={t.tagline} />;
  }

  const state = { persona, handle, stateCode: '', brand: t.brand };

  let body = null;
  switch (screen) {
```

- [ ] **Step 3: Verify the auto-gate**

Reload `http://localhost:4244/desktop.html?reset`. Expected:
- `?reset` clears state and the URL bar shows `desktop.html` (no query).
- The onboarding shell renders (centered stepper, "Shell preview" card) — NOT the dashboard.
- Console has no errors.

Now reload `http://localhost:4244/desktop.html` (no query). Expected: still the onboarding shell, because `localStorage` was wiped and there's no handle yet.

In DevTools console, run:
```js
localStorage.setItem('standstrong:desktop:state', JSON.stringify({ persona: 'maya', handle: 'Test-User-01', screen: 'dashboard' }));
location.reload();
```
Expected: dashboard renders (onboarding skipped).

Now visit `http://localhost:4244/desktop.html#onboarding`. Expected: onboarding shell renders even though a handle exists.

- [ ] **Step 4: Commit**

```bash
git add prototype/desktop-app.jsx
git commit -m "auto-gate desktop onboarding on handle/hash/reset"
```

---

## Task 4: Implement OnbWelcome step

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the HANDLES list and randomHandle helper near the top of the file**

In `prototype/desktop-onboarding.jsx`, just below the `const ONB_TOTAL_STEPS = 7;` line, add:

```jsx
const ONB_HANDLES = [
  'Portland-Eng-42',
  'Denver-Hiker-07',
  'Austin-Reader-91',
  'Boston-Tea-18',
  'Seattle-Cloud-23',
  'NYC-Commuter-55',
];
const randomOnbHandle = () => ONB_HANDLES[Math.floor(Math.random() * ONB_HANDLES.length)];
```

- [ ] **Step 2: Add the OnbWelcome step component**

Add this function above the `DesktopOnboarding` definition in `prototype/desktop-onboarding.jsx`:

```jsx
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
```

- [ ] **Step 3: Update OnbShell to accept brand/tagline props**

In `prototype/desktop-onboarding.jsx`, find the existing `OnbShell` function:

```jsx
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
```

Replace with:

```jsx
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
```

(Only the signature line and the `<BrandLockup />` call change; the rest of the function body stays the same.)

- [ ] **Step 4: Replace the placeholder DesktopOnboarding with the real orchestrator**

Find:

```jsx
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
```

Replace with:

```jsx
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
  // remaining steps wired up in later tasks

  return <OnbShell step={step} brand={brand} tagline={tagline}>{body}</OnbShell>;
}
```

- [ ] **Step 5: Update the window export to include OnbWelcome**

At the bottom of the file, replace:

```jsx
Object.assign(window, { DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup });
```

with:

```jsx
Object.assign(window, { DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup, OnbWelcome });
```

- [ ] **Step 6: Verify Welcome renders and CTAs advance**

Reload `http://localhost:4244/desktop.html?reset`. Expected:
- Welcome card renders centered: brand circle, "StandStrong" title, tagline, three badges, three buttons, footer caption.
- Stepper: segment 1 highlighted.
- Click "I just got laid off": stepper advances to segment 2; main area is empty (Triage not wired yet) but no console errors.

Click the back button in the browser, then `?reset` to return to step 1.

- [ ] **Step 7: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement Welcome step and onboarding orchestrator"
```

---

## Task 5: Implement OnbTriage step with persona routing

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the OnbTriage component**

In `prototype/desktop-onboarding.jsx`, insert this function above `DesktopOnboarding` (after `OnbWelcome`):

```jsx
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
```

- [ ] **Step 2: Wire OnbTriage into the orchestrator**

In `DesktopOnboarding`, find:

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  // remaining steps wired up in later tasks
```

Replace with:

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  // remaining steps wired up in later tasks
```

- [ ] **Step 3: Update the window export**

At the bottom, change the existing `Object.assign(window, { ... })` to include `OnbTriage`:

```jsx
Object.assign(window, { DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup, OnbWelcome, OnbTriage });
```

- [ ] **Step 4: Verify Triage renders, validates, and routes**

Reload `?reset`. Click "I just got laid off" on Welcome. Expected: Triage card (640px wide) renders with title, radio group (4 options, "I was laid off" preselected), 5 checkboxes, two buttons. Stepper at segment 2.

Check the "I'm struggling" box. Expected: an info Alert appears below the checkboxes.

Uncheck struggling. Check "I'm on a work visa (H-1B, etc.)". Click Continue. Expected: stepper advances to segment 3, main area empty (CreateHandle not wired). In DevTools console:

```js
// Verify persona was routed correctly: visa_concern → 'priya'
// We can't inspect React state from console, but the next steps will rely on it.
```

- [ ] **Step 5: Verify Back works**

Use the browser back button → `?reset` to start over → click "I have an account" → on Triage, click "← Back" inside the card. Expected: returns to Welcome (step 1).

- [ ] **Step 6: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement Triage step with persona routing"
```

---

## Task 6: Implement OnbCreateHandle step

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the OnbCreateHandle component**

Insert above `DesktopOnboarding`, after `OnbTriage`:

```jsx
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
```

- [ ] **Step 2: Wire into the orchestrator**

In `DesktopOnboarding`, update the if/else chain:

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  else if (step === 3) body = <OnbCreateHandle {...stepProps} />;
  // remaining steps wired up in later tasks
```

- [ ] **Step 3: Update the window export**

```jsx
Object.assign(window, {
  DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup,
  OnbWelcome, OnbTriage, OnbCreateHandle,
});
```

- [ ] **Step 4: Verify CreateHandle**

Reload `?reset`, advance through Welcome → Triage → Continue. Expected: CreateHandle card (520px) with the title, prefilled random handle (one of: Portland-Eng-42, Denver-Hiker-07, Austin-Reader-91, Boston-Tea-18, Seattle-Cloud-23, NYC-Commuter-55), helper text, two badges, info alert, two buttons.

Click "Generate another" a few times. Expected: the handle field cycles through other values from the list.

Edit the handle to "My-Test-Handle". Click Continue. Expected: stepper advances to 4, main area empty.

- [ ] **Step 5: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement CreateHandle step"
```

---

## Task 7: Implement OnbSafety step

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the OnbSafety component**

Insert above `DesktopOnboarding`, after `OnbCreateHandle`:

```jsx
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
```

- [ ] **Step 2: Wire into the orchestrator**

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  else if (step === 3) body = <OnbCreateHandle {...stepProps} />;
  else if (step === 4) body = <OnbSafety {...stepProps} />;
  // remaining steps wired up in later tasks
```

- [ ] **Step 3: Update the window export**

```jsx
Object.assign(window, {
  DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup,
  OnbWelcome, OnbTriage, OnbCreateHandle, OnbSafety,
});
```

- [ ] **Step 4: Verify Safety**

Reload `?reset`, advance through to step 4. Expected: Safety card (640px) renders with title, subtitle, four outline cards each with a green ✓ and pledge text, a soft accent card "WE ASK ONE THING", and a single primary button. Stepper at segment 4.

Click "I understand — continue". Expected: stepper advances to 5.

- [ ] **Step 5: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement Safety step"
```

---

## Task 8: Implement OnbLocation step

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the OnbLocation component**

Insert above `DesktopOnboarding`, after `OnbSafety`:

```jsx
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
```

- [ ] **Step 2: Wire into the orchestrator**

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  else if (step === 3) body = <OnbCreateHandle {...stepProps} />;
  else if (step === 4) body = <OnbSafety {...stepProps} />;
  else if (step === 5) body = <OnbLocation {...stepProps} />;
  // remaining steps wired up in later tasks
```

- [ ] **Step 3: Update the window export**

```jsx
Object.assign(window, {
  DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup,
  OnbWelcome, OnbTriage, OnbCreateHandle, OnbSafety, OnbLocation,
});
```

- [ ] **Step 4: Verify Location**

Reload `?reset`, advance to step 5. Expected: Location card (520px), select dropdown showing 10 states, info alert, two buttons. Continue button is disabled (no state selected yet).

Pick "Oregon". Expected: Continue button enables. Click Continue. Expected: stepper advances to 6.

Use back button → return to Location → click "Prefer not to say". Expected: stepper also advances to 6 without setting `stateCode`.

- [ ] **Step 5: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement Location step"
```

---

## Task 9: Implement OnbConsent step

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the OnbConsent component**

Insert above `DesktopOnboarding`, after `OnbLocation`:

```jsx
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
```

- [ ] **Step 2: Wire into the orchestrator**

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  else if (step === 3) body = <OnbCreateHandle {...stepProps} />;
  else if (step === 4) body = <OnbSafety {...stepProps} />;
  else if (step === 5) body = <OnbLocation {...stepProps} />;
  else if (step === 6) body = <OnbConsent {...stepProps} />;
  // Confirm wired in next task
```

- [ ] **Step 3: Update the window export**

```jsx
Object.assign(window, {
  DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup,
  OnbWelcome, OnbTriage, OnbCreateHandle, OnbSafety, OnbLocation, OnbConsent,
});
```

- [ ] **Step 4: Verify Consent**

Reload `?reset`, advance to step 6. Expected: Consent card (640px) with three outline cards each wrapping a checkbox. Analytics checkbox is checked by default; ToS and Privacy are unchecked. "Create my account" button is disabled.

Check ToS only → button stays disabled. Check Privacy → button enables. Uncheck Privacy → button disables. Re-check Privacy. Click Create my account. Expected: stepper advances to 7, main area empty (Confirm not wired yet).

- [ ] **Step 5: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement Consent step"
```

---

## Task 10: Implement OnbConfirm step and complete the orchestrator

**Files:**
- Modify: `prototype/desktop-onboarding.jsx`

- [ ] **Step 1: Add the OnbConfirm component**

Insert above `DesktopOnboarding`, after `OnbConsent`:

```jsx
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
```

- [ ] **Step 2: Wire OnbConfirm into the orchestrator**

```jsx
  if (step === 1) body = <OnbWelcome {...stepProps} />;
  else if (step === 2) body = <OnbTriage {...stepProps} />;
  else if (step === 3) body = <OnbCreateHandle {...stepProps} />;
  else if (step === 4) body = <OnbSafety {...stepProps} />;
  else if (step === 5) body = <OnbLocation {...stepProps} />;
  else if (step === 6) body = <OnbConsent {...stepProps} />;
  else if (step === 7) body = <OnbConfirm {...stepProps} />;
```

- [ ] **Step 3: Update the window export**

```jsx
Object.assign(window, {
  DesktopOnboarding, OnbShell, OnbCard, Stepper, BrandLockup,
  OnbWelcome, OnbTriage, OnbCreateHandle, OnbSafety, OnbLocation, OnbConsent, OnbConfirm,
});
```

- [ ] **Step 4: Verify end-to-end completion**

Reload `?reset`. Walk through all 7 steps:
1. Click "I just got laid off"
2. Pick "I was laid off", check "I'm on a work visa (H-1B, etc.)", click Continue
3. Edit handle to "E2E-Test-User", click Continue
4. Click "I understand — continue"
5. Pick "California", click Continue
6. Check ToS and Privacy, click "Create my account"
7. Confirm card shows: green checkmark, "Welcome.", "You're signed in as", handle badge "E2E-Test-User", three CTAs.

Click "Open my dashboard". Expected:
- Onboarding unmounts.
- Dashboard renders.
- Top-right persona pill shows "PRIYA" (because `visa_concern` was checked in Triage).
- Sidebar shows the handle/persona "you-card".

In DevTools console:
```js
JSON.parse(localStorage.getItem('standstrong:desktop:state'))
```
Expected: `{ persona: 'priya', handle: 'E2E-Test-User', screen: 'dashboard' }`.

Reload the page (no `?reset`). Expected: dashboard renders directly (no onboarding) — auto-gate sees the saved handle.

- [ ] **Step 5: Verify the alternate landing screens**

Reload `?reset`, walk through quickly with defaults, on Confirm click "Chat with a volunteer now". Expected: lands on Chat screen.

Reload `?reset`, walk through, on Confirm click "Browse resources first". Expected: lands on Resources screen.

- [ ] **Step 6: Commit**

```bash
git add prototype/desktop-onboarding.jsx
git commit -m "implement Confirm step and complete onboarding flow"
```

---

## Task 11: Add "Reset onboarding" link to Profile

**Files:**
- Modify: `prototype/desktop-screens.jsx`

- [ ] **Step 1: Add the reset list item to the ACCOUNT group in DesktopProfile**

In `prototype/desktop-screens.jsx`, find the `DesktopProfileGroup title="ACCOUNT"` block (around line 712):

```jsx
        <DesktopProfileGroup title="ACCOUNT">
          <ListItem title="Sign out" onClick={() => setScreen('welcome')} />
          <Divider />
          <ListItem title="Delete my account and data"
            subtitle="Permanent. Cannot be undone." onClick={() => {}} />
        </DesktopProfileGroup>
```

Replace with:

```jsx
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
```

- [ ] **Step 2: Verify the reset path**

Make sure you're onboarded (run through the flow once if not). Navigate to Profile in the sidebar. Expected: ACCOUNT group now shows three items: Sign out, Reset onboarding, Delete my account and data.

Click "Reset onboarding". Expected: page reloads, URL strips back to `desktop.html`, onboarding flow renders at step 1 with no saved handle.

- [ ] **Step 3: Commit**

```bash
git add prototype/desktop-screens.jsx
git commit -m "add Reset onboarding link to Profile"
```

---

## Task 12: Final end-to-end verification pass

**Files:** none (verification only)

- [ ] **Step 1: Verify all four onboarding entry conditions**

With the dev server running:

1. **Fresh user (no localStorage):** Open DevTools, run `localStorage.clear(); location.assign('/desktop.html');`. Expected: onboarding shell at step 1.
2. **Returning user (handle in localStorage):** Complete onboarding. Reload `desktop.html`. Expected: dashboard, no onboarding.
3. **`#onboarding` hash:** With a saved handle, visit `desktop.html#onboarding`. Expected: onboarding renders. Complete it. Expected: hash is stripped from URL after Confirm.
4. **`?reset` query:** With a saved handle, visit `desktop.html?reset`. Expected: localStorage cleared, URL strips query, onboarding renders.

- [ ] **Step 2: Verify all five persona-routing branches**

For each row, reset, complete the flow with the listed inputs, and verify the dashboard's persona pill matches:

| Triage status | Flags checked | Expected persona |
|---|---|---|
| I was laid off | (none) | maya (fallback) |
| I was laid off | "benefits ending" | david |
| I was laid off | "I'm struggling" | david |
| I think I might be laid off soon | (none) | kiesha |
| I'm not affected yet | (none) | kiesha |
| any | "severance deadline" | maya |
| any | "visa concern" | priya |
| any | "discrimination" | james |

- [ ] **Step 3: Verify Tweaks panel is hidden during onboarding**

Reset to onboarding. Expected: no "Tweaks" panel visible (it lives inside the existing app shell which is not rendered during onboarding). Complete onboarding. Expected: Tweaks panel reappears.

- [ ] **Step 4: Verify accent token is honored on onboarding**

While in dashboard, open Tweaks, change Accent to a different color (e.g., burnt orange `#B5471F`). Click "Reset onboarding" in Profile. Expected: onboarding stepper segments and Welcome brand circle use the new accent — confirms CSS variables persist across the gate.

- [ ] **Step 5: No commit needed for verification**

If issues are found, fix them in a follow-up commit. Otherwise this task is complete.

---

## Self-Review Notes

Spec coverage: every spec section maps to a task — gating (T3), shell+stepper+card (T2), 7 steps 1:1 with mobile (T4–T10), persona routing (T5), Profile reset (T11), reset/hash entry conditions (T3, T12).

Type consistency: `setState`, `goto`, `back`, `state`, `finish`, `brand` are the orchestrator-provided props throughout T4–T10. Step numbers are 1-indexed everywhere. `localStorage` key is `standstrong:desktop:state` everywhere. The orchestrator's `data` shape matches the spec's State shape section.

No placeholders: every code step contains complete code; every verification step lists exact expected output.
