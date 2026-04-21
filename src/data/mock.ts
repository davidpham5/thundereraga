/**
 * Mock data for StandStrong. All five personas, counselors, resources, threads,
 * and videos live here so screens can import and demo any branch.
 *
 * When the real API lands, swap imports in screens to hooks (e.g.
 * `usePersona()`, `useCounselors()`) that return the same shapes.
 */

export type UrgencyFlag =
  | "severance_deadline"
  | "visa_concern"
  | "benefits_ending"
  | "discrimination"
  | "struggling";

export type EmploymentStatus =
  | "laid_off" // officially laid off
  | "imminent" // think may be laid off soon
  | "not_affected" // preparing just in case
  | "returning"; // has existing account

export type Persona = {
  id: "maya" | "david" | "priya" | "james" | "kiesha";
  displayName: string; // anonymous handle
  realName: string; // never shown in UI — audit/dev only
  age: number;
  role: string;
  employmentStatus: EmploymentStatus;
  urgencyFlags: UrgencyFlag[];
  company: string;
  state: string; // two-letter
  avatarTint: string; // hex — matches Figma avatar variants
  avatarEmoji: string;
  emotion: string;
  situation: string;
  keyNeeds: string[];
  dashboardBanner: {
    tone: "warning" | "danger" | "info" | "success";
    title: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  quickActions: Array<{
    key: string;
    label: string;
    sublabel: string;
    tint: "blue" | "green" | "slate" | "amber" | "red";
    href: string;
  }>;
  recommendedResources: string[]; // resource ids
};

export const personas: Record<Persona["id"], Persona> = {
  maya: {
    id: "maya",
    displayName: "Portland-Eng-42",
    realName: "Maya Chen",
    age: 29,
    role: "Software Engineer",
    employmentStatus: "laid_off",
    urgencyFlags: ["severance_deadline"],
    company: "TechCo",
    state: "OR",
    avatarTint: "#1A4A80",
    avatarEmoji: "🧑‍💻",
    emotion: "Anxious, identity-shaken, determined to protect herself",
    situation:
      "Received severance offer 3 days ago. Has 18 days left to sign. Equity clawback clause she doesn't understand.",
    keyNeeds: [
      "Peer counselor review NDA + equity clauses",
      "Anonymous severance review session",
      "Connect with laid-off colleagues from same company",
      "WARN Act rights explained clearly",
    ],
    dashboardBanner: {
      tone: "warning",
      title: "Severance deadline in 18 days",
      body: "Review your offer with a peer counselor before you sign.",
      ctaLabel: "Book a review session",
      ctaHref: "/tabs/counselors",
    },
    quickActions: [
      {
        key: "chat",
        label: "Chat Hotline",
        sublabel: "Available now",
        tint: "blue",
        href: "/tabs/chat",
      },
      {
        key: "book",
        label: "Book Counselor",
        sublabel: "Today",
        tint: "green",
        href: "/tabs/counselors",
      },
      {
        key: "state",
        label: "State Guide",
        sublabel: "OR resources",
        tint: "slate",
        href: "/tabs/resources/state",
      },
    ],
    recommendedResources: ["warn-act", "nda-review", "severance-101"],
  },
  david: {
    id: "david",
    displayName: "SF-PM-19",
    realName: "David Park",
    age: 34,
    role: "Product Manager",
    employmentStatus: "laid_off",
    urgencyFlags: ["benefits_ending", "struggling"],
    company: "TechCo",
    state: "CA",
    avatarTint: "#C53030",
    avatarEmoji: "👨",
    emotion: "Shocked, overwhelmed, scared for his family",
    situation:
      "Found out this morning via video-posted mass email. Doesn't know when benefits end or what severance looks like. Friend texted him the link.",
    keyNeeds: [
      "When do my benefits end? COBRA timeline",
      "What should I do today?",
      "Someone to talk to right now",
      "Step-by-step guide to file for unemployment",
    ],
    dashboardBanner: {
      tone: "info",
      title: "Day 1 — you just got here. Breathe.",
      body: "Take it one step at a time. Start with what's most urgent today.",
      ctaLabel: "Open Day-1 checklist",
      ctaHref: "/tabs/resources/day-one",
    },
    quickActions: [
      {
        key: "chat",
        label: "Chat Now",
        sublabel: "3 volunteers online",
        tint: "blue",
        href: "/tabs/chat",
      },
      {
        key: "state",
        label: "File Unemployment",
        sublabel: "CA step-by-step",
        tint: "green",
        href: "/tabs/resources/state",
      },
      {
        key: "book",
        label: "Talk to Peer",
        sublabel: "Next: today 3pm",
        tint: "slate",
        href: "/tabs/counselors",
      },
    ],
    recommendedResources: ["day-one", "cobra-marketplace", "unemployment-ca"],
  },
  priya: {
    id: "priya",
    displayName: "Seattle-Data-11",
    realName: "Priya Nair",
    age: 35,
    role: "Senior Data Scientist",
    employmentStatus: "laid_off",
    urgencyFlags: ["visa_concern"],
    company: "TechCo",
    state: "WA",
    avatarTint: "#553C9A",
    avatarEmoji: "🧑‍🔬",
    emotion: "Terrified, hyper-focused, operating on urgency",
    situation:
      "Laid off 4 days ago. On H-1B visa — has 56 days to find a new sponsor or leave the US. Severance offer makes no mention of her visa situation.",
    keyNeeds: [
      "Immigration-aware peer counselor — urgent",
      "Can she negotiate severance for a visa bridge?",
      "What does the over-60-form mean legally?",
      "Referral to immigration attorney",
    ],
    dashboardBanner: {
      tone: "danger",
      title: "56 days to find sponsorship",
      body: "H-1B grace period clock is ticking. Prioritize legal + job search today.",
      ctaLabel: "Open H-1B resource hub",
      ctaHref: "/tabs/resources/visa",
    },
    quickActions: [
      {
        key: "visa",
        label: "H-1B Hub",
        sublabel: "Day 0–60 plan",
        tint: "amber",
        href: "/tabs/resources/visa",
      },
      {
        key: "book",
        label: "Immigration Peer",
        sublabel: "ASAP",
        tint: "blue",
        href: "/tabs/counselors?tag=h1b",
      },
      {
        key: "chat",
        label: "Chat Hotline",
        sublabel: "Hindi available",
        tint: "green",
        href: "/tabs/chat",
      },
    ],
    recommendedResources: ["h1b-layoff", "visa-60-day", "severance-visa"],
  },
  james: {
    id: "james",
    displayName: "Dallas-Sales-03",
    realName: "James Okafor",
    age: 52,
    role: "Regional Sales Director",
    employmentStatus: "laid_off",
    urgencyFlags: ["discrimination", "severance_deadline"],
    company: "TechCo",
    state: "TX",
    avatarTint: "#1A6645",
    avatarEmoji: "👨‍🏫",
    emotion: "Furious, humiliated, determined to fight",
    situation:
      "15 years of service. Only employees over 45 in his division were cut. Received the ADEA over-40 form with his severance offer. Believes it's a case for the labor board.",
    keyNeeds: [
      "Peer counselor with ADEA & age discrimination context",
      "What does the over-40 form mean legally?",
      "Evaluate severance vs. potential legal claim",
      "Connect with others from the same RIF",
    ],
    dashboardBanner: {
      tone: "warning",
      title: "You may have an ADEA claim",
      body: "Review the over-40 waiver carefully. A peer counselor with ADEA experience can help.",
      ctaLabel: "Find ADEA counselor",
      ctaHref: "/tabs/counselors?tag=adea",
    },
    quickActions: [
      {
        key: "channel",
        label: "Company Channel",
        sublabel: "Same-RIF thread",
        tint: "slate",
        href: "/tabs/channel",
      },
      {
        key: "resource",
        label: "ADEA Explainer",
        sublabel: "Over-40 waiver",
        tint: "amber",
        href: "/tabs/resources/adea",
      },
      {
        key: "book",
        label: "Peer Counselor",
        sublabel: "Age discrim.",
        tint: "blue",
        href: "/tabs/counselors?tag=adea",
      },
    ],
    recommendedResources: [
      "adea-explainer",
      "severance-negotiation",
      "attorney-referral",
    ],
  },
  kiesha: {
    id: "kiesha",
    displayName: "ATL-CSM-26",
    realName: "Kiesha Williams",
    age: 26,
    role: "Customer Success Manager",
    employmentStatus: "imminent",
    urgencyFlags: [],
    company: "TechCo",
    state: "GA",
    avatarTint: "#97266D",
    avatarEmoji: "👩",
    emotion: "Anxious, uncertain, proactively protecting herself",
    situation:
      "Company announced restructuring last week. Manager has gone silent. Two peers already gone. Wants to document everything and understand her rights while she still has access. Found on Reddit.",
    keyNeeds: [
      "What to save and document right now",
      "Know her rights if/when she's cut",
      "Preview state unemployment eligibility",
      "Anonymous community with others in limbo",
    ],
    dashboardBanner: {
      tone: "info",
      title: "Preparing, just in case",
      body: "A private checklist to protect yourself while you're still employed.",
      ctaLabel: 'Open "What to Save Now"',
      ctaHref: "/tabs/resources/pre-layoff",
    },
    quickActions: [
      {
        key: "resource",
        label: "What to Save",
        sublabel: "While employed",
        tint: "blue",
        href: "/tabs/resources/pre-layoff",
      },
      {
        key: "state",
        label: "GA Preview",
        sublabel: "Unemployment",
        tint: "slate",
        href: "/tabs/resources/state",
      },
      {
        key: "chat",
        label: "Anxiety Support",
        sublabel: "Chat anonymously",
        tint: "green",
        href: "/tabs/chat",
      },
    ],
    recommendedResources: [
      "pre-layoff-checklist",
      "unemployment-ga",
      "community-forum",
    ],
  },
};

export const personaIds = Object.keys(personas) as Array<Persona["id"]>;

// ─── Counselors ────────────────────────────────────────────────────────────

export type Counselor = {
  id: string;
  initials: string;
  avatarTint: string;
  headline: string;
  tags: string[];
  availability: string;
  availableToday: boolean;
  bio: string;
  sessions: number;
  rating: number;
  languages: string[];
};

export const counselors: Counselor[] = [
  {
    id: "jl",
    initials: "JL",
    avatarTint: "#1A4A80",
    headline: "Employment attorney (10 yrs) · Severance & NDA specialist",
    tags: ["Severance", "NDA", "WARN Act"],
    availability: "Available today",
    availableToday: true,
    bio: "Former Big Law employment attorney. I've reviewed 400+ severance offers. Volunteer since 2023.",
    sessions: 142,
    rating: 4.9,
    languages: ["English"],
  },
  {
    id: "mr",
    initials: "MR",
    avatarTint: "#1A6645",
    headline: "HR professional · Benefits & COBRA expert",
    tags: ["COBRA", "Benefits", "Unemployment"],
    availability: "Next: tomorrow 2pm",
    availableToday: false,
    bio: "15 years in enterprise HR. I help people navigate benefits gaps and COBRA without stress.",
    sessions: 88,
    rating: 4.8,
    languages: ["English", "Spanish"],
  },
  {
    id: "sk",
    initials: "SK",
    avatarTint: "#553C9A",
    headline: "Former tech PM · H-1B & immigration experience",
    tags: ["H-1B", "Visa", "Severance"],
    availability: "Available today",
    availableToday: true,
    bio: "I lost my job on an H-1B in 2022 and found sponsorship in 38 days. Here to help others.",
    sessions: 64,
    rating: 4.9,
    languages: ["English", "Hindi"],
  },
  {
    id: "tw",
    initials: "TW",
    avatarTint: "#744210",
    headline: "Employment law background · Age discrim. cases",
    tags: ["ADEA", "Age Discrim.", "Legal"],
    availability: "Next: Fri 10am",
    availableToday: false,
    bio: "Advocated for older workers in RIFs. I'll help you read the over-40 waiver.",
    sessions: 51,
    rating: 5.0,
    languages: ["English"],
  },
];

// ─── Resources ─────────────────────────────────────────────────────────────

export type Resource = {
  id: string;
  title: string;
  meta: string;
  kind: "article" | "pdf" | "video" | "guide" | "checklist";
  tag?: string;
  description?: string;
};

export const resources: Record<string, Resource> = {
  "warn-act": {
    id: "warn-act",
    title: "WARN Act — What you're owed",
    meta: "3 min read",
    kind: "article",
    tag: "Severance",
  },
  "nda-review": {
    id: "nda-review",
    title: "NDA Review Checklist",
    meta: "PDF download",
    kind: "pdf",
  },
  "severance-101": {
    id: "severance-101",
    title: "Severance 101 Guide",
    meta: "What's standard vs. negotiable",
    kind: "guide",
  },
  "h1b-layoff": {
    id: "h1b-layoff",
    title: "H-1B Layoff Guide",
    meta: "Video + PDF",
    kind: "guide",
    description: "60-day grace period, portability, and what to ask HR.",
  },
  "visa-60-day": {
    id: "visa-60-day",
    title: "H-1B 60-Day Plan",
    meta: "14 min",
    kind: "video",
  },
  "severance-visa": {
    id: "severance-visa",
    title: "Negotiating severance as a visa holder",
    meta: "5 min read",
    kind: "article",
  },
  "day-one": {
    id: "day-one",
    title: "First 24 Hours Checklist",
    meta: "Step by step",
    kind: "checklist",
  },
  "cobra-marketplace": {
    id: "cobra-marketplace",
    title: "COBRA vs. Marketplace",
    meta: "6 min video",
    kind: "video",
  },
  "unemployment-ca": {
    id: "unemployment-ca",
    title: "Unemployment — California",
    meta: "State guide",
    kind: "guide",
  },
  "unemployment-ga": {
    id: "unemployment-ga",
    title: "Unemployment — Georgia",
    meta: "State guide",
    kind: "guide",
  },
  "adea-explainer": {
    id: "adea-explainer",
    title: "The over-40 waiver — ADEA explained",
    meta: "4 min read",
    kind: "article",
    tag: "Age Discrim.",
  },
  "severance-negotiation": {
    id: "severance-negotiation",
    title: "Severance Negotiation Guide",
    meta: "Without burning bridges",
    kind: "guide",
  },
  "attorney-referral": {
    id: "attorney-referral",
    title: "Attorney Referrals by State",
    meta: "Pro-bono & sliding-scale",
    kind: "guide",
  },
  "pre-layoff-checklist": {
    id: "pre-layoff-checklist",
    title: "What to Save Right Now",
    meta: "While you're still employed",
    kind: "checklist",
  },
  "community-forum": {
    id: "community-forum",
    title: "Community Forum",
    meta: "Read posts anonymously",
    kind: "guide",
  },
};

// ─── Channel threads ───────────────────────────────────────────────────────

export type ChannelThread = {
  id: string;
  author: string;
  authorTint: string;
  title: string;
  replies: number;
  age: string;
};

export const channelThreads: ChannelThread[] = [
  {
    id: "t1",
    author: "Anonymous_Eng_91",
    authorTint: "#1A4A80",
    title: "Has anyone received their final paycheck yet?",
    replies: 23,
    age: "2h ago",
  },
  {
    id: "t2",
    author: "Anon_Manager_44",
    authorTint: "#553C9A",
    title: "H-1B workers — let's connect and share resources",
    replies: 18,
    age: "4h ago",
  },
  {
    id: "t3",
    author: "Anon_Staff_17",
    authorTint: "#C53030",
    title: "Did we qualify for WARN Act? I didn't get 60 days notice",
    replies: 31,
    age: "6h ago",
  },
  {
    id: "t4",
    author: "Anon_Dev_22",
    authorTint: "#1A6645",
    title: "Equity clawback in severance — has anyone seen this before?",
    replies: 12,
    age: "8h ago",
  },
  {
    id: "t5",
    author: "Anon_RSM_55",
    authorTint: "#744210",
    title: "Sharing resources for the sales team",
    replies: 5,
    age: "1d ago",
  },
  {
    id: "t6",
    author: "Anon_PM_08",
    authorTint: "#1A4A80",
    title: "NDA language is very broad — anyone talking to a lawyer?",
    replies: 9,
    age: "1d ago",
  },
];

// ─── Videos ────────────────────────────────────────────────────────────────

export type Video = {
  id: string;
  title: string;
  meta: string;
  category: string;
};

export const videos: Video[] = [
  {
    id: "v1",
    title: "Know Your Severance Rights",
    meta: "8 min · Free",
    category: "Severance",
  },
  {
    id: "v2",
    title: "COBRA vs. Marketplace",
    meta: "6 min · Free",
    category: "Benefits",
  },
  {
    id: "v3",
    title: "H-1B Layoff: 60-Day Plan",
    meta: "14 min · Free",
    category: "H-1B",
  },
  {
    id: "v4",
    title: "Understanding WARN Act",
    meta: "9 min · Free",
    category: "Legal",
  },
  {
    id: "v5",
    title: "Age Discrimination Guide",
    meta: "11 min · Free",
    category: "Legal",
  },
  {
    id: "v6",
    title: "Mental Health After Layoff",
    meta: "7 min · Free",
    category: "Wellbeing",
  },
];

export const featuredVideo: Video & { rating: number; views: number } = {
  id: "featured",
  title: "Know Your Rights After a Layoff",
  meta: "12 min · Free",
  category: "Essentials",
  rating: 4.9,
  views: 3241,
};

// ─── Triage → persona mapping ──────────────────────────────────────────────

/**
 * Map triage answers to a persona branch. This powers the Dashboard banner
 * & quick-action personalization. Claude Code can replace this with a real
 * router as product rules evolve.
 */
export function routeToPersona(
  status: EmploymentStatus,
  flags: UrgencyFlag[],
): Persona["id"] {
  if (flags.includes("visa_concern")) return "priya";
  if (flags.includes("discrimination")) return "james";
  if (flags.includes("severance_deadline")) return "maya";
  if (
    status === "laid_off" &&
    (flags.includes("benefits_ending") || flags.includes("struggling"))
  )
    return "david";
  if (status === "imminent" || status === "not_affected") return "kiesha";
  return "maya"; // safe default — most common journey
}
