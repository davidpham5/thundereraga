# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Thundereraga is a rapid-response web app to intake workers who have been subject to a mass layoff and organize them to build solidarity, community, and power.

## Tech Stack

- **Mobile app**: React Native (Expo, managed workflow)
- **Design system**: "Tether" — shared semantic token sheet driving light/dark modes
- **Type**: Figtree (warm humanist), JetBrains Mono for code/metadata
- **Gallery**: Browser-based component gallery (`gallery/index.html`) — a Storybook-style DOM mirror for reviewing components without a device
- **Prototype**: Interactive clickable prototype (`prototype/index.html`) — full app flow (onboarding → 5-tab app) rendered in an iOS phone frame, with persona switching and a dev-nav jump panel

## Structure

```
gallery/          # In-browser component gallery (open index.html directly)
  index.html      # Shell — loads React + Babel from CDN, references the two JSX files
  components.jsx  # DOM mirrors of every RN component; exports all to window.*
  app.jsx         # Gallery sections (Foundations, Primitives, Forms, Nav, Profile)
prototype/        # Clickable in-browser prototypes — mobile + desktop, sharing data + primitives
  index.html              # Mobile entry — React + Babel from CDN, iOS phone frame
  app.jsx                 # Mobile router, phone frame, Dev Nav, persona rotation
  screens-onboarding.jsx  # Mobile: Welcome → Triage → Handle → Safety → Location → Consent → Confirm
  screens-tabs.jsx        # Mobile: Dashboard, Chat, Counselors, Resources, Profile
  desktop.html            # Desktop entry — sidebar layout, no phone frame
  desktop-app.jsx         # Desktop orchestrator + Tweaks wiring
  desktop-shell.jsx       # Sidebar, page chrome (PageHeader, PageWrap), nav icons
  desktop-screens.jsx     # Desktop versions of each tab screen
  tweaks-panel.jsx        # Reusable Tweaks panel (brand, accent, density…)
  data.jsx                # Mock personas, resources, counselors, videos (shared)
  primitives.jsx          # DOM ports of src/components/* — Text, Button, Card… (shared)
src/              # React Native source (to be scaffolded)
  tokens.ts       # Palette + light/dark themes, type scale, spacing, radii, shadows
  ThemeProvider.tsx
  components/     # Text, Button, Card, Badge, Avatar, Divider, TextField, Select,
                  # RadioGroup, Checkbox, Toggle, TopBar, BottomTabs
  utils/
    generateHandle.ts  # Anonymous handles e.g. "Portland-Engineer-42"
```

## Design tokens

All visual values flow from semantic token names — never raw hex in component code. `tokens.ts` is the source of truth; `gallery/components.jsx` mirrors the same token structure for browser review.

## Reviewing the gallery & prototype

```
npm run gallery    # serves gallery/   at http://localhost:4242
npm run prototype  # serves prototype/ at http://localhost:4243        (mobile)
npm run web        # serves prototype/ at http://localhost:4244/desktop.html
```

Don't open the `index.html` files via `file://` — the pages load `.jsx` files over HTTP for in-browser Babel transpile, which browsers block on `file://`. Both scripts use `npx serve` (no install step).
