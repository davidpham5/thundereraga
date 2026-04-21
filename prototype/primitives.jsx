// Primitive components ported from src/components/*.tsx to plain HTML/React
// so the prototype runs in-browser without React Native.
//
// Style tokens come from the CSS variables defined in index.html.

const T = {
  bg: 'var(--bg)', sunken: 'var(--sunken)', mutedSurface: 'var(--muted-surface)',
  border: 'var(--border)', borderStrong: 'var(--border-strong)',
  text: 'var(--text)', textMuted: 'var(--text-muted)', textSubtle: 'var(--text-subtle)',
  accent: 'var(--accent)', accentHover: 'var(--accent-hover)', accentSoft: 'var(--accent-soft)',
  success: 'var(--success)', successSoft: 'var(--success-soft)',
  warning: 'var(--warning)', warningSoft: 'var(--warning-soft)', warningDeep: 'var(--warning-deep)',
  danger: 'var(--danger)', dangerSoft: 'var(--danger-soft)',
  purple: 'var(--purple)', pink: 'var(--pink)',
};

/* ────────────────────────── Text ────────────────────────── */
const TEXT_SCALE = {
  display:  { fontSize: 22, lineHeight: '28px', fontWeight: 700, letterSpacing: '-0.2px' },
  title:    { fontSize: 20, lineHeight: '26px', fontWeight: 700, letterSpacing: '-0.1px' },
  heading:  { fontSize: 18, lineHeight: '24px', fontWeight: 700 },
  subtitle: { fontSize: 15, lineHeight: '20px', fontWeight: 700 },
  body:     { fontSize: 14, lineHeight: '20px', fontWeight: 400 },
  bodySm:   { fontSize: 13, lineHeight: '18px', fontWeight: 400 },
  caption:  { fontSize: 12, lineHeight: '16px', fontWeight: 400 },
  label:    { fontSize: 11, lineHeight: '14px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' },
};
function Text({ variant = 'body', tone = 'default', weight, align, style, children, ...rest }) {
  const v = TEXT_SCALE[variant] || TEXT_SCALE.body;
  const toneColor = {
    default: T.text, muted: T.textMuted, subtle: T.textSubtle, inverse: '#fff',
    accent: T.accent, success: T.success, warning: T.warning, danger: T.danger,
  }[tone] || T.text;
  return <div style={{
    ...v, color: toneColor, textAlign: align,
    fontWeight: weight ?? v.fontWeight,
    ...style,
  }} {...rest}>{children}</div>;
}

/* ────────────────────────── Button ────────────────────────── */
function Button({ label, variant = 'primary', size = 'md', fullWidth, disabled, onClick, leading, trailing }) {
  const h = { sm: 36, md: 48, lg: 56 }[size];
  const padX = { sm: 16, md: 20, lg: 24 }[size];
  const styles = {
    primary: { bg: T.accent, color: '#fff', border: 'transparent' },
    secondary: { bg: T.bg, color: T.text, border: T.borderStrong },
    ghost: { bg: 'transparent', color: T.accent, border: 'transparent' },
    danger: { bg: T.danger, color: '#fff', border: 'transparent' },
  }[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        height: h, paddingInline: padX, borderRadius: 10,
        background: styles.bg, color: styles.color,
        border: `1.5px solid ${styles.border}`,
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'Inter', fontSize: 15, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 100ms, background 160ms',
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {leading}{label}{trailing}
    </button>
  );
}

/* ────────────────────────── Badge ────────────────────────── */
function Badge({ label, tone = 'neutral', dot = false }) {
  const pal = {
    neutral: { bg: T.sunken, fg: T.textMuted, d: T.textSubtle },
    accent:  { bg: T.accentSoft, fg: T.accent, d: T.accent },
    success: { bg: T.successSoft, fg: T.success, d: T.success },
    warning: { bg: T.warningSoft, fg: T.warning, d: T.warning },
    danger:  { bg: T.dangerSoft, fg: T.danger, d: T.danger },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 22, paddingInline: 8, borderRadius: 999,
      background: pal.bg, color: pal.fg,
      fontSize: 12, fontWeight: 600,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: pal.d }} />}
      {label}
    </span>
  );
}

/* ────────────────────────── Avatar ────────────────────────── */
function Avatar({ size = 'md', name = '?', tint, initials }) {
  const d = { xs: 24, sm: 32, md: 44, lg: 56, xl: 72 }[size];
  const font = { xs: 11, sm: 12, md: 15, lg: 18, xl: 24 }[size];
  const fallbackTints = ['#C56641','#A65236','#B86E1E','#2E8B57','#3F8A82','#255851','#6B4EA8','#8B3A6E'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const bg = tint || fallbackTints[Math.abs(h) % fallbackTints.length];
  const ini = initials || (name.split(/[\s\-_]+/).slice(0,2).map(p => p[0]?.toUpperCase()).join('') || '?');
  return (
    <div style={{
      width: d, height: d, borderRadius: d/2, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: font, letterSpacing: 0.3,
      flexShrink: 0,
    }}>{ini}</div>
  );
}

/* ────────────────────────── Alert ────────────────────────── */
function Alert({ title, message, tone = 'info', actionLabel, onAction }) {
  const pal = {
    info:    { bg: T.accentSoft, rail: T.accent, icon: 'ⓘ' },
    success: { bg: T.successSoft, rail: T.success, icon: '✓' },
    warning: { bg: T.warningSoft, rail: T.warning, icon: '!' },
    danger:  { bg: T.dangerSoft, rail: T.danger, icon: '!' },
  }[tone];
  return (
    <div style={{
      position: 'relative', display: 'flex', gap: 12,
      padding: 16, borderRadius: 10, background: pal.bg, overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: pal.rail }} />
      <div style={{
        width: 24, height: 24, borderRadius: 12, background: pal.rail,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0,
      }}>{pal.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text variant="body" weight={700}>{title}</Text>
        {message && <Text variant="bodySm" tone="muted" style={{ marginTop: 2 }}>{message}</Text>}
        {actionLabel && (
          <button onClick={onAction} style={{
            marginTop: 6, background: 'transparent', border: 0, padding: 0,
            color: pal.rail, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            fontFamily: 'Inter',
          }}>{actionLabel} →</button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────── Card ────────────────────────── */
function Card({ variant = 'outline', accent = 'none', padding = 16, style, children }) {
  const variantStyle = {
    surface: { background: T.bg, border: 'transparent' },
    outline: { background: T.bg, border: T.border },
    soft:    { background: T.sunken, border: 'transparent' },
  }[variant];
  const accentColors = { warning: T.warning, danger: T.danger, success: T.success, accent: T.accent, none: null };
  const accentBgs = { warning: T.warningSoft, danger: T.dangerSoft, success: T.successSoft, accent: T.accentSoft, none: null };
  const railColor = accentColors[accent];
  const accentBg = accentBgs[accent];
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 12,
      padding,
      background: accentBg || variantStyle.background,
      border: accentBg ? 'transparent' : `1.5px solid ${variantStyle.border}`,
      ...(style||{}),
    }}>
      {railColor && <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: railColor,
      }} />}
      {children}
    </div>
  );
}

/* ────────────────────────── TopBar ────────────────────────── */
function TopBar({ title, leading, trailing }) {
  return (
    <div style={{
      minHeight: 52, paddingInline: 12, background: T.bg,
      borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ minWidth: 56, display: 'flex', alignItems: 'center' }}>{leading}</div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && <Text variant="subtitle">{title}</Text>}
      </div>
      <div style={{ minWidth: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}
function BackButton({ onClick, label = 'Back' }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 0, cursor: 'pointer',
      padding: '10px 8px', color: T.accent, fontSize: 14, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 2, fontFamily: 'Inter',
    }}>
      <span style={{ fontSize: 18, lineHeight: '20px' }}>‹</span>{label}
    </button>
  );
}
function SectionHeader({ title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingBlock: 8, marginBottom: 4,
    }}>
      <Text variant="label" tone="subtle">{title}</Text>
      {action}
    </div>
  );
}

/* ────────────────────────── Radio / Check ────────────────────────── */
function RadioGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <Text variant="caption" weight={600} tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</Text>}
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: 16, borderRadius: 10,
            border: `1.5px solid ${selected ? T.accent : T.border}`,
            background: selected ? T.accentSoft : T.bg,
            cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              border: `2px solid ${selected ? T.accent : T.borderStrong}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 2, flexShrink: 0,
            }}>
              {selected && <div style={{ width: 10, height: 10, borderRadius: 5, background: T.accent }} />}
            </div>
            <div style={{ flex: 1 }}>
              <Text variant="body" weight={selected ? 600 : 500}>{opt.label}</Text>
              {opt.description && <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>{opt.description}</Text>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
function Checkbox({ checked, onChange, label, description }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: 0,
      background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
      fontFamily: 'Inter',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `2px solid ${checked ? T.accent : T.borderStrong}`,
        background: checked ? T.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {checked && <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <Text variant="body" weight={checked ? 600 : 500}>{label}</Text>
        {description && <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>{description}</Text>}
      </div>
    </button>
  );
}

/* ────────────────────────── TextField / Select ────────────────────────── */
function TextField({ label, value, onChange, placeholder, helperText }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <Text variant="caption" weight={600} tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</Text>}
      <input
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{
          height: 52, paddingInline: 16, borderRadius: 10,
          border: `1.5px solid ${T.borderStrong}`, background: T.bg,
          fontFamily: 'Inter', fontSize: 16, color: T.text,
          outline: 'none',
        }}
        onFocus={(e) => e.target.style.borderColor = T.accent}
        onBlur={(e) => e.target.style.borderColor = T.borderStrong}
      />
      {helperText && <Text variant="caption" tone="subtle">{helperText}</Text>}
    </div>
  );
}
function Select({ label, value, onChange, placeholder, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <Text variant="caption" weight={600} tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</Text>}
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          height: 52, paddingInline: 16, borderRadius: 10,
          border: `1.5px solid ${T.borderStrong}`, background: T.bg,
          fontFamily: 'Inter', fontSize: 16, color: value ? T.text : T.textSubtle,
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23718096' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center',
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ────────────────────────── ListItem ────────────────────────── */
function ListItem({ title, subtitle, leading, trailing, onClick, hideChevron }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, minHeight: 56,
      paddingBlock: 8, cursor: onClick ? 'pointer' : 'default',
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text variant="body" weight={500}>{title}</Text>
        {subtitle && <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>{subtitle}</Text>}
      </div>
      {trailing}
      {onClick && !hideChevron && !trailing && <Text variant="body" tone="subtle">›</Text>}
    </div>
  );
}

/* ────────────────────────── Cards: Resource / Counselor / Video ────────────────────────── */
const KIND_EMOJI = { article: '📄', pdf: '📎', video: '▶', guide: '🧭', link: '↗' };
function ResourceCard({ title, meta, kind = 'article', tag, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderRadius: 10,
      border: `1.5px solid ${T.border}`, background: T.bg,
      minHeight: 64, cursor: 'pointer',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 6,
        background: T.sunken, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>{KIND_EMOJI[kind] || '📄'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text variant="body" weight={600} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Text>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
          {meta && <Text variant="caption" tone="muted">{meta}</Text>}
          {tag && <Badge label={tag} tone="accent" />}
        </div>
      </div>
      <Text variant="body" tone="subtle">›</Text>
    </div>
  );
}

function CounselorCard({ initials, tint, headline, tags = [], availability, availableToday, rating, sessions, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.bg, borderRadius: 12, border: `1.5px solid ${T.border}`,
      padding: 16, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar size="lg" tint={tint} initials={initials} name={initials} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text variant="subtitle" style={{ flex: 1 }}>{initials}</Text>
            <Badge label={availability} tone={availableToday ? 'success' : 'neutral'} dot={availableToday} />
          </div>
          <Text variant="bodySm" tone="muted" style={{ marginTop: 4 }}>{headline}</Text>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map(t => <Badge key={t} label={t} tone="accent" />)}
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <Text variant="caption" tone="muted">★ {rating?.toFixed(1)}</Text>
        <Text variant="caption" tone="muted">{sessions}+ sessions</Text>
      </div>
    </div>
  );
}

function VideoCard({ title, duration, category, tint, onClick }) {
  return (
    <div onClick={onClick} style={{
      borderRadius: 10, background: T.bg, overflow: 'hidden',
      border: `1.5px solid ${T.border}`, cursor: 'pointer',
    }}>
      <div style={{
        aspectRatio: '16/9', position: 'relative',
        background: tint || `linear-gradient(135deg, ${T.accent}, ${T.accentHover})`,
      }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.accent, fontSize: 18, paddingLeft: 3,
          }}>▶</div>
        </div>
        <div style={{
          position: 'absolute', right: 8, bottom: 8,
          background: 'rgba(0,0,0,0.65)', padding: '3px 8px', borderRadius: 6,
          color: '#fff', fontSize: 12, fontWeight: 600,
        }}>{duration}</div>
      </div>
      <div style={{ padding: 12 }}>
        <Text variant="label" tone="subtle">{category}</Text>
        <Text variant="subtitle" style={{ marginTop: 4 }}>{title}</Text>
      </div>
    </div>
  );
}

/* ────────────────────────── Message bubble ────────────────────────── */
function MessageBubble({ from, author, authorTag, text, time, continues }) {
  const mine = from === 'me';
  return (
    <div style={{
      alignSelf: mine ? 'flex-end' : 'flex-start',
      maxWidth: '82%',
      marginTop: continues ? 4 : 10,
    }}>
      {author && !mine && !continues && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 4, paddingInline: 4 }}>
          <Text variant="caption" weight={600} tone="muted">{author}</Text>
          {authorTag && <Text variant="caption" weight={600} tone="accent">· {authorTag}</Text>}
        </div>
      )}
      <div style={{
        background: mine ? T.accent : T.bg, color: mine ? '#fff' : T.text,
        border: mine ? 'transparent' : `1.5px solid ${T.border}`,
        borderWidth: mine ? 0 : 1.5,
        padding: '10px 14px', borderRadius: 14,
        borderBottomRightRadius: mine ? (continues ? 14 : 4) : 14,
        borderBottomLeftRadius: !mine ? (continues ? 14 : 4) : 14,
        fontSize: 14, lineHeight: '20px',
      }}>{text}</div>
      {time && <Text variant="caption" tone="subtle" style={{
        marginTop: 4, paddingInline: 4, textAlign: mine ? 'right' : 'left',
      }}>{time}</Text>}
    </div>
  );
}

/* ────────────────────────── Bottom Tabs ────────────────────────── */
function BottomTabs({ items, activeKey, onChange }) {
  return (
    <div style={{
      display: 'flex', background: T.bg,
      borderTop: `1px solid ${T.border}`, flexShrink: 0,
    }}>
      {items.map((it) => {
        const active = it.key === activeKey;
        return (
          <button key={it.key} onClick={() => onChange(it.key)} style={{
            flex: 1, padding: '10px 4px 14px',
            background: 'transparent', border: 0, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            fontFamily: 'Inter',
          }}>
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 20, color: active ? T.accent : T.textMuted }}>{it.icon}</span>
              {it.badge > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -8,
                  minWidth: 16, height: 16, borderRadius: 8, background: T.danger,
                  paddingInline: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 10, fontWeight: 700,
                }}>{it.badge}</span>
              )}
            </div>
            <span style={{
              fontSize: 11, fontWeight: active ? 700 : 500,
              color: active ? T.accent : T.textMuted,
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  T, Text, Button, Badge, Avatar, Alert, Card, TopBar, BackButton, SectionHeader,
  RadioGroup, Checkbox, TextField, Select, ListItem,
  ResourceCard, CounselorCard, VideoCard, MessageBubble, BottomTabs,
});
