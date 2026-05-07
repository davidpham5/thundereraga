// Desktop app orchestrator — sidebar nav + content area, with tweakable controls.

const { useState: useStateD, useEffect: useEffectD } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brand": "StandStrong",
  "tagline": "Peer support, anonymous",
  "accent": "#2B6CB0",
  "density": "regular",
  "showCrisisLine": true,
  "showCommunityWidget": true,
  "showProgressWidget": true,
  "showMoodCheckin": true
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  "#2B6CB0": { hover: "#1A4A80", soft: "#EBF8FF" }, // blue (default)
  "#1F8A5B": { hover: "#14653F", soft: "#F0FDF4" }, // green
  "#7A3FBF": { hover: "#553C9A", soft: "#F5F0FF" }, // purple
  "#B5471F": { hover: "#8A3517", soft: "#FFF5EE" }, // burnt orange
  "#0E7490": { hover: "#0B5A70", soft: "#ECFEFF" }, // teal
};

const DENSITY_SCALE = {
  compact: { padScale: 0.78, fontScale: 0.95 },
  regular: { padScale: 1.0,  fontScale: 1.0 },
  comfy:   { padScale: 1.15, fontScale: 1.05 },
};

function DesktopApp() {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('standstrong:desktop:state') || '{}'); }
    catch { return {}; }
  })();

  const [persona, setPersona] = useStateD(saved.persona || 'maya');
  const [handle] = useStateD(saved.handle || '');
  const [screen, setScreen] = useStateD(saved.screen || 'dashboard');
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectD(() => {
    localStorage.setItem('standstrong:desktop:state', JSON.stringify({ persona, handle, screen }));
  }, [persona, handle, screen]);

  // Apply accent + density to the CSS variables on :root.
  useEffectD(() => {
    const root = document.documentElement;
    const preset = ACCENT_PRESETS[t.accent] || { hover: t.accent, soft: '#EBF8FF' };
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-hover', preset.hover);
    root.style.setProperty('--accent-soft', preset.soft);
    const d = DENSITY_SCALE[t.density] || DENSITY_SCALE.regular;
    root.style.setProperty('--density-pad', d.padScale);
    root.style.setProperty('--density-font', d.fontScale);
    document.title = `${t.brand} — Desktop`;
  }, [t.accent, t.density, t.brand]);

  const state = { persona, handle, stateCode: '', brand: t.brand };

  let body = null;
  switch (screen) {
    case 'dashboard':
      body = <DesktopDashboard persona={persona} setPersona={setPersona} setScreen={setScreen} tweaks={t} />;
      break;
    case 'chat':
      body = <DesktopChat />;
      break;
    case 'counselors':
      body = <DesktopCounselors persona={persona} />;
      break;
    case 'resources':
      body = <DesktopResources />;
      break;
    case 'profile':
      body = <DesktopProfile setScreen={setScreen} state={state} persona={persona} />;
      break;
    default:
      body = <DesktopDashboard persona={persona} setPersona={setPersona} setScreen={setScreen} tweaks={t} />;
  }

  const isChat = screen === 'chat';
  const fontScale = (DENSITY_SCALE[t.density] || DENSITY_SCALE.regular).fontScale;

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
      background: T.bg, color: T.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: `${fontScale}rem`,
    }}>
      <Sidebar
        active={screen} onChange={setScreen} persona={persona}
        brand={t.brand} tagline={t.tagline}
        showCrisisLine={t.showCrisisLine}
      />
      <main style={{
        flex: 1, minWidth: 0, height: '100vh',
        overflowY: isChat ? 'hidden' : 'auto',
        background: isChat ? T.bg : T.sunken,
      }}>
        {body}
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand" />
        <TweakText  label="Name"    value={t.brand}   onChange={(v) => setTweak('brand', v)} />
        <TweakText  label="Tagline" value={t.tagline} onChange={(v) => setTweak('tagline', v)} />

        <TweakSection label="Theme" />
        <TweakColor label="Accent" value={t.accent}
          options={Object.keys(ACCENT_PRESETS)}
          onChange={(v) => setTweak('accent', v)} />
        <TweakRadio label="Density" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />

        <TweakSection label="Home widgets" />
        <TweakToggle label="Mood check-in"   value={t.showMoodCheckin}
          onChange={(v) => setTweak('showMoodCheckin', v)} />
        <TweakToggle label="Progress card"   value={t.showProgressWidget}
          onChange={(v) => setTweak('showProgressWidget', v)} />
        <TweakToggle label="Community card"  value={t.showCommunityWidget}
          onChange={(v) => setTweak('showCommunityWidget', v)} />

        <TweakSection label="Sidebar" />
        <TweakToggle label="988 crisis line" value={t.showCrisisLine}
          onChange={(v) => setTweak('showCrisisLine', v)} />
      </TweaksPanel>
    </div>
  );
}

const desktopRoot = ReactDOM.createRoot(document.getElementById('root'));
desktopRoot.render(<DesktopApp />);
