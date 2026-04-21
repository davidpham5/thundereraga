// StandStrong — Interactive Prototype orchestrator.
// Routes: welcome → triage → create-handle → safety → location → consent → confirm
// Tab app: dashboard · chat · counselors · resources · profile
// A persona switcher in the dashboard top-right rotates between the 5 archetypes.

const { useState, useMemo, useCallback, useEffect } = React;

/* ───────────── Screen stack ───────────── */
const ONBOARDING_ORDER = [
  "welcome",
  "triage",
  "create-handle",
  "safety",
  "location",
  "consent",
  "confirm",
];
const TAB_ROUTES = ["dashboard", "chat", "counselors", "resources", "profile"];

function useRouter(initial = "welcome") {
  const [stack, setStack] = useState([initial]);
  const current = stack[stack.length - 1];

  const goto = useCallback((next, _payload) => {
    setStack((s) => [...s, next]);
  }, []);
  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const reset = useCallback((to = "welcome") => {
    setStack([to]);
  }, []);
  return { current, goto, back, reset, stack };
}

/* ───────────── Tab Bar ───────────── */
function TabBar({ active, onChange }) {
  const items = [
    { id: "dashboard", label: "Home", icon: "⌂" },
    { id: "chat", label: "Chat", icon: "✉" },
    { id: "counselors", label: "Counselors", icon: "♡" },
    { id: "resources", label: "Resources", icon: "▤" },
    { id: "profile", label: "Profile", icon: "○" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid ${T.border}`,
        background: T.bg,
        paddingBottom: 18,
        paddingTop: 6,
      }}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            style={{
              flex: 1,
              background: "transparent",
              border: 0,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "6px 0",
              fontFamily: "Inter",
              color: on ? T.accent : T.textMuted,
            }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{it.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>
              {it.label.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── App ───────────── */
function App() {
  // Persist route so refreshes don't jump you back to S01.
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("StandStrong:state") || "{}");
    } catch {
      return {};
    }
  })();

  const [state, setState] = useState({
    persona: saved.persona || "maya",
    handle: saved.handle || "",
    stateCode: saved.stateCode || "",
    triageMode: saved.triageMode || null,
    triageStatus: saved.triageStatus || null,
    triageFlags: saved.triageFlags || [],
  });
  const [screen, setScreenRaw] = useState(saved.screen || "welcome");
  const [history, setHistory] = useState(saved.history || ["welcome"]);

  const setScreen = useCallback((next) => {
    setScreenRaw(next);
    setHistory((h) => [...h, next]);
  }, []);
  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const n = h.slice(0, -1);
      setScreenRaw(n[n.length - 1]);
      return n;
    });
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(
      "StandStrong:state",
      JSON.stringify({ ...state, screen, history }),
    );
  }, [state, screen, history]);

  // Onboarding `goto('app:dashboard')` convention.
  const goto = useCallback(
    (next) => {
      if (next && next.startsWith("app:")) {
        setScreen(next.slice(4));
      } else {
        setScreen(next);
      }
    },
    [setScreen],
  );

  const isTab = TAB_ROUTES.includes(screen);
  const showTabBar = isTab && screen !== "chat"; // chat has its own composer

  let body = null;
  switch (screen) {
    case "welcome":
      body = <Welcome goto={goto} />;
      break;
    case "triage":
      body = (
        <Triage goto={goto} back={back} state={state} setState={setState} />
      );
      break;
    case "create-handle":
      body = (
        <CreateHandle
          goto={goto}
          back={back}
          state={state}
          setState={setState}
        />
      );
      break;
    case "safety":
      body = <Safety goto={goto} back={back} />;
      break;
    case "location":
      body = <Location goto={goto} back={back} setState={setState} />;
      break;
    case "consent":
      body = <Consent goto={goto} back={back} />;
      break;
    case "confirm":
      body = <Confirm goto={goto} state={state} />;
      break;
    case "dashboard":
      body = (
        <DashboardTab
          persona={state.persona}
          setPersona={(p) => setState((s) => ({ ...s, persona: p }))}
          setScreen={setScreen}
        />
      );
      break;
    case "chat":
      body = <ChatTab back={back} />;
      break;
    case "counselors":
      body = <CounselorsTab persona={state.persona} />;
      break;
    case "resources":
      body = <ResourcesTab />;
      break;
    case "profile":
      body = (
        <ProfileTab
          setScreen={setScreen}
          state={state}
          persona={state.persona}
        />
      );
      break;
    default:
      body = <Welcome goto={goto} />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F1419",
        padding: 20,
        boxSizing: "border-box",
        position: "relative",
      }}>
      <DesignerNotes
        onReset={() => {
          localStorage.removeItem("StandStrong:state");
          setState({
            persona: "maya",
            handle: "",
            stateCode: "",
            triageMode: null,
            triageStatus: null,
            triageFlags: [],
          });
          setHistory(["welcome"]);
          setScreenRaw("welcome");
        }}
        screen={screen}
        jumpTo={(s) => {
          setScreenRaw(s);
          setHistory([s]);
        }}
      />

      <div
        style={{
          transform: getFitTransform(),
          transformOrigin: "center center",
        }}>
        <PhoneFrame>
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              {body}
            </div>
            {showTabBar && <TabBar active={screen} onChange={setScreen} />}
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

/* ───────────── Phone frame ───────────── */
function PhoneFrame({ children }) {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        borderRadius: 48,
        overflow: "hidden",
        position: "relative",
        background: T.bg,
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.35), 0 0 0 10px #1a1f26, 0 0 0 11px rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
      }}>
      {/* status bar */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px 0",
          position: "relative",
          zIndex: 30,
          flexShrink: 0,
          fontFamily: "-apple-system, system-ui",
          color: T.text,
        }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 32,
            borderRadius: 18,
            background: "#0c0f14",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
          }}>
          <span>􀙇</span>
          <span>􀛨</span>
          <span>􀛪</span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}>
        {children}
      </div>

      {/* home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 40,
          pointerEvents: "none",
        }}>
        <div
          style={{
            width: 134,
            height: 5,
            borderRadius: 3,
            background: "rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

function getFitTransform() {
  if (typeof window === "undefined") return "scale(1)";
  const targetH = 844 + 80; // phone + margins
  const scale = Math.min(1, (window.innerHeight - 40) / targetH);
  return `scale(${Math.max(0.6, scale)})`;
}

/* ───────────── Designer notes panel (tweakable) ───────────── */
function DesignerNotes({ onReset, screen, jumpTo }) {
  const [open, setOpen] = useState(false);
  const screens = [
    [
      "Onboarding",
      [
        "welcome",
        "triage",
        "create-handle",
        "safety",
        "location",
        "consent",
        "confirm",
      ],
    ],
    ["App", ["dashboard", "chat", "counselors", "resources", "profile"]],
  ];
  const personaHint = {
    maya: "Maya — severance deadline path",
    david: "David — Day-1 crisis path",
    priya: "Priya — H-1B 60-day path",
    james: "James — ADEA/age-discrim path",
    kiesha: "Kiesha — preparing, still employed",
  };
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 100,
          background: "#1a1f26",
          color: "#fff",
          border: 0,
          paddingInline: 12,
          paddingBlock: 8,
          borderRadius: 8,
          fontFamily: "Inter",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.3,
          cursor: "pointer",
          textTransform: "uppercase",
        }}>
        {open ? "Hide" : "Dev Nav"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 16,
            zIndex: 100,
            width: 260,
            background: "#1a1f26",
            color: "#fff",
            borderRadius: 12,
            padding: 16,
            fontFamily: "Inter",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}>
            CURRENT SCREEN
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {screen}
          </div>

          {screens.map(([label, list]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 6,
                }}>
                {label.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {list.map((s) => (
                  <button
                    key={s}
                    onClick={() => jumpTo(s)}
                    style={{
                      background:
                        s === screen ? T.accent : "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: 0,
                      borderRadius: 6,
                      paddingInline: 8,
                      paddingBlock: 5,
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: 11,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.5,
            }}>
            Persona rotates from Home top-right pill. Current path:{" "}
            {personaHint.maya}
          </div>

          <button
            onClick={onReset}
            style={{
              marginTop: 10,
              width: "100%",
              background: "rgba(197,48,48,0.2)",
              color: "#ff8a8a",
              border: 0,
              borderRadius: 6,
              padding: "8px 10px",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "Inter",
            }}>
            Reset prototype
          </button>
        </div>
      )}
    </>
  );
}

/* ───────────── Mount ───────────── */
window.addEventListener("resize", () => {
  const el = document.querySelector("#root > div > div");
  if (el) el.style.transform = getFitTransform();
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
