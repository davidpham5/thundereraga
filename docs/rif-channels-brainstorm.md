# RIF Channels — Workflow Brainstorm (Checkpoint)

**Status:** In discussion — design exploration, nothing built yet.
**Last updated:** 2026-05-20
**Resume at:** the "Open questions" section.

---

## Goal

Turn Thundereraga from a **service directory** (Resources hands you content; Chat/Counselors hand you a person) into an **organizing engine**. Funnel users who are passively consuming layoff resources into spaces where they self-organize around specific issues — visa, COBRA/healthcare, compensation, job search — and eventually take collective action.

The bridge concept: **"jobs to be done."** People won't join a channel to "build power" (too abstract). They join to *get a specific thing done*. Power is the byproduct.

---

## The funnel (overall vision)

```
read a resource → realize others have the same job → co-work it in a channel → escalate to collective action
```

Five stages:
1. **Trigger** — many small entry points, not one big door (resource-card footers, dashboard cards, end-of-chat prompts, persona banners).
2. **Match** — a "What do you need to get done?" job picker, pre-filled from triage answers.
3. **Preview** — show the channel (members, activity, what it has accomplished) *before* asking to join.
4. **The channel** — see "key idea" below.
5. **Escalate** — group counselor sessions, pooled severance benchmarks, collective asks.

**Key idea for the channel itself:** make the "job to be done" a *literal shared checklist*. A channel is a co-worked task list, not just a chat room. Each member tracks their own progress and sees the aggregate ("11/31 elected COBRA"). This makes the JTBD framing concrete, converts lurkers into participants (checking a box < posting), and gives the channel a spine so it never feels like an empty Slack.

---

## Decision: pursue Concept C — Same-RIF channels

Three concepts were considered:
- **A — Inline upsell:** no new tab; channels grow from "discuss with others" footers. Lowest risk.
- **B — Organize tab:** channels-as-jobs become a first-class tab. Boldest, most on-mission.
- **C — Same-RIF channels:** channels scoped to a specific company layoff event. **← chosen.** Most collective *power* (group negotiation within one layoff), but the hardest trust/verification problem.

The rest of this doc works through C's central challenge: **vetting.**

---

## The vetting problem

A channel scoped to "Acme · Oct 2025 RIF" must admit people actually in that layoff — without breaking the app's anonymity model — while keeping out HR, company lawyers, recruiters, journalists, and trolls.

### Reframes that unlock it
1. **Stop verifying identity. Verify membership in an event.** "I was in the Acme Oct 2025 RIF" is a *fact*, provable without proving "I am Jane Doe." Identity and anonymity are in direct conflict; event-membership and anonymity are not.
2. **Verify the cohort, not the individual.** One claim is unverifiable; twelve coherent independent claims are hard to fake.
3. **Design for graceful infiltration.** You won't keep everyone out 100%. Make it not matter — gate the sensitive content; assume the open room is observed.

---

## Tiered trust (not a binary gate)

Gate *capabilities* by tier, not access by a yes/no door:

| Tier | How you reach it | Unlocks |
|------|------------------|---------|
| **T0 — Visitor** | Just signed up | General layoff support, resources |
| **T1 — Same event (claimed)** | Picked your layoff event + passed a light corroboration quiz | Read & post in the company channel |
| **T2 — Corroborated** | Structured answers match the cohort consensus | See others' severance terms, the benchmark, pinned strategy |
| **T3 — Action cell** | T2 + vouched by an existing member, or host-confirmed | Join collective-negotiation sub-room, sign a group ask |

The public channel lives at **T1** (solidarity, venting, resources — low harm if infiltrated). The protected content — who's negotiating, the collective ask, pooled numbers — sits at **T3** in a smaller cell. You're building **a low-stakes lobby in front of a high-stakes cell.**

---

## The admin/member asymmetry (current direction)

**Identified admin, anonymous members.** The admin de-anonymizes themselves to anchor trust; their colleagues join under anonymous handles and ride on the admin's verification.

Why it works: it moves all the verification friction onto the **person actually motivated to absorb it** (the organizer), and leaves the just-laid-off, skittish member with an easy path. Resolves the low-gate-vs-high-gate dilemma — high gate on the admin, low gate on members.

### Three-layer trust model

```
  Thundereraga platform  ──── root of trust (vetted-volunteer review)
          │ verifies
  Verified Host (admin)  ──── identified: LinkedIn + layoff proof (+ GitHub)
          │ vouches for the space, invites, reviews outliers
  Members                ──── anonymous handles; trust the space via the
                              host badge; corroborate each other lightly
```

Accountability flows up; trust flows down. Members never de-anonymize.

### LinkedIn vs. GitHub — they prove different things

| | Proves | Role | Limit |
|---|---|---|---|
| **LinkedIn** | "I worked at *this company*" — **affiliation** | **Primary** admin signal | API no longer exposes work history; v1 = admin pastes profile URL, vetted volunteer reviews |
| **GitHub** | "I'm an established real person" — **personhood** | Optional admin booster (auto-fast-track) | Says nothing about employer; tech-only |

Keep a **non-social fallback** (doc upload + short volunteer interview) so non-tech layoffs and people without LinkedIn can still host. Mission is "mass layoff," not "tech layoff."

---

## Verification toolbox (ranked)

- **Cohort corroboration (primary)** — new joiner privately answers 3–4 *structured* questions (layoff date, site, severance formula, role band, who announced it); system compares to cohort consensus. Match → auto-verify; outlier → review. Anonymity-preserving; strengthens as the channel grows.
- **Severance agreement as shared secret** — RIF paperwork is near-identical; the week-multiplier, deadline, benefits vendor form an insider fingerprint *and* double as benchmark data.
- **Experiential questions** — mix lived facts ("all-hands on Zoom or in person?") with official ones; HR knows official, less so lived.
- **WARN Act filings** — public state filings; pre-seed channel "events" so they're hard to fake.
- **Vouching** — accelerator only, never the front gate; cap per member; decay weight if a vouchee is flagged.
- **Document upload** — last resort; ephemeral processing, store only a boolean + event hash, never the doc.
- **Private invite link** — the admin's social graph *is* a verification signal; only real ex-colleagues get the link.

---

## Key risks

- **The admin is the honeypot.** LinkedIn proves employment, NOT separation — HR works at Acme too. Mitigations: (1) admins prove *separation* (WARN event + layoff doc); (2) mandatory human review at the admin tier — the one checkpoint that can't be automated; (3) require 2+ co-admins before T3 unlocks; (4) structural containment (sensitive content stays in the gated cell).
- **Don't force the admin public.** Default to verified-to-platform, pseudonymous-to-members ("Verified Host · former Acme employee"). Real-name display is opt-in. Otherwise only the reckless will host.
- **Single point of failure.** One admin burns out / lands a job / loses their account. Require co-admins from day one; support succession (promote a corroborated member); give RIF channels a lifecycle (archive or convert to alumni/job-search channel when the negotiation window closes).
- **Cold start** — the founding cohort can't corroborate each other. Each WARN-seeded event gets a vetted volunteer host as backstop; founders verify via doc/interview; flip to automatic corroboration once ~5 corroborated members exist.

---

## The two flows (sketch)

**Admin (heavy, motivated):** Start a channel → "verifying you is what lets colleagues join *without* verifying themselves" → connect LinkedIn → optional GitHub → confirm layoff (WARN event + proof) → volunteer review → **Verified Host** → set up space, invite co-admin → get invite link.

**Member (light, skittish):** Open invite link → see Verified Host badge + what the space is → keep anonymous handle → ~60-second corroboration quiz → in (T1 → T2 on match).

---

## Open questions (resume here)

1. **What does GitHub buy a *member*, if anything?**
   - Option A — admin-only: GitHub/LinkedIn are purely admin-tier; members stay social-graph + quiz. Cleanest anonymity story.
   - Option B — optional member personhood: a member *can* link GitHub privately to fast-track to T2, never required. More flexible, adds de-anonymization temptation.
2. Friction philosophy confirmed as "low gate / gated payload" via the admin asymmetry — but confirm the member quiz length and whether T1 should be even lower (read-only with no quiz?).
3. How does this surface in the existing 5-tab app? (Concept A's inline entry points still apply as the *trigger* layer — TBD how Same-RIF channels are discovered.)
4. Channel lifecycle specifics — archive vs. convert; what happens to pooled data.
5. Existing app already has `Anonymous` / `Verified` badges and a latent `channel` screen (James persona's "Company Channel" quick action) — reuse these.

## Next steps (not yet started)

- [ ] Resolve open question #1.
- [ ] Turn the admin + member flows into a screen-by-screen spec.
- [ ] Then build into the mobile prototype (`prototype/screens-*.jsx`).

---

## Reference — relevant existing code

- `prototype/data.jsx` — personas; James already has a `channel` quick action ("Company Channel · Same-RIF thread"); `community-forum` resource exists.
- `prototype/screens-tabs.jsx` — 5 tabs (Dashboard, Chat, Counselors, Resources, Profile); Profile shows `Anonymous` + `Verified` badges.
- Counselors use a "vetted volunteer" model — reuse it for host review.
