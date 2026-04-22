// StandStrong desktop prototype orchestrator.
// Route space mirrors mobile: welcome → triage → create-handle → safety →
// location → consent → confirm, then dashboard/chat/counselors/resources/profile.

const { useState: dUseState, useCallback: dUseCallback, useEffect: dUseEffect } = React;

const D_TAB_ROUTES = ['dashboard', 'chat', 'counselors', 'resources', 'profile'];

function DApp() {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('StandStrong:desktop:state') || '{}'); }
    catch { return {}; }
  })();

  const [state, setState] = dUseState({
    persona: saved.persona || 'maya',
    handle: saved.handle || '',
    stateCode: saved.stateCode || '',
    triageMode: saved.triageMode || null,
    triageStatus: saved.triageStatus || null,
    triageFlags: saved.triageFlags || [],
  });
  const [screen, setScreenRaw] = dUseState(saved.screen || 'welcome');
  const [history, setHistory] = dUseState(saved.history || ['welcome']);

  const setScreen = dUseCallback((next) => {
    setScreenRaw(next);
    setHistory(h => [...h, next]);
  }, []);

  const back = dUseCallback(() => {
    setHistory(h => {
      if (h.length <= 1) return h;
      const n = h.slice(0, -1);
      setScreenRaw(n[n.length - 1]);
      return n;
    });
  }, []);

  dUseEffect(() => {
    localStorage.setItem('StandStrong:desktop:state', JSON.stringify({ ...state, screen, history }));
  }, [state, screen, history]);

  const goto = dUseCallback((next) => {
    if (next && next.startsWith('app:')) setScreen(next.slice(4));
    else setScreen(next);
  }, [setScreen]);

  const isTab = D_TAB_ROUTES.includes(screen);

  // Screen body
  let body = null;
  switch (screen) {
    case 'welcome':       body = <DWelcome goto={goto} />; break;
    case 'triage':        body = <DTriage goto={goto} back={back} state={state} setState={setState} />; break;
    case 'create-handle': body = <DCreateHandle goto={goto} back={back} state={state} setState={setState} />; break;
    case 'safety':        body = <DSafety goto={goto} back={back} />; break;
    case 'location':      body = <DLocation goto={goto} back={back} setState={setState} />; break;
    case 'consent':       body = <DConsent goto={goto} back={back} />; break;
    case 'confirm':       body = <DConfirm goto={goto} state={state} />; break;
    case 'dashboard':     body = <DDashboardTab persona={state.persona}
                            setPersona={p => setState(s => ({ ...s, persona: p }))}
                            setScreen={setScreen} />; break;
    case 'chat':          body = <DChatTab setScreen={setScreen} />; break;
    case 'counselors':    body = <DCounselorsTab persona={state.persona} />; break;
    case 'resources':     body = <DResourcesTab />; break;
    case 'profile':       body = <DProfileTab setScreen={setScreen} state={state} persona={state.persona} />; break;
    default:              body = <DWelcome goto={goto} />;
  }

  return (
    <>
      <DevNav
        screen={screen}
        onJump={(s) => { setScreenRaw(s); setHistory([s]); }}
        onReset={() => {
          localStorage.removeItem('StandStrong:desktop:state');
          setState({ persona: 'maya', handle: '', stateCode: '', triageMode: null, triageStatus: null, triageFlags: [] });
          setHistory(['welcome']); setScreenRaw('welcome');
        }}
      />

      {isTab ? (
        <DesktopAppShell
          active={screen}
          onChange={setScreen}
          handle={state.handle || 'Anonymous'}
          onHandleClick={() => setScreen('profile')}
        >
          {body}
        </DesktopAppShell>
      ) : body}
    </>
  );
}

function DevNav({ screen, onJump, onReset }) {
  const [open, setOpen] = React.useState(false);
  const screens = [
    ['Onboarding', ['welcome','triage','create-handle','safety','location','consent','confirm']],
    ['App',        ['dashboard','chat','counselors','resources','profile']],
  ];
  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 200,
        background: '#1a1f26', color: '#fff', border: 0,
        paddingInline: 14, paddingBlock: 10, borderRadius: 10,
        fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
        cursor: 'pointer', textTransform: 'uppercase',
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
      }}>{open ? 'Hide' : 'Dev Nav'}</button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 64, right: 20, zIndex: 200,
          width: 280, background: '#1a1f26', color: '#fff',
          borderRadius: 12, padding: 16, fontFamily: 'Inter',
          boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                        color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
            CURRENT SCREEN
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{screen}</div>

          {screens.map(([label, list]) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                            color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {list.map(s => (
                  <button key={s} onClick={() => onJump(s)} style={{
                    background: s === screen ? T.accent : 'rgba(255,255,255,0.08)',
                    color: '#fff', border: 0, borderRadius: 6,
                    paddingInline: 8, paddingBlock: 5, cursor: 'pointer',
                    fontSize: 11, fontFamily: 'Inter',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          ))}

          <button onClick={onReset} style={{
            marginTop: 6, width: '100%', background: 'rgba(197,48,48,0.2)',
            color: '#ff8a8a', border: 0, borderRadius: 6, padding: '8px 10px',
            cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Inter',
          }}>Reset prototype</button>
        </div>
      )}
    </>
  );
}

const dRoot = ReactDOM.createRoot(document.getElementById('root'));
dRoot.render(<DApp />);
