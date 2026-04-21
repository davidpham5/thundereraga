/**
 * Tether Design System — Design Tokens
 *
 * These tokens are extracted 1:1 from the "Layoff Crisis Support Wireframes"
 * Figma source. Colors are named semantically; raw ramps live in `palette`
 * and are not intended for direct consumption outside this file.
 */

// ─── Raw palette (matches Figma color metadata exactly) ────────────────────

const palette = {
  // Neutrals — cool slate (Chakra-style)
  neutral0:   '#FFFFFF',
  neutral25:  '#F7FAFC',   // rgb(247,250,252) — surface sunken
  neutral50:  '#EDF2F7',   // rgb(237,242,247) — muted surface / chat bubble
  neutral100: '#E2E8F0',   // rgb(226,232,240) — border
  neutral200: '#CBD5E0',   // rgb(203,213,224) — border strong
  neutral400: '#A0AEC0',   // rgb(160,174,192) — text subtle / placeholder
  neutral500: '#718096',   // rgb(113,128,150) — text muted
  neutral800: '#2D3748',   // near-ink
  neutral900: '#1A202C',   // rgb(26,32,44)    — primary text / ink

  // Primary — royal blue
  primary50:   '#EBF8FF',  // rgb(235,248,255) — soft tint (own-message bubble, info well)
  primary700:  '#2B6CB0',  // rgb(43,108,176)  — primary action / links
  primary800:  '#1A4A80',  // rgb(26,74,128)   — avatar fill variant
  primary900:  '#1A365D',  // rgb(26,54,93)    — deepest

  // Success — forest green
  success50:   '#F0FFF4',  // rgb(240,255,244) — success well
  success700:  '#1A6645',  // rgb(26,102,69)   — "Available", positive text

  // Warning — amber
  warning50:   '#FFFBEB',  // rgb(255,251,235) — warning banner
  warning700:  '#92400E',  // rgb(146,64,14)   — warning text
  warning800:  '#744210',  // rgb(116,66,16)   — avatar variant

  // Danger — red
  danger50:    '#FFF5F5',
  danger700:   '#C53030',  // rgb(197,48,48)   — destructive

  // Accent variants (used in avatars + category pills)
  purple700:   '#553C9A',  // rgb(85,60,154)
  pink700:     '#97266D',  // rgb(151,38,109)
  teal700:     '#285E61',  // rgb(40,94,97)

  transparent: 'transparent',
} as const;

// ─── Theme: light ──────────────────────────────────────────────────────────

export const lightTheme = {
  mode: 'light' as const,
  color: {
    // Surfaces
    bg:              palette.neutral0,
    surface:         palette.neutral0,
    surfaceSunken:   palette.neutral25,     // section backgrounds, filter bars
    surfaceRaised:   palette.neutral0,
    surfaceMuted:    palette.neutral50,     // chat bubbles from other, chips

    // Text
    text:            palette.neutral900,
    textMuted:       palette.neutral500,
    textSubtle:      palette.neutral400,
    textInverse:     palette.neutral0,
    textLink:        palette.primary700,
    textAccent:      palette.primary700,

    // Borders
    border:          palette.neutral100,
    borderStrong:    palette.neutral200,
    divider:         palette.neutral100,

    // Primary (brand blue — all CTAs, active tab, links)
    accent:          palette.primary700,
    accentHover:     palette.primary800,
    accentPressed:   palette.primary900,
    accentSoft:      palette.primary50,
    accentOn:        palette.neutral0,

    // Feedback
    success:         palette.success700,
    successSoft:     palette.success50,
    warning:         palette.warning700,
    warningSoft:     palette.warning50,
    danger:          palette.danger700,
    dangerSoft:      palette.danger50,

    // Focus ring
    focus:           palette.primary700,

    // Overlay (bottom sheet scrim)
    overlay:         'rgba(26, 32, 44, 0.48)',

    // Avatar fill options (seeded selection) — matches Figma's anonymous
    // identity palette for counselor avatars.
    avatarFills: [
      palette.primary800,
      palette.success700,
      palette.purple700,
      palette.warning800,
      palette.pink700,
      palette.teal700,
    ],
  },
};

// ─── Theme: dark ───────────────────────────────────────────────────────────

export const darkTheme = {
  mode: 'dark' as const,
  color: {
    bg:              '#0F1419',
    surface:         '#1A202C',
    surfaceSunken:   '#0F1419',
    surfaceRaised:   '#2D3748',
    surfaceMuted:    '#2D3748',

    text:            '#F7FAFC',
    textMuted:       '#A0AEC0',
    textSubtle:      '#718096',
    textInverse:     '#1A202C',
    textLink:        '#63B3ED',
    textAccent:      '#63B3ED',

    border:          '#2D3748',
    borderStrong:    '#4A5568',
    divider:         '#2D3748',

    accent:          '#3182CE',
    accentHover:     '#63B3ED',
    accentPressed:   '#90CDF4',
    accentSoft:      'rgba(49, 130, 206, 0.18)',
    accentOn:        '#FFFFFF',

    success:         '#48BB78',
    successSoft:     'rgba(72, 187, 120, 0.14)',
    warning:         '#ED8936',
    warningSoft:     'rgba(237, 137, 54, 0.14)',
    danger:          '#F56565',
    dangerSoft:      'rgba(245, 101, 101, 0.14)',

    focus:           '#63B3ED',
    overlay:         'rgba(0, 0, 0, 0.65)',

    avatarFills: [
      '#3182CE',
      '#48BB78',
      '#9F7AEA',
      '#ED8936',
      '#ED64A6',
      '#4FD1C5',
    ],
  },
};

// ─── Non-color tokens ──────────────────────────────────────────────────────

/**
 * Spacing scale — aligned to Figma's observed rhythm (4/8/12/16/20/24 …).
 * Use the `space` function in styles: `padding: space(4)` → 12.
 */
export const spaceScale = {
  0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 7: 24, 8: 32, 9: 40, 10: 48, 11: 64,
} as const;

/**
 * Spacing helper.
 *
 * Consumers can use either a callable form, `space(4)`, OR numeric indexing,
 * `space[4]`, OR semantic keys, `space.md`. All three yield the same pixel
 * value. The triple API keeps migration painless.
 */
type SpaceKey = keyof typeof spaceScale;
type SpaceFn = (<K extends SpaceKey>(k: K) => (typeof spaceScale)[K]) &
  typeof spaceScale & {
    xs: number; sm: number; md: number; lg: number; xl: number; xxl: number;
  };

const _space: any = (k: SpaceKey) => spaceScale[k];
Object.assign(_space, spaceScale);
_space.xs = spaceScale[2];
_space.sm = spaceScale[3];
_space.md = spaceScale[4];
_space.lg = spaceScale[5];
_space.xl = spaceScale[7];
_space.xxl = spaceScale[8];
export const space: SpaceFn = _space as SpaceFn;

/**
 * Radius scale — matches the Figma corner radii in use: 6 (buttons), 10
 * (inputs), 12 (cards), 15 (pills — use `pill` here), 20 (phone frame).
 */
export const radius = {
  none: 0,
  sm:   6,   // buttons, small chips
  md:   10,  // inputs, info wells
  lg:   12,  // cards, chat bubbles
  xl:   20,  // phone frame
  pill: 999, // filter pills, status dots
} as const;

/**
 * Typography — Figma uses Inter exclusively. Consuming apps should load
 * Inter via `@expo-google-fonts/inter` or a system fallback.
 *
 * Scale is derived from the top-used sizes in metadata:
 *   11/12/13/14/15/18/20/22px — mapped onto semantic roles below.
 */
export const typography = {
  family: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", Menlo, Consolas, monospace',
  },
  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },
  // Semantic scale (size / lineHeight-px / default weight / tracking)
  scale: {
    display:  { size: 22, lineHeight: 28, weight: '700' as const, letterSpacing: -0.2 },
    title:    { size: 20, lineHeight: 26, weight: '700' as const, letterSpacing: -0.1 },
    heading:  { size: 18, lineHeight: 24, weight: '700' as const, letterSpacing: 0 },
    subtitle: { size: 15, lineHeight: 20, weight: '700' as const, letterSpacing: 0 },
    body:     { size: 14, lineHeight: 20, weight: '400' as const, letterSpacing: 0 },
    bodySm:   { size: 13, lineHeight: 18, weight: '400' as const, letterSpacing: 0 },
    caption:  { size: 12, lineHeight: 16, weight: '400' as const, letterSpacing: 0 },
    label:    { size: 11, lineHeight: 14, weight: '700' as const, letterSpacing: 0.8 },  // eyebrow/caps
    micro:    { size: 10, lineHeight: 13, weight: '400' as const, letterSpacing: 0 },
  },
} as const;

export const shadow = {
  none: {
    shadowColor: 'transparent', shadowOpacity: 0, shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 }, elevation: 0,
  },
  sm: {
    shadowColor: '#1A202C', shadowOpacity: 0.05, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  md: {
    shadowColor: '#1A202C', shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  lg: {
    shadowColor: '#1A202C', shadowOpacity: 0.12, shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
} as const;

export const motion = {
  duration: { fast: 120, base: 200, slow: 320 },
  easing: {
    standard: 'ease-out',
    entrance: 'ease-out',
    exit:     'ease-in',
  },
} as const;

export const hitSlop = { small: 6, medium: 10, large: 14 } as const;

// ─── Exports ───────────────────────────────────────────────────────────────

export type Theme = typeof lightTheme;
export const themes = { light: lightTheme, dark: darkTheme };
export { palette };
