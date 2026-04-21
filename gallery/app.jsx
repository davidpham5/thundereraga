/**
 * app.jsx — Tether component gallery sections.
 * Uses the components mounted on window by components.jsx.
 */

const { useState, useEffect } = React;

// ─── Mode toggle + CSS vars ───────────────────────────────────────────────

function syncChromeVars(mode) {
  const t = mode === 'dark' ? window.darkTheme : window.lightTheme;
  // Fallback: re-derive since darkTheme/lightTheme aren't exported.
  // Instead, compute from the known palette via a cheap mirror:
  const vars = mode === 'dark' ? {
    '--bg':     '#0E0D0B',
    '--surface':'#171512',
    '--sunken': '#0E0D0B',
    '--text':   '#FAF8F6',
    '--muted':  '#B3AAA0',
    '--subtle': '#8A8178',
    '--border': '#34302C',
    '--accent': '#DC7E54',
    '--accent-bg': 'rgba(220,126,84,0.18)',
  } : {
    '--bg':     '#FAF8F6',
    '--surface':'#FFFFFF',
    '--sunken': '#F4F1EE',
    '--text':   '#171512',
    '--muted':  '#6B645C',
    '--subtle': '#8A8178',
    '--border': '#E8E3DD',
    '--accent': '#C56641',
    '--accent-bg': '#FBF0EB',
  };
  const root = document.documentElement;
  Object.entries(vars).forEach(([k,v]) => root.style.setProperty(k, v));
  document.body.style.background = vars['--bg'];
  document.body.style.color = vars['--text'];
}

// ─── Example sections ─────────────────────────────────────────────────────

function ExampleCard({ title, tag, children, stack=false }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {tag && <span className="tag">{tag}</span>}
      </div>
      <div className={stack ? 'examples stack' : 'examples'}>{children}</div>
    </div>
  );
}

function SectionHeader({ id, title, sub }) {
  return (
    <div id={id} style={{ paddingTop: 16 }}>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────

function FoundationsSection() {
  const colorKeys = [
    'bg','surface','surfaceSunken','text','textMuted','textSubtle',
    'border','borderStrong','accent','accentSoft','support','supportSoft',
    'success','successSoft','warning','warningSoft','danger','dangerSoft',
  ];
  const { theme, mode } = useTheme();

  return (
    <>
      <SectionHeader id="foundations" title="Foundations"
        sub="Semantic color, warm-humanist type, and a 4-based spacing scale. These tokens drive every component; the RN source in src/tokens.ts is the source of truth." />

      <div className="subsection-title">Semantic color ({mode})</div>
      <div className="token-grid">
        {colorKeys.map(k => (
          <div key={k} className="swatch">
            <div className="chip" style={{ background: theme.color[k] }}/>
            <div className="meta">
              <span className="k">{k}</span>
              <span className="v">{theme.color[k]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="subsection-title">Type scale — Figtree</div>
      <div className="card">
        {Object.entries(typo.scale).map(([k, v]) => (
          <div className="type-row" key={k}>
            <span className="name">{k}</span>
            <span style={{
              fontFamily: typo.family, fontSize: v.size, lineHeight: v.lh+'px',
              fontWeight: v.w, letterSpacing: v.ls,
              color: theme.color.text,
              textTransform: k === 'eyebrow' ? 'uppercase' : undefined,
            }}>
              {k === 'eyebrow' ? 'Section label' : 'We\u2019ve got you through this'}
            </span>
            <span className="spec">{v.size}/{v.lh} · {v.w}</span>
          </div>
        ))}
      </div>

      <div className="subsection-title">Spacing & radii</div>
      <div className="tokens-meta-row">
        <div className="card">
          <Text variant="caption" weight={600} tone="muted">SPACE</Text>
          <div style={{ marginTop: 12 }}>
            {Object.entries(space).filter(([k]) => +k > 0 && +k <= 10).map(([k,v]) => (
              <div className="space-row" key={k}>
                <span className="label">[{k}]</span>
                <span className="bar" style={{ width: v }}/>
                <span className="val">{v}px</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <Text variant="caption" weight={600} tone="muted">RADIUS</Text>
          <div style={{ display:'flex', flexWrap:'wrap', gap: 16, marginTop: 16 }}>
            {Object.entries(radius).map(([k,v]) => (
              <div key={k} style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
                <div style={{
                  width:56, height:56, background: theme.color.accentSoft,
                  border:`1.5px solid ${theme.color.accent}`, borderRadius: v,
                }}/>
                <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, color: theme.color.textSubtle }}>
                  {k} · {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PrimitivesSection() {
  return (
    <>
      <SectionHeader id="primitives" title="Primitives"
        sub="Text, Button, Card, Badge, Avatar, Divider. Each component accepts tokens semantically; you never pass raw hex." />

      <ExampleCard title="Text" tag="<Text variant tone weight>" stack>
        <Text variant="display">Display · we've got you</Text>
        <Text variant="title">Title · review your offer</Text>
        <Text variant="heading">Heading · peer counselors</Text>
        <Text variant="subtitle">Subtitle · book a session</Text>
        <Text variant="body">Body · Confidential, peer-led support for tech workers facing mass layoffs.</Text>
        <Text variant="bodySm" tone="muted">Body sm muted · Your real name and email are never visible to others.</Text>
        <Text variant="caption" tone="subtle">Caption · 3 min read</Text>
        <Text variant="eyebrow" tone="subtle">Eyebrow · how it works</Text>
      </ExampleCard>

      <ExampleCard title="Button" tag="primary · secondary · ghost · danger">
        <Button label="Get Support Now" variant="primary"/>
        <Button label="I'm a Peer Volunteer" variant="secondary" trailing={<span>→</span>}/>
        <Button label="Skip" variant="ghost"/>
        <Button label="Delete Account" variant="danger"/>
      </ExampleCard>
      <ExampleCard title="Button — sizes & states" tag="sm · md · lg · loading · disabled">
        <Button label="Small" size="sm"/>
        <Button label="Medium" size="md"/>
        <Button label="Large" size="lg"/>
        <Button label="Loading" loading/>
        <Button label="Disabled" disabled/>
        <Button label="Full width" fullWidth/>
      </ExampleCard>

      <ExampleCard title="Card" tag="outline · surface · soft · accent rail" stack>
        <Card variant="outline">
          <Text variant="subtitle">TechCo Channel</Text>
          <Text variant="bodySm" tone="muted" style={{ marginTop:6 }}>234 members · open peer support channel</Text>
        </Card>
        <Card variant="soft">
          <Text variant="caption" weight={700} tone="accent">🔒 WHAT OTHERS NEVER SEE</Text>
          <Text variant="body" style={{ marginTop:6 }}>Your real name, email, employer, and location are always hidden.</Text>
        </Card>
        <Card variant="outline" accent="warning">
          <Text variant="subtitle">Severance deadline in 18 days</Text>
          <Text variant="bodySm" tone="muted" style={{ marginTop:4 }}>Review your offer with a peer counselor before you sign.</Text>
        </Card>
        <Card variant="outline" accent="success">
          <Text variant="subtitle">Application verified</Text>
          <Text variant="bodySm" tone="muted" style={{ marginTop:4 }}>You now have access to the TechCo channel.</Text>
        </Card>
      </ExampleCard>

      <ExampleCard title="Badge" tag="tone · dot">
        <Badge label="Available now" tone="success" dot/>
        <Badge label="Verified" tone="support"/>
        <Badge label="Urgent" tone="danger" dot/>
        <Badge label="WARN Act" tone="warning"/>
        <Badge label="Peer counselor" tone="accent"/>
        <Badge label="Draft"/>
      </ExampleCard>

      <ExampleCard title="Avatar" tag="xs · sm · md · lg · xl · ring">
        <Avatar size="xs" name="Portland Engineer 42"/>
        <Avatar size="sm" name="Austin Designer 7"/>
        <Avatar size="md" name="Madison Researcher 14"/>
        <Avatar size="lg" name="Oakland Operator 31" ring="support"/>
        <Avatar size="xl" name="Denver Manager 88" ring="accent"/>
      </ExampleCard>

      <ExampleCard title="Divider" stack>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <Text variant="body">Chat Hotline</Text>
          <Divider style={{ margin:'12px 0' }}/>
          <Text variant="body">Book Counselor</Text>
          <Divider strength="strong" style={{ margin:'12px 0' }}/>
          <Text variant="body">State Resource Guide</Text>
        </div>
      </ExampleCard>
    </>
  );
}

function FormsSection() {
  const [handle, setHandle] = useState('Portland-Engineer-42');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('ca');
  const [employment, setEmployment] = useState('recent');
  const [urgent, setUrgent] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [pronouns, setPronouns] = useState('');

  return (
    <>
      <SectionHeader id="forms" title="Forms"
        sub="Inputs tuned for the triage, profile, and settings flows. All labels meet WCAG AA contrast in both modes." />

      <ExampleCard title="TextField" tag="<TextField label helperText errorText>" stack>
        <TextField label="DISPLAY NAME" value={handle} onChange={setHandle}
          helperText="Avoid your real name or any identifying details." required/>
        <TextField label="EMAIL (for notifications)" value={email} onChange={setEmail}
          type="email" placeholder="you@example.com" optional
          helperText="We'll never share this with other members."/>
        <TextField label="PRONOUNS" value={pronouns} onChange={setPronouns}
          placeholder="e.g. they/them" optional/>
        <TextField label="VERIFICATION CODE" value="12" onChange={()=>{}}
          errorText="Code doesn't match. Double-check your work email."/>
      </ExampleCard>

      <ExampleCard title="Select" tag="native sheet on RN; <select> on web" stack>
        <Select label="YOUR STATE" value={state} onChange={setState} options={[
          { value:'ca', label:'California' },
          { value:'ny', label:'New York' },
          { value:'wa', label:'Washington' },
          { value:'tx', label:'Texas' },
        ]}/>
      </ExampleCard>

      <ExampleCard title="RadioGroup — card variant" tag="triage" stack>
        <RadioGroup label="EMPLOYMENT STATUS" value={employment} onChange={setEmployment} options={[
          { value:'recent', label:'Laid off recently',
            description:'Within the last 90 days.' },
          { value:'imminent', label:'Imminent layoff announced',
            description:'Notice received but not yet final.' },
          { value:'rumor',  label:'Rumored or bracing for one',
            description:'Not confirmed but signals point to it.' },
          { value:'survivor', label:'Survivor of a recent layoff',
            description:'Still employed; colleagues affected.' },
        ]}/>
      </ExampleCard>

      <ExampleCard title="Checkbox" tag="inline & card" stack>
        <Checkbox checked={urgent} onChange={setUrgent}
          label="I have an urgent severance deadline"
          description="We'll prioritize matching you with a counselor today."
          variant="card"/>
        <Checkbox checked={true} onChange={()=>{}} label="I'm a U.S.-based worker"/>
        <Checkbox checked={false} onChange={()=>{}} label="Keep me anonymous to other members"/>
      </ExampleCard>

      <ExampleCard title="Toggle" tag="settings-style rows" stack>
        <Toggle value={notifications} onChange={setNotifications}
          label="Session reminders"
          description="Push notification 30 min before each booked session."/>
        <Toggle value={false} onChange={()=>{}}
          label="Show my company in my profile"
          description="Off by default. Visible only to verified channel members."/>
        <Toggle value={true} onChange={()=>{}} label="Weekly resource digest"/>
      </ExampleCard>
    </>
  );
}

function NavigationSection() {
  const { theme } = useTheme();
  const [tab, setTab] = useState('home');
  return (
    <>
      <SectionHeader id="navigation" title="Navigation"
        sub="TopBar, BackButton, SectionHeader, BottomTabs. Sized to match iOS/Android hit targets (44pt min)." />

      <ExampleCard title="TopBar" tag="<TopBar title leading trailing>" stack>
        <div style={{ border:`1px solid ${theme.color.border}`, borderRadius: 12, overflow:'hidden' }}>
          <TopBar title="Create Your Profile"
            leading={<BackButton/>}
            trailing={<Avatar size="sm" name="Portland Engineer 42"/>}/>
        </div>
        <div style={{ border:`1px solid ${theme.color.border}`, borderRadius: 12, overflow:'hidden' }}>
          <TopBar title="TechCo Channel"
            leading={<BackButton label=""/>}
            trailing={<Badge label="234" tone="neutral"/>}/>
        </div>
        <div style={{ border:`1px solid ${theme.color.border}`, borderRadius: 12, overflow:'hidden' }}>
          <TopBar title="Dashboard" divider={false}
            trailing={<Avatar size="sm" name="Portland Engineer 42" ring="support"/>}/>
        </div>
      </ExampleCard>

      <ExampleCard title="SectionHeader" tag="page sub-sections" stack>
        <div>
          <SectionHeader title="QUICK ACTIONS"
            action={<Text variant="caption" tone="link" weight={600}>See all</Text>}/>
          <SectionHeader title="YOUR CHANNEL"/>
          <SectionHeader title="RECOMMENDED FOR YOU"/>
        </div>
      </ExampleCard>

      <ExampleCard title="BottomTabs" tag="app-shell navigation" stack>
        <div className="phone">
          <div className="body">
            <Text variant="caption" tone="subtle">Current tab:</Text>
            <Text variant="heading" style={{ marginTop:8 }}>
              {({home:'Home',channel:'Channel',resources:'Resources',profile:'Profile'})[tab]}
            </Text>
            <Text variant="bodySm" tone="muted" style={{ marginTop:8 }}>
              Tap the tabs below to see the active state swap. Icon & label recolor to the accent token.
            </Text>
          </div>
          <BottomTabs activeKey={tab} onChange={setTab} items={[
            { key:'home', label:'Home', icon:'⌂' },
            { key:'channel', label:'Channel', icon:'💬', badge: 2 },
            { key:'resources', label:'Resources', icon:'📚' },
            { key:'profile', label:'Profile', icon:'⚇' },
          ]}/>
        </div>
      </ExampleCard>
    </>
  );
}

function ProfileSection() {
  const { theme } = useTheme();
  const [useRealPhoto, setUseRealPhoto] = useState(false);
  const [handle, setHandle] = useState('Portland-Engineer-42');
  return (
    <>
      <SectionHeader id="profile" title="Anonymous identity"
        sub="Everyone signs in anonymous by default. They can edit their handle and optionally add a real photo — real name + email stay private." />

      <ExampleCard title="Profile header" tag="Avatar + handle + controls" stack>
        <Card variant="outline" padding={20}>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <Avatar size="xl" name={handle} ring="support"/>
            <div style={{ flex:1 }}>
              <Text variant="heading">{handle}</Text>
              <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                <Badge label="Anonymous" tone="support" dot/>
                <Badge label="Verified · TechCo" tone="accent"/>
              </div>
            </div>
            <Button label="Edit" variant="secondary" size="sm"/>
          </div>
        </Card>
      </ExampleCard>

      <ExampleCard title="Edit profile sheet" tag="name · pronouns · email · photo" stack>
        <Card variant="outline" padding={20}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <TextField label="DISPLAY NAME" value={handle} onChange={setHandle} required
              helperText="Avoid your real name or any identifying details."/>
            <TextField label="PRONOUNS" optional placeholder="e.g. they/them"/>
            <TextField label="EMAIL (for notifications)" optional type="email" placeholder="you@example.com"/>
            <Toggle value={useRealPhoto} onChange={setUseRealPhoto}
              label="Show a real photo instead of an avatar"
              description="Only your channel sees it. You can turn this off anytime."/>
            <Card variant="soft" accent="success">
              <Text variant="caption" weight={700} tone="success">🔒 ALWAYS HIDDEN</Text>
              <Text variant="bodySm" style={{ marginTop:4 }}>
                Your real name, employer, and location are never visible to other members.
              </Text>
            </Card>
          </div>
        </Card>
      </ExampleCard>
    </>
  );
}

// ─── App shell ─────────────────────────────────────────────────────────────

function App() {
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem('tether.mode');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    syncChromeVars(mode);
    localStorage.setItem('tether.mode', mode);
  }, [mode]);

  return (
    <ThemeProvider mode={mode}>
      <div className="shell">
        <aside className="sidebar">
          <h1>Tether</h1>
          <p className="kicker">Component library</p>
          <nav>
            <span className="group-label">Getting started</span>
            <a href="#foundations">Foundations</a>
            <span className="group-label">Primitives</span>
            <a href="#primitives">Text · Button · Card</a>
            <a href="#primitives">Badge · Avatar · Divider</a>
            <span className="group-label">Forms</span>
            <a href="#forms">TextField · Select</a>
            <a href="#forms">Radio · Checkbox · Toggle</a>
            <span className="group-label">Navigation</span>
            <a href="#navigation">TopBar · Tabs</a>
            <span className="group-label">Patterns</span>
            <a href="#profile">Anonymous identity</a>
          </nav>
          <div style={{ marginTop: 32, fontSize:11, color:'var(--subtle)', fontFamily:'JetBrains Mono, monospace', lineHeight:1.6 }}>
            React Native (Expo)<br/>
            src/ · tokens.ts<br/>
            v0.1 · light + dark
          </div>
        </aside>

        <main className="content">
          <div className="topbar">
            <div>
              <Text variant="caption" tone="subtle">DESIGN SYSTEM · v0.1</Text>
              <div style={{ height: 2 }}/>
              <Text variant="title">A kind, calm kit for peer support.</Text>
              <div style={{ height: 6 }}/>
              <Text variant="bodySm" tone="muted" style={{ maxWidth: '52ch' }}>
                Tether is the component library powering an anonymous peer-support app for
                tech workers navigating layoffs. Built in React Native with Expo; this page
                mirrors each component in the browser for review.
              </Text>
            </div>
            <div className="mode-toggle" role="tablist" aria-label="Color mode">
              <button className={mode==='light'?'on':''} onClick={() => setMode('light')}>☀ Light</button>
              <button className={mode==='dark'?'on':''}  onClick={() => setMode('dark')}>☾ Dark</button>
            </div>
          </div>

          <FoundationsSection/>
          <PrimitivesSection/>
          <FormsSection/>
          <NavigationSection/>
          <ProfileSection/>

          <div style={{ height: 60 }}/>
          <Text variant="caption" tone="subtle">
            Source of truth lives in <code>src/</code>. This page is a mirror for review.
          </Text>
        </main>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
