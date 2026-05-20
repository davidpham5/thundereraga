# Desktop Onboarding — Design

**Date:** 2026-05-07
**Surface:** `prototype/desktop.html` (browser prototype, not React Native)
**Status:** Approved for implementation planning

## Goal

Bring the existing 7-step intake flow from the mobile prototype to the desktop prototype, so the desktop demo shows a complete first-run experience (welcome → triage → handle → safety → location → consent → confirm) before landing in the dashboard. Content and routing logic stay identical to mobile; only the layout adapts to the larger canvas.

## Decisions

| Question | Decision |
|---|---|
| Entry point | Auto-gate `desktop.html`. If `localStorage` has no handle, render onboarding; otherwise render the app. |
| Step structure | 1:1 with mobile's 7 steps. No consolidation. |
| Layout | Centered card on the muted (`T.sunken`) canvas. No sidebar, no Tweaks panel during onboarding. |
| Progress | 7-segment stepper above the card. |
| Reset path | Both: `?reset` query clears localStorage; `#onboarding` hash forces onboarding even when a handle exists; Profile gets a "Reset onboarding" link. |

## Visual structure

```
┌──────────────────────────────────────────────────────────┐
│  [S] StandStrong                                         │  ← brand lockup, top-left, 24px from edges
│                                                          │
│                                                          │
│              ▓▓ ▓▓ ▓▓ ░░ ░░ ░░ ░░                        │  ← 7-segment stepper, centered above card
│                                                          │
│              ┌──────────────────────────┐                │
│              │ ← Back                    │                │
│              │                           │                │
│              │   Title (display)         │                │
│              │   subtitle (muted)        │                │
│              │                           │                │
│              │   [ body content ]        │                │  ← centered card on T.sunken canvas
│              │                           │                │
│              │   [ Primary CTA ]         │                │
│              │   [ Secondary CTA ]       │                │
│              └──────────────────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Canvas
- Full viewport. Background: `T.sunken`.
- No sidebar, no Tweaks panel, no app chrome.

### Brand lockup (top-left)
- `LogoMark` (size 30, letter from `t.brand[0]`) + brand name + tagline. Reuses the existing component from `desktop-shell.jsx`.
- Positioned `top: 24, left: 32`.

### Stepper
- Local component in `desktop-onboarding.jsx`.
- Renders 7 segments in a row, each ~32px wide × 4px tall, 6px gap, `borderRadius: 2`.
- Done segments: `T.accent`. Current segment: `T.accent` with a 4px-wide variant (slight emphasis). Pending: `T.border`.
- Segments are non-interactive (decorative).
- Centered horizontally; sits 56px from the top of the viewport.

### Card (`OnbCard`)
- `background: T.bg`, `borderRadius: 16`, `boxShadow: 0 12px 32px rgba(0,0,0,0.06)`, `border: 1px solid T.border`.
- Inner padding: 36px horizontal, 32px vertical.
- Width: 520px for emotional/single-input steps (Welcome, CreateHandle, Location, Confirm); 640px for content-heavy steps (Triage, Safety, Consent).
- Vertically centered in the remaining viewport space below the stepper. If content exceeds viewport height, the card itself stays anchored and content within the card scrolls (overflow `auto` on the body region).
- Card header: optional "← Back" text link at the top-left, then `Text variant="display"` title (centered or left-aligned per step), then optional muted subtitle.
- Card footer: primary CTA (full-width inside card), then optional secondary CTA below it.

## Per-step layout

All copy, validation, and persona-routing logic match mobile (`prototype/screens-onboarding.jsx`) verbatim unless noted.

### 1. Welcome (520px)
- Centered layout inside the card.
- Big circular brand mark (72px, accent fill, white "S") above the title.
- `Text variant="display"` "StandStrong" + muted tagline.
- Three Badges in a row: "Free forever", "Anonymous", "Peer-led".
- Three stacked CTAs: primary "I just got laid off", secondary "I have an account", ghost "I'm preparing, just in case". Each routes to `triage` with the corresponding `mode`.
- Caption at the bottom: privacy reassurance.
- No "← Back" (entry step).

### 2. Triage (640px)
- Title left-aligned: "We'll personalize what you see."
- Subtitle: "Your answers are private and can be changed anytime."
- `RadioGroup` for situation (4 options).
- `ANYTHING URGENT? (OPTIONAL)` label + 5 `Checkbox` rows in a single column.
- Conditional `Alert` (info tone) when `struggling` is checked.
- Primary "Continue" + ghost "Skip for now". Both call the same `route()` function from mobile to compute the persona.

### 3. Create Handle (520px)
- Title: "Pick a name to go by."
- `TextField` with the random handle pre-filled.
- Two badges below: "Randomly generated", "Available" (success, with dot).
- `Alert` (info): "Why anonymous?" message.
- Primary "Continue" + secondary "Generate another".

### 4. Safety (640px)
- Title: "Before we continue."
- Subtitle: "Four things we promise, and one thing we ask."
- 4 outline `Card`s, each with a green checkmark badge and pledge title + supporting line.
- 1 soft accent `Card`: "WE ASK ONE THING" — be respectful.
- Primary "I understand — continue".

### 5. Location (520px)
- Title: "We'll show state-specific resources."
- `Select` of 10 states (same options as mobile).
- `Alert` (info): "Only your state is used for routing."
- Primary "Continue" (disabled until selection) + ghost "Prefer not to say".

### 6. Consent (640px)
- Title: "Agreements."
- 3 outline `Card`s wrapping `Checkbox`es: ToS (required), Privacy (required), Analytics (optional, default on).
- Primary "Create my account" disabled until both required boxes are checked.

### 7. Confirm (520px)
- Centered: success circle (80px, `T.successSoft` background, `T.success` checkmark).
- "Welcome." display text.
- "You're signed in as" + handle badge.
- Heading "What would help right now?"
- Three CTAs: primary "Open my dashboard", secondary "Chat with a volunteer now", ghost "Browse resources first".
- Each CTA writes the final state to `localStorage` (handle, persona, screen) and unmounts onboarding so the existing app shell renders, landing on the chosen `screen`.

## File layout

### New: `prototype/desktop-onboarding.jsx`
Exports the following to `window`:
- `DesktopOnboarding` — orchestrator. Owns step state (`step`: 1..7) and form state (`{ handle, persona, triageStatus, triageFlags, stateCode, triageMode }`). Renders the canvas, brand lockup, stepper, and the active step component. Provides each step with `goto`, `back`, `state`, `setState`, `complete(screen)`.
- `Stepper` — local progress indicator.
- `OnbShell` — the canvas + brand lockup + stepper wrapper. Takes `step`, `total`, children.
- `OnbCard` — the centered card. Takes `width`, `back`, children.
- 7 step components: `OnbWelcome`, `OnbTriage`, `OnbCreateHandle`, `OnbSafety`, `OnbLocation`, `OnbConsent`, `OnbConfirm`.

### Modified: `prototype/desktop.html`
- Add `<script type="text/babel" src="desktop-onboarding.jsx"></script>` after `desktop-screens.jsx`, before `desktop-app.jsx`.

### Modified: `prototype/desktop-app.jsx`
- On mount: read `window.location.search` for `reset` — if present, clear `standstrong:desktop:state` from `localStorage` and `history.replaceState` to strip the query.
- Compute `forceOnboarding = window.location.hash === '#onboarding'`.
- Compute `needsOnboarding = !saved.handle || forceOnboarding`.
- If `needsOnboarding`: render `<DesktopOnboarding onComplete={(finalState, landingScreen) => { ...persist; setHandle; setPersona; setScreen(landingScreen); strip hash }} />` instead of the sidebar+main shell.
- Tweaks panel only renders when not in onboarding (matches "minimal canvas" decision).
- The existing `useEffect` that writes to `localStorage` keeps working as-is once onboarding completes.

### Modified: `prototype/desktop-screens.jsx`
- `DesktopProfile` gets a small "Reset onboarding" text link in the footer area (uses `T.textMuted`, underline on hover). Clicking it: clear `localStorage`, navigate to `desktop.html?reset` (full reload).

## Persona routing
Lifted verbatim from mobile `Triage.route()`:
- `visa_concern` → `priya`
- `discrimination` → `james`
- `severance_deadline` → `maya`
- `laid_off` + (`benefits_ending` | `struggling`) → `david`
- `imminent` | `not_affected` → `kiesha`
- fallback → `maya`

The chosen persona is written to localStorage on Confirm so the dashboard's persona-aware copy keeps working.

## State shape (during onboarding)
```js
{
  step: 1..7,
  triageMode: 'laid_off' | 'returning' | 'preparing',  // from Welcome CTA
  triageStatus: 'laid_off' | 'imminent' | 'not_affected' | 'returning',
  triageFlags: string[],
  handle: string,
  persona: 'maya' | 'david' | 'priya' | 'james' | 'kiesha',
  stateCode: string,  // empty if "Prefer not to say"
}
```

On Confirm, this is reduced to what `desktop-app.jsx` already persists: `{ persona, handle, screen }`.

## Out of scope
- No new primitives. The stepper, card chrome, and brand lockup are local to onboarding.
- No analytics, no real auth, no real persistence beyond `localStorage`.
- Mobile onboarding is unchanged.
- Tablet / responsive breakpoints are not addressed; desktop assumes ≥ ~900px viewport. Below that, the card simply tightens to viewport width minus 32px padding.
- No animation between steps beyond default browser repaint (consistent with the rest of the prototype).

## Testing plan
- Manual: `npm run web`, verify each step renders, validates, and routes correctly. Reach Confirm and verify dashboard renders with the chosen persona.
- Manual: Visit `desktop.html?reset` — verify localStorage is cleared and onboarding starts at step 1.
- Manual: With a saved handle, visit `desktop.html#onboarding` — verify onboarding renders.
- Manual: From dashboard → Profile → "Reset onboarding" — verify reset.
- Manual: Each persona-routing branch (toggle different triage flag combinations) lands on the expected `state.persona` on Confirm.
