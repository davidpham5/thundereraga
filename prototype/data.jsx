// Mock data for the prototype. Mirrors src/data/mock.ts shape.

const PERSONAS = {
  maya: {
    id: 'maya',
    displayName: 'Portland-Eng-42',
    tint: '#1A4A80',
    initials: 'PE',
    role: 'Software Engineer, 29, Oregon',
    banner: {
      tone: 'warning',
      title: 'Severance deadline in 18 days',
      body: 'Review your offer with a peer counselor before you sign.',
      cta: 'Book a review session', ctaScreen: 'counselors',
    },
    quickActions: [
      { label: 'Chat Hotline', sublabel: 'Available now', tint: 'accent', screen: 'chat' },
      { label: 'Book Counselor', sublabel: 'Today', tint: 'success', screen: 'counselors' },
      { label: 'State Guide', sublabel: 'OR resources', tint: 'sunken', screen: 'resources' },
    ],
    recommended: ['warn-act', 'nda-review', 'severance-101'],
  },
  david: {
    id: 'david',
    displayName: 'SF-PM-19',
    tint: '#C53030',
    initials: 'SP',
    role: 'Product Manager, 34, California',
    banner: {
      tone: 'info',
      title: "Day 1 — you just got here. Breathe.",
      body: "Take it one step at a time. Start with what's most urgent today.",
      cta: 'Open Day-1 checklist', ctaScreen: 'resources',
    },
    quickActions: [
      { label: 'Chat Now', sublabel: '3 volunteers online', tint: 'accent', screen: 'chat' },
      { label: 'File Unemployment', sublabel: 'CA step-by-step', tint: 'success', screen: 'resources' },
      { label: 'Talk to Peer', sublabel: 'Today 3pm', tint: 'sunken', screen: 'counselors' },
    ],
    recommended: ['day-one', 'cobra-marketplace', 'unemployment-ca'],
  },
  priya: {
    id: 'priya',
    displayName: 'Seattle-Data-11',
    tint: '#553C9A',
    initials: 'SD',
    role: 'Senior Data Scientist, 35, Washington',
    banner: {
      tone: 'danger',
      title: '56 days to find sponsorship',
      body: 'H-1B grace period clock is ticking. Prioritize legal + job search today.',
      cta: 'Open H-1B resource hub', ctaScreen: 'resources',
    },
    quickActions: [
      { label: 'H-1B Hub', sublabel: 'Day 0–60 plan', tint: 'warning', screen: 'resources' },
      { label: 'Immigration Peer', sublabel: 'ASAP', tint: 'accent', screen: 'counselors' },
      { label: 'Chat Hotline', sublabel: 'Hindi available', tint: 'success', screen: 'chat' },
    ],
    recommended: ['h1b-layoff', 'visa-60-day', 'severance-visa'],
  },
  james: {
    id: 'james',
    displayName: 'Dallas-Sales-03',
    tint: '#1A6645',
    initials: 'DS',
    role: 'Regional Sales Director, 52, Texas',
    banner: {
      tone: 'warning',
      title: 'You may have an ADEA claim',
      body: 'Review the over-40 waiver carefully. A peer counselor with ADEA experience can help.',
      cta: 'Find ADEA counselor', ctaScreen: 'counselors',
    },
    quickActions: [
      { label: 'Company Channel', sublabel: 'Same-RIF thread', tint: 'sunken', screen: 'channel' },
      { label: 'ADEA Explainer', sublabel: 'Over-40 waiver', tint: 'warning', screen: 'resources' },
      { label: 'Peer Counselor', sublabel: 'Age discrim.', tint: 'accent', screen: 'counselors' },
    ],
    recommended: ['adea-explainer', 'severance-negotiation', 'attorney-referral'],
  },
  kiesha: {
    id: 'kiesha',
    displayName: 'ATL-CSM-26',
    tint: '#97266D',
    initials: 'AC',
    role: 'Customer Success Manager, 26, Georgia',
    banner: {
      tone: 'info',
      title: 'Preparing, just in case',
      body: "A private checklist to protect yourself while you're still employed.",
      cta: 'Open "What to Save Now"', ctaScreen: 'resources',
    },
    quickActions: [
      { label: 'What to Save', sublabel: 'While employed', tint: 'accent', screen: 'resources' },
      { label: 'GA Preview', sublabel: 'Unemployment', tint: 'sunken', screen: 'resources' },
      { label: 'Anxiety Support', sublabel: 'Chat anonymously', tint: 'success', screen: 'chat' },
    ],
    recommended: ['pre-layoff-checklist', 'unemployment-ga', 'community-forum'],
  },
};

const PERSONA_ORDER = ['maya', 'david', 'priya', 'james', 'kiesha'];

const RESOURCES = {
  'warn-act':           { title: "WARN Act — What you're owed",          meta: '3 min read',    kind: 'article', tag: 'Severance' },
  'nda-review':         { title: 'NDA Review Checklist',                  meta: 'PDF download',  kind: 'pdf' },
  'severance-101':      { title: 'Severance 101 Guide',                   meta: "What's standard vs. negotiable", kind: 'guide' },
  'h1b-layoff':         { title: 'H-1B Layoff Guide',                     meta: 'Video + PDF',   kind: 'guide', tag: 'H-1B' },
  'visa-60-day':        { title: 'H-1B 60-Day Plan',                      meta: '14 min',        kind: 'video' },
  'severance-visa':     { title: 'Negotiating severance as a visa holder',meta: '5 min read',    kind: 'article' },
  'day-one':            { title: 'First 24 Hours Checklist',              meta: 'Step by step',  kind: 'guide' },
  'cobra-marketplace':  { title: 'COBRA vs. Marketplace',                 meta: '6 min video',   kind: 'video' },
  'unemployment-ca':    { title: 'Unemployment — California',             meta: 'State guide',   kind: 'guide' },
  'unemployment-ga':    { title: 'Unemployment — Georgia',                meta: 'State guide',   kind: 'guide' },
  'adea-explainer':     { title: 'The over-40 waiver — ADEA explained',   meta: '4 min read',    kind: 'article', tag: 'Age Discrim.' },
  'severance-negotiation': { title: 'Severance Negotiation Guide',        meta: 'Without burning bridges', kind: 'guide' },
  'attorney-referral':  { title: 'Attorney Referrals by State',           meta: 'Pro-bono & sliding-scale', kind: 'guide' },
  'pre-layoff-checklist':{ title: 'What to Save Right Now',               meta: "While you're still employed", kind: 'guide' },
  'community-forum':    { title: 'Community Forum',                       meta: 'Read posts anonymously', kind: 'guide' },
};

const COUNSELORS = [
  { id: 'jl', initials: 'JL', tint: '#1A4A80', headline: 'Employment attorney (10 yrs) · Severance & NDA specialist', tags: ['Severance','NDA','WARN Act'], availability: 'Available today', availableToday: true, sessions: 142, rating: 4.9 },
  { id: 'mr', initials: 'MR', tint: '#1A6645', headline: 'HR professional · Benefits & COBRA expert', tags: ['COBRA','Benefits','Unemployment'], availability: 'Next: tomorrow 2pm', availableToday: false, sessions: 88, rating: 4.8 },
  { id: 'sk', initials: 'SK', tint: '#553C9A', headline: 'Former tech PM · H-1B & immigration experience', tags: ['H-1B','Visa','Severance'], availability: 'Available today', availableToday: true, sessions: 64, rating: 4.9 },
  { id: 'tw', initials: 'TW', tint: '#744210', headline: 'Employment law background · Age discrim. cases', tags: ['ADEA','Age Discrim.','Legal'], availability: 'Next: Fri 10am', availableToday: false, sessions: 51, rating: 5.0 },
];

const VIDEOS = [
  { id: 'v1', title: 'Know Your Severance Rights', meta: '8 min · Free',  category: 'SEVERANCE' },
  { id: 'v2', title: 'COBRA vs. Marketplace',      meta: '6 min · Free',  category: 'BENEFITS'  },
  { id: 'v3', title: 'H-1B Layoff: 60-Day Plan',   meta: '14 min · Free', category: 'H-1B'      },
  { id: 'v4', title: 'Understanding WARN Act',     meta: '9 min · Free',  category: 'LEGAL'     },
  { id: 'v5', title: 'Age Discrimination Guide',   meta: '11 min · Free', category: 'LEGAL'     },
  { id: 'v6', title: 'Mental Health After Layoff', meta: '7 min · Free',  category: 'WELLBEING' },
];

Object.assign(window, { PERSONAS, PERSONA_ORDER, RESOURCES, COUNSELORS, VIDEOS });
