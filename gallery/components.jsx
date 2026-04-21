/**
 * gallery.jsx — HTML mirror of the Tether RN components.
 *
 * The real components are React Native (src/components/*.tsx). This file
 * re-implements their visual surface in React DOM so we can review them
 * in-browser. The tokens are shared: we pull colors/type/radii from the
 * same semantic names, so if the DS token sheet changes, the gallery
 * updates to match.
 */

const { useState, useMemo, useEffect, createContext, useContext } = React;

// ─── Tokens (mirrored from src/tokens.ts) ─────────────────────────────────

const palette = {
  neutral0:'#FFFFFF', neutral25:'#FAF8F6', neutral50:'#F4F1EE', neutral100:'#E8E3DD',
  neutral200:'#D4CDC4', neutral300:'#B3AAA0', neutral400:'#8A8178', neutral500:'#6B645C',
  neutral600:'#4D4842', neutral700:'#34302C', neutral800:'#24211E', neutral900:'#171512',
  neutral950:'#0E0D0B',
  accent50:'#FBF0EB', accent100:'#F5DACE', accent200:'#EEBBA4', accent300:'#E59A78',
  accent400:'#DC7E54', accent500:'#C56641', accent600:'#A65236', accent700:'#83402A',
  support50:'#E8F1F0', support100:'#C6DEDB', support300:'#6FB0A9', support500:'#3F8A82',
  success500:'#2E8B57', success50:'#E6F3EC',
  warning500:'#B86E1E', warning50:'#FBF0DD',
  danger500:'#B4342C', danger50:'#F8E1DF',
};

const lightTheme = {
  mode: 'light',
  color: {
    bg: palette.neutral25, surface: palette.neutral0, surfaceSunken: palette.neutral50, surfaceRaised: palette.neutral0,
    text: palette.neutral900, textMuted: palette.neutral500, textSubtle: palette.neutral400,
    textInverse: palette.neutral0, textAccent: palette.accent600, textLink: palette.accent600,
    border: palette.neutral100, borderStrong: palette.neutral200, divider: palette.neutral100,
    accent: palette.accent500, accentHover: palette.accent600, accentPressed: palette.accent700,
    accentSoft: palette.accent50, accentOn: palette.neutral0,
    support: palette.support500, supportSoft: palette.support50, supportOn: palette.neutral0,
    success: palette.success500, successSoft: palette.success50,
    warning: palette.warning500, warningSoft: palette.warning50,
    danger: palette.danger500, dangerSoft: palette.danger50,
    focus: palette.accent500, overlay: 'rgba(23,21,18,0.45)',
  },
};
const darkTheme = {
  mode: 'dark',
  color: {
    bg: palette.neutral950, surface: palette.neutral900, surfaceSunken: palette.neutral950, surfaceRaised: palette.neutral800,
    text: palette.neutral25, textMuted: palette.neutral300, textSubtle: palette.neutral400,
    textInverse: palette.neutral900, textAccent: palette.accent300, textLink: palette.accent300,
    border: palette.neutral700, borderStrong: palette.neutral600, divider: palette.neutral700,
    accent: palette.accent400, accentHover: palette.accent300, accentPressed: palette.accent200,
    accentSoft: 'rgba(220,126,84,0.15)', accentOn: palette.neutral950,
    support: palette.support300, supportSoft: 'rgba(111,176,169,0.15)', supportOn: palette.neutral950,
    success: '#5BBF85', successSoft: 'rgba(91,191,133,0.14)',
    warning: '#E0A063', warningSoft: 'rgba(224,160,99,0.14)',
    danger: '#E27069', dangerSoft: 'rgba(226,112,105,0.14)',
    focus: palette.accent300, overlay: 'rgba(0,0,0,0.6)',
  },
};

const space = { 0:0, 1:2, 2:4, 3:8, 4:12, 5:16, 6:20, 7:24, 8:32, 9:40, 10:48, 11:64 };
const radius = { none:0, sm:6, md:10, lg:14, xl:20, pill:999 };
const typo = {
  family: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  scale: {
    display:  { size:32, lh:38, w:700, ls:-0.4 },
    title:    { size:24, lh:30, w:700, ls:-0.2 },
    heading:  { size:20, lh:26, w:700, ls:-0.1 },
    subtitle: { size:17, lh:24, w:600, ls:0 },
    body:     { size:16, lh:24, w:400, ls:0 },
    bodySm:   { size:14, lh:20, w:400, ls:0 },
    caption:  { size:12, lh:16, w:500, ls:0.1 },
    eyebrow:  { size:11, lh:14, w:700, ls:1.2 },
  },
};

// ─── Theme context ─────────────────────────────────────────────────────────

const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children, mode }) {
  const value = useMemo(() => ({
    theme: mode === 'dark' ? darkTheme : lightTheme,
    mode, space, radius, typo,
  }), [mode]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

// ─── Primitives (DOM mirrors of RN components) ────────────────────────────

function Text({ variant='body', tone='default', weight, align, style, children, as='span', ...rest }) {
  const { theme } = useTheme();
  const v = typo.scale[variant];
  const toneColor = {
    default: theme.color.text, muted: theme.color.textMuted, subtle: theme.color.textSubtle,
    inverse: theme.color.textInverse, accent: theme.color.textAccent, link: theme.color.textLink,
    success: theme.color.success, warning: theme.color.warning, danger: theme.color.danger,
  }[tone];
  const Tag = as;
  return (
    <Tag style={{
      fontFamily: typo.family,
      fontSize: v.size, lineHeight: v.lh + 'px',
      letterSpacing: v.ls, fontWeight: weight ?? v.w,
      color: toneColor,
      textTransform: variant === 'eyebrow' ? 'uppercase' : undefined,
      textAlign: align, margin: 0, display: 'inline-block',
      ...style,
    }} {...rest}>{children}</Tag>
  );
}

function Button({ label, variant='primary', size='md', loading=false, fullWidth=false, disabled=false, leading, trailing, onClick }) {
  const { theme } = useTheme();
  const c = theme.color;
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const heights = { sm:36, md:48, lg:56 };
  const padH = { sm:16, md:20, lg:24 };
  const textSize = size === 'sm' ? 14 : 16;

  const pal = (() => {
    if (variant === 'primary') return {
      bg: active ? c.accentPressed : hover ? c.accentHover : c.accent,
      fg: c.accentOn, border: 'transparent',
    };
    if (variant === 'secondary') return {
      bg: active ? c.surfaceSunken : c.surface,
      fg: c.text, border: c.borderStrong,
    };
    if (variant === 'ghost') return {
      bg: active ? c.surfaceSunken : 'transparent',
      fg: c.textAccent, border: 'transparent',
    };
    return { bg: c.danger, fg: '#fff', border: 'transparent' };
  })();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
      style={{
        height: heights[size], padding: `0 ${padH[size]}px`, borderRadius: radius.md,
        background: pal.bg, color: pal.fg,
        border: `1.5px solid ${pal.border}`,
        fontFamily: typo.family, fontWeight: 700, fontSize: textSize,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : undefined,
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
    >
      {loading ? <Spinner color={pal.fg}/> : <>
        {leading}<span>{label}</span>{trailing}
      </>}
    </button>
  );
}

function Spinner({ color='currentColor' }) {
  return (
    <span style={{
      display:'inline-block', width:16, height:16, border:`2px solid ${color}`,
      borderTopColor:'transparent', borderRadius:'50%',
      animation:'tether-spin 0.8s linear infinite',
    }}/>
  );
}

function Card({ variant='outline', accent='none', padding, style, children }) {
  const { theme } = useTheme();
  const c = theme.color;
  const pad = padding ?? space[5];
  const variantStyle = {
    surface: { background: c.surface, border: 'none' },
    outline: { background: c.surface, border: `1.5px solid ${c.border}` },
    soft:    { background: c.surfaceSunken, border: 'none' },
  }[variant];
  const accentColor = {
    warning: c.warning, danger: c.danger, success: c.success, accent: c.accent, none: null,
  }[accent];
  const accentBg = {
    warning: c.warningSoft, danger: c.dangerSoft, success: c.successSoft, accent: c.accentSoft, none: null,
  }[accent];
  return (
    <div style={{
      position:'relative',
      borderRadius: radius.lg, padding: pad, overflow: 'hidden',
      ...variantStyle,
      ...(accentBg ? { background: accentBg, border:'none' } : {}),
      ...style,
    }}>
      {accentColor && (
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:accentColor }}/>
      )}
      {children}
    </div>
  );
}

function Badge({ label, tone='neutral', size='sm', dot=false }) {
  const { theme } = useTheme();
  const c = theme.color;
  const pal = {
    accent:  { bg:c.accentSoft,  fg:c.textAccent, dot:c.accent },
    support: { bg:c.supportSoft, fg:c.support,    dot:c.support },
    success: { bg:c.successSoft, fg:c.success,    dot:c.success },
    warning: { bg:c.warningSoft, fg:c.warning,    dot:c.warning },
    danger:  { bg:c.dangerSoft,  fg:c.danger,     dot:c.danger },
    neutral: { bg:c.surfaceSunken, fg:c.textMuted, dot:c.textSubtle },
  }[tone];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      height: size==='sm'?22:28, padding:`0 ${size==='sm'?8:12}px`,
      borderRadius: radius.pill, background: pal.bg, color: pal.fg,
      fontFamily: typo.family, fontWeight:600, fontSize:12, letterSpacing:0.1,
    }}>
      {dot && <span style={{ width:6, height:6, borderRadius:3, background:pal.dot }}/>}
      {label}
    </span>
  );
}

function Avatar({ size='md', name='user', initials, ring='none', src }) {
  const { theme } = useTheme();
  const sizeMap = { xs:{d:24,f:11}, sm:{d:32,f:12}, md:{d:44,f:15}, lg:{d:56,f:18}, xl:{d:72,f:24} };
  const { d, f } = sizeMap[size];
  const TINTS = ['#C56641','#A65236','#B86E1E','#2E8B57','#3F8A82','#255851','#6B4EA8','#8B3A6E'];
  let h = 0; for (let i=0;i<name.length;i++) h = (h*31+name.charCodeAt(i))|0;
  const tint = TINTS[Math.abs(h)%TINTS.length];
  const inits = initials ?? (() => {
    const parts = name.trim().split(/[\s-_]+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length===1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  })();
  const ringColor = ring==='support' ? theme.color.support : ring==='accent' ? theme.color.accent : 'transparent';
  const inner = d - (ring!=='none' ? 4 : 0);
  return (
    <div style={{
      width:d, height:d, borderRadius:d/2,
      background: ringColor,
      padding: ring!=='none' ? 2 : 0,
      display:'inline-flex', alignItems:'center', justifyContent:'center',
    }}>
      {src ? (
        <img src={src} style={{ width:inner, height:inner, borderRadius:inner/2, objectFit:'cover' }}/>
      ) : (
        <div style={{
          width:inner, height:inner, borderRadius:inner/2, background:tint,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontFamily:typo.family, fontWeight:700, fontSize:f, letterSpacing:0.3,
        }}>{inits}</div>
      )}
    </div>
  );
}

function Divider({ orientation='horizontal', strength='subtle', style }) {
  const { theme } = useTheme();
  const color = strength==='strong' ? theme.color.borderStrong : theme.color.divider;
  return (
    <div style={orientation==='horizontal'
      ? { height:1, background:color, alignSelf:'stretch', ...style }
      : { width:1, background:color, alignSelf:'stretch', ...style }}/>
  );
}

// ─── Form components ──────────────────────────────────────────────────────

function TextField({ label, prefix, value, onChange, placeholder, helperText, errorText, required, optional, leading, trailing, type='text' }) {
  const { theme } = useTheme();
  const c = theme.color;
  const [focus, setFocus] = useState(false);
  const hasError = !!errorText;
  const borderColor = hasError ? c.danger : focus ? c.accent : c.borderStrong;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && (
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Text variant="caption" weight={600} tone="muted">{label}{required?' *':''}</Text>
          {optional && <Text variant="caption" tone="subtle">Optional</Text>}
        </div>
      )}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        minHeight:52, padding:'0 16px',
        borderRadius:radius.md, border:`1.5px solid ${borderColor}`,
        background: c.surface,
      }}>
        {leading}
        {prefix && <Text tone="muted">{prefix}</Text>}
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder={placeholder}
          style={{
            flex:1, border:'none', outline:'none', background:'transparent',
            fontFamily:typo.family, fontSize:16, color:c.text,
            padding:'12px 0',
          }}
        />
        {trailing}
      </div>
      {hasError ? <Text variant="caption" tone="danger">{errorText}</Text>
        : helperText ? <Text variant="caption" tone="subtle">{helperText}</Text> : null}
    </div>
  );
}

function Select({ label, value, options, onChange, placeholder='Select…' }) {
  const { theme } = useTheme();
  const c = theme.color;
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <Text variant="caption" weight={600} tone="muted">{label}</Text>}
      <div style={{
        position:'relative', minHeight:52,
        borderRadius:radius.md, border:`1.5px solid ${focus?c.accent:c.borderStrong}`,
        background:c.surface,
        display:'flex', alignItems:'center',
      }}>
        <select
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          style={{
            flex:1, height:52, padding:'0 40px 0 16px',
            border:'none', outline:'none', background:'transparent',
            fontFamily:typo.family, fontSize:16,
            color: value ? c.text : c.textSubtle,
            appearance:'none',
          }}
        >
          {!value && <option value="" disabled>{placeholder}</option>}
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position:'absolute', right:16, pointerEvents:'none', color:c.textMuted }}>▾</span>
      </div>
    </div>
  );
}

function RadioGroup({ label, value, onChange, options, variant='card' }) {
  const { theme } = useTheme();
  const c = theme.color;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {label && <Text variant="caption" weight={600} tone="muted">{label}</Text>}
      <div style={{ display:'flex', flexDirection:'column', gap: variant==='card'?8:4 }}>
        {options.map(opt => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange?.(opt.value)}
              style={{
                textAlign:'left', cursor:'pointer', border:'none', background:'transparent',
                display:'flex', gap:12, padding: variant==='card'?16:8,
                alignItems: variant==='card'?'flex-start':'center',
                borderRadius: radius.md,
                ...(variant==='card' && {
                  border: `1.5px solid ${selected ? c.accent : c.border}`,
                  background: selected ? c.accentSoft : c.surface,
                }),
                fontFamily: typo.family,
              }}
            >
              <span style={{
                width:22, height:22, borderRadius:11,
                border:`2px solid ${selected?c.accent:c.borderStrong}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                marginTop: variant==='card' ? 2 : 0,
                flexShrink: 0,
              }}>
                {selected && <span style={{ width:10, height:10, borderRadius:5, background:c.accent }}/>}
              </span>
              <span style={{ flex:1 }}>
                <Text variant="body" weight={selected?600:500}>{opt.label}</Text>
                {opt.description && <><br/><Text variant="caption" tone="muted">{opt.description}</Text></>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Checkbox({ label, description, checked, onChange, variant='inline' }) {
  const { theme } = useTheme();
  const c = theme.color;
  return (
    <button
      onClick={() => onChange?.(!checked)}
      style={{
        textAlign:'left', cursor:'pointer', border:'none', background:'transparent',
        display:'flex', gap:12,
        alignItems: variant==='card'?'flex-start':'center',
        padding: variant==='card'?16:0,
        borderRadius: radius.md,
        ...(variant==='card' && {
          border: `1.5px solid ${checked ? c.accent : c.border}`,
          background: checked ? c.accentSoft : c.surface,
        }),
        fontFamily: typo.family,
      }}
    >
      <span style={{
        width:22, height:22, borderRadius:6,
        border: `2px solid ${checked?c.accent:c.borderStrong}`,
        background: checked ? c.accent : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: c.accentOn, fontSize:14, fontWeight:800, lineHeight:1,
        flexShrink: 0,
        marginTop: variant==='card' ? 2 : 0,
      }}>{checked && '✓'}</span>
      {(label || description) && (
        <span style={{ flex:1 }}>
          {label && <Text variant="body" weight={checked?600:500}>{label}</Text>}
          {description && <><br/><Text variant="caption" tone="muted">{description}</Text></>}
        </span>
      )}
    </button>
  );
}

function Toggle({ label, description, value, onChange }) {
  const { theme } = useTheme();
  const c = theme.color;
  return (
    <button
      onClick={() => onChange?.(!value)}
      style={{
        display:'flex', alignItems:'center', gap:12, width:'100%',
        background:'transparent', border:'none', cursor:'pointer',
        padding:0, fontFamily:typo.family, textAlign:'left',
      }}
    >
      {(label||description) && (
        <span style={{ flex:1 }}>
          {label && <Text variant="body" weight={500}>{label}</Text>}
          {description && <><br/><Text variant="caption" tone="muted">{description}</Text></>}
        </span>
      )}
      <span style={{
        width:46, height:26, borderRadius:13,
        background: value ? c.accent : c.borderStrong,
        position:'relative', transition:'background 180ms ease',
        flexShrink: 0,
      }}>
        <span style={{
          position:'absolute', top:2, left: value ? 22 : 2,
          width:22, height:22, borderRadius:11, background:'#fff',
          transition:'left 180ms ease',
          boxShadow:'0 1px 3px rgba(0,0,0,0.18)',
        }}/>
      </span>
    </button>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────

function TopBar({ title, leading, trailing, divider=true }) {
  const { theme } = useTheme();
  const c = theme.color;
  return (
    <div style={{
      minHeight:52, padding:'0 12px',
      display:'flex', alignItems:'center',
      background: c.bg,
      borderBottom: divider ? `1px solid ${c.divider}` : 'none',
    }}>
      <div style={{ minWidth:56, display:'flex', alignItems:'center' }}>{leading}</div>
      <div style={{ flex:1, textAlign:'center' }}>
        {title && <Text variant="subtitle" weight={700}>{title}</Text>}
      </div>
      <div style={{ minWidth:56, display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
        {trailing}
      </div>
    </div>
  );
}

function BackButton({ onClick, label='Back' }) {
  const { theme } = useTheme();
  return (
    <button onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:2,
      padding:'8px 4px', background:'transparent', border:'none', cursor:'pointer',
      color: theme.color.textLink, fontFamily: typo.family, fontSize:16,
    }}>
      <span style={{ fontSize:22, lineHeight:'20px' }}>‹</span>{label}
    </button>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'8px 0',
    }}>
      <Text variant="eyebrow" tone="subtle">{title}</Text>
      {action}
    </div>
  );
}

function BottomTabs({ items, activeKey, onChange }) {
  const { theme } = useTheme();
  const c = theme.color;
  return (
    <div style={{
      display:'flex', background:c.surface,
      borderTop:`1px solid ${c.divider}`,
    }}>
      {items.map(item => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            style={{
              flex:1, padding:'12px 0', background:'transparent', border:'none',
              cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:2,
              fontFamily:typo.family,
            }}
          >
            <span style={{ fontSize:20, color: active?c.accent:c.textMuted, lineHeight:1, position:'relative' }}>
              {item.icon}
              {item.badge > 0 && (
                <span style={{
                  position:'absolute', top:-4, right:-10,
                  minWidth:16, height:16, borderRadius:8, background:c.danger, color:'#fff',
                  fontSize:10, fontWeight:700, padding:'0 4px',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                }}>{item.badge > 9 ? '9+' : item.badge}</span>
              )}
            </span>
            <span style={{
              fontSize:12, fontWeight: active?700:500, letterSpacing:0.1,
              color: active?c.accent:c.textMuted,
            }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Exports to global for gallery.html ───────────────────────────────────

Object.assign(window, {
  ThemeProvider, useTheme, palette, space, radius, typo,
  Text, Button, Card, Badge, Avatar, Divider,
  TextField, Select, RadioGroup, Checkbox, Toggle,
  TopBar, BackButton, SectionHeader, BottomTabs,
  Spinner,
});
