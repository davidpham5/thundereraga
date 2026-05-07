# StandStrong

A rapid-response app to intake workers who have been subject to a mass layoff and help them build solidarity, community, and power.

> **Repo name vs. app name:** The GitHub repo is `thundereraga` (a working codename). The user-facing brand is **StandStrong**. They refer to the same project.

---

## For QA testers — start here

You can review StandStrong in **four** ways. Pick whichever matches what you're trying to test:

| You want to…                                                    | Use this                                       | Needs a phone? |
| --------------------------------------------------------------- | ---------------------------------------------- | -------------- |
| Click through the full mobile flow in a browser (fastest)       | **Mobile prototype** (`npm run prototype`)     | No             |
| See the desktop-adapted layout in a browser                     | **Desktop prototype** (`npm run web`)          | No             |
| Review individual UI components in isolation                    | **Gallery** (`npm run gallery`)                | No             |
| Test the real React Native app on a phone (iOS / Android)       | **Expo dev server** (`npm start`)              | Yes            |

If you've never used Expo before, jump to [What is Expo Go?](#what-is-expo-go) before running `npm start`.

### One-time setup

You need [Node.js](https://nodejs.org/) 20 or newer. Verify with:

```bash
node --version   # should print v20.x or higher
```

Then in the project root:

```bash
npm install
```

This pulls down everything the app, gallery, and prototype need. It can take a few minutes the first time.

---

## Running the mobile prototype (clickable HTML, no phone)

The mobile prototype is a self-contained browser app that mirrors the real iOS/Android screens. **This is the easiest way to QA the mobile flow.**

```bash
npm run prototype
```

Open <http://localhost:4243> in any modern browser. You'll see an iOS phone frame containing the full app. Use the **Dev Nav** panel on the side to jump to any screen, and the persona switcher to view the app as different test users.

> ⚠️ Don't double-click `prototype/index.html` to open it via `file://`. The page loads `.jsx` files over HTTP for in-browser transpile, and browsers block that on `file://`.

---

## Running the web prototype (desktop-adapted layout)

A separate prototype built specifically for desktop browsers — **not** the mobile screens stretched wide. Persistent left sidebar nav, two-column content where it earns its keep (Dashboard, Chat, Counselors, Resources, Profile), and a Tweaks panel for live brand / accent / density adjustments. Same tokens and primitives as mobile.

```bash
npm run web
```

Open <http://localhost:4244/desktop.html>.

> The mobile and web prototypes are **two distinct designs** of the same product, not two renders of the same code. If a flow looks different between them, that's intentional — the desktop layout is its own design pass.
>
> The mobile and desktop prototypes share `data.jsx` and `primitives.jsx` and live in the same `prototype/` folder, so `npm run prototype` (port 4243) and `npm run web` (port 4244) serve the same files — they just default to `index.html` (mobile) and `desktop.html` (desktop) respectively.

---

## Running the component gallery

The gallery shows every UI primitive (buttons, cards, form fields, etc.) in light and dark mode side-by-side. Useful when you're checking visual regressions on a single component.

```bash
npm run gallery
```

Open <http://localhost:4242>.

---

## Running the real app (Expo Go on a phone)

This is the actual React Native codebase running on a real device. Use this when you need to verify behaviors that the prototypes can't fake — gestures, native scroll feel, Safe Area insets, real keyboard interactions, etc.

```bash
npm start
```

You'll see a QR code and a menu of keyboard shortcuts. Wait until it prints `Logs for your project will appear below`, then follow the steps below.

> **Why no `w`-for-web option here?** Expo *does* support `npm start` → press `w` to render the React Native code in a browser via `react-native-web`. We've intentionally left that out of the QA flow because the result is the mobile layout stretched wide — not a real desktop experience. For desktop QA, use `npm run web` (the web prototype) instead.

### What is Expo Go?

**Expo Go** is a free app from Expo (the framework StandStrong is built on). Think of it as a sandbox player: instead of compiling and installing StandStrong onto your phone the way the App Store does, Expo Go loads the JavaScript bundle from your laptop over Wi-Fi and runs it. This means **you don't need Xcode, Android Studio, or any developer setup — just the Expo Go app and a Wi-Fi connection shared with your laptop.**

Trade-off: Expo Go can only run features that Expo supports out of the box. For StandStrong's current scope, that's everything.

### Steps

1. Install **Expo Go** on your phone:
   - iPhone: <https://apps.apple.com/app/expo-go/id982107779>
   - Android: <https://play.google.com/store/apps/details?id=host.exp.exponent>
2. Make sure your phone and laptop are on **the same Wi-Fi network**. (Corporate / guest networks that isolate devices will not work — use a personal hotspot if you hit this.)
3. Run `npm start` in the project root if it isn't already running.
4. **iPhone:** open the Camera app and point it at the QR code in the terminal. A banner will appear — tap it to open in Expo Go.
   **Android:** open Expo Go itself and tap "Scan QR code."
5. The app bundles (~30 seconds the first time) and launches on your phone. Reload anytime by shaking the phone and tapping "Reload."

### Troubleshooting Expo Go

| Symptom                                   | Likely fix                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| QR scan does nothing                      | Phone is on a different Wi-Fi than the laptop.                                                |
| "Network response timed out"              | Same as above, or VPN on the laptop is blocking the local server. Disconnect VPN and retry.   |
| App opens but is blank / red error screen | In the terminal, press `r` to reload. If it persists, stop (`Ctrl+C`) and re-run `npm start`. |
| "Something went wrong" in Expo Go         | Update Expo Go from the App Store / Play Store — the SDK version moves regularly.             |

---

## Architecture

```
thundereraga/
├── app/                      # Expo Router file-based routes (the real app)
│   ├── _layout.tsx           # Root layout, wraps everything in ThemeProvider
│   ├── index.tsx             # Entry / splash → routes to onboarding or tabs
│   ├── onboarding/           # 7-step intake flow
│   │   ├── triage.tsx        # Are you safe / what just happened?
│   │   ├── create-handle.tsx # Anonymous handle e.g. "Portland-Engineer-42"
│   │   ├── safety.tsx        # Safety-planning prompts
│   │   ├── location.tsx      # Coarse location for resource matching
│   │   ├── consent.tsx       # Data-sharing consent
│   │   ├── confirm.tsx       # Review + finish
│   │   └── sign-in.tsx       # Returning-user path
│   └── tabs/                 # Main app, 5-tab bottom nav
│       ├── dashboard.tsx
│       ├── chat.tsx
│       ├── counselors.tsx
│       ├── resources.tsx
│       └── profile.tsx
│
├── src/                      # Shared library code
│   ├── tokens.ts             # Design tokens — palette, type, spacing, radii, shadows
│   ├── ThemeProvider.tsx     # Light/dark theme context
│   ├── components/           # UI primitives (Text, Button, Card, TextField,
│   │                         #   BottomTabs, CounselorCard, MessageBubble, …)
│   ├── data/                 # Mock data fixtures
│   └── utils/                # Helpers (e.g. generateHandle.ts)
│
├── gallery/                  # Browser-only component gallery (DOM mirror of src/components)
│   ├── index.html
│   ├── components.jsx
│   └── app.jsx
│
├── prototype/                # Browser-only clickable prototypes (mobile + desktop)
│   ├── index.html            # Mobile prototype entry (iOS phone frame, full flow)
│   ├── app.jsx               # Mobile router, iOS phone frame, Dev Nav
│   ├── screens-onboarding.jsx
│   ├── screens-tabs.jsx
│   ├── desktop.html          # Desktop prototype entry (sidebar layout)
│   ├── desktop-app.jsx       # Desktop orchestrator + Tweaks wiring
│   ├── desktop-shell.jsx     # Sidebar, page chrome, nav icons
│   ├── desktop-screens.jsx   # Desktop versions of each tab screen
│   ├── tweaks-panel.jsx      # Reusable Tweaks panel (brand, accent, density…)
│   ├── data.jsx              # Mock personas, resources, counselors, videos (shared)
│   └── primitives.jsx        # DOM ports of src/components/* (shared)
│
├── app.json                  # Expo config (name, slug, scheme, plugins)
├── package.json
└── CLAUDE.md                 # Internal notes for the AI coding assistant
```

### Tech stack

- **React Native** via **Expo** (managed workflow, SDK 54) — single codebase for iOS and Android.
- **Expo Router** — file-based routing; folders under `app/` map directly to screens.
- **Tether** — the project's design system, defined in `src/tokens.ts`. All colors, type sizes, spacing, and radii are referenced by semantic name (e.g. `theme.color.surface`, `theme.space.md`) — never raw hex. The gallery and both prototypes mirror the same token structure so visual review stays consistent across surfaces.
- **Type:** Figtree (UI), JetBrains Mono (code/metadata).
- `react-native-web` is a project dependency but is **not** part of the QA flow — see the note in [Running the real app](#running-the-real-app-expo-go-on-a-phone) for why.

### How the four surfaces relate

```
                       src/tokens.ts
                      (design tokens)
                             │
      ┌──────────────┬───────┴───────┬─────────────────────┐
      ▼              ▼               ▼                     ▼
   app/ + src/    gallery/       prototype/             prototype/
  (real RN app)  (DOM mirror,   index.html             desktop.html
                  components)   (mobile flow)          (desktop design)
```

The gallery and prototypes are **DOM mirrors** — they re-implement the same components in plain HTML/CSS so reviewers can click through without an Xcode/Android setup. Tokens are the contract that keeps them visually aligned with the real app.

The mobile prototype (`index.html`) and desktop prototype (`desktop.html`) are **two separate designs**, not two views of one design. The desktop prototype is a deliberate design pass (persistent sidebar nav, two-column content) rather than a responsive resize of mobile. Both live in `prototype/` and share `data.jsx` + `primitives.jsx`.

---

## Common scripts

| Command             | What it does                                                          |
| ------------------- | --------------------------------------------------------------------- |
| `npm start`         | Start the Expo dev server (phone via Expo Go)                         |
| `npm run ios`       | Same as `npm start` but auto-opens iOS Simulator (requires Xcode)     |
| `npm run android`   | Same but auto-opens Android emulator (requires Android Studio)        |
| `npm run gallery`   | Serve the component gallery on <http://localhost:4242>                |
| `npm run prototype` | Serve the mobile clickable prototype on <http://localhost:4243>       |
| `npm run web`       | Serve the desktop prototype on <http://localhost:4244/desktop.html>   |

---

## Reporting bugs

When filing an issue, please note:

- Which surface you're testing — **mobile prototype**, **desktop prototype**, **gallery**, **iOS (Expo Go)**, or **Android (Expo Go)**.
- Device + OS version (e.g. "iPhone 14, iOS 17.4" or "Chrome 124 on macOS 14").
- Steps to reproduce, expected vs. actual.
- Screenshot or screen recording if visual.
