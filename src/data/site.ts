// ALL SITE CONTENT LIVES HERE. Edit this file only; pages read from it.
// Sources: Mannat's CV ("Consulting Commercial CV", Nov 2026) and the Team 10 Sculpted deck
// (I&E x Deloitte Case Competition 2026/27, the final). Lines marked DRAFT are wording Claude wrote
// around those facts; Mannat should check them. No numbers appear that are not in those sources.

// The site is served under a base path (/portfolio on GitHub Pages). Wrap every root-relative link in u().
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (p: string) => (p.startsWith('/') ? BASE + p : p);

export type Tag = 'management' | 'business' | 'design';
export type Fact = { v: string; l: string };

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  role: string;
  outcome: string;       // the business result, one line; leads every card
  summary: string;
  facts: Fact[];
  brief: string;         // The brief
  hard?: string;         // The hard part (only where the source says what it was)
  shipped: string;       // What shipped
  impact?: string;       // What it changed for the business
  note?: string;         // disclaimer shown on the case page
  cover: string;
  coverAlt: string;
};

export type Bridge = { design: string; management: string; why: string; example: string };
export type Study = { course: string; learnt: string; applied: string };
export type Link = { label: string; href: string; note: string };
export type ResumeEntry = {
  start: string;         // sort key: end date (YYYY-MM), most recent first
  when: string;
  title: string;
  org: string;
  place: string;
  group: 'Experience' | 'Education' | 'Leadership';
  tags: Tag[];
  bullets: string[];
};

export const site = {
  name: 'Mannat Sidhu',
  short: 'Mannat',
  headline: 'Manager with a designer’s eye.',
  roleLine:
    'MSc Management at UCD Smurfit, Dublin. I founded a branding studio, ran operations and marketing for a luxury label, and built strategy decks with consulting teams at BCG. Now I want to run the business, not only the brand.',
  openTo: 'Open to consulting, commercial strategy and business operations roles',
  openToShort: 'Open to consulting and commercial roles',
  location: 'Dublin, Ireland',
  url: 'https://mannat-sidhu.github.io/portfolio',
  email: 'mannat.sidhu@ucdconnect.ie',
  description:
    'Mannat Sidhu: MSc Management at UCD Smurfit, founder of a branding studio, ex-BCG. Open to consulting, commercial strategy and business operations roles.',
  resumePdf: u('/mannat-sidhu-resume.pdf'),
  video: { src: '', poster: '' },           // optional: a 60-second "why hire me" video in /public
  alumniOf: [
    'UCD Michael Smurfit Graduate Business School',
    'National Institute of Fashion Technology, Hyderabad',
    'Fashion Institute of Technology, New York',
  ],
  knowsAbout: [
    'Commercial strategy', 'Business operations', 'Market entry strategy', 'Valuation', 'Pricing strategy',
    'Stakeholder management', 'Project delivery', 'Brand strategy', 'Data visualisation', 'Generative AI workflows',
  ],
};

export const links: Link[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mannatsidhu1', note: 'Experience and recommendations' },
  { label: 'Substack', href: 'https://substack.com/@mannatsidhu', note: 'Essays on design, business and culture' },
  { label: 'Behance', href: 'https://www.be.net/mannatsidhu1', note: 'Design and brand work' },
];

export const explainer = {
  title: 'What the thread means',
  body: [
    'Mannat is my name. In Hindi and Punjabi it means a vow. People tie a thread to a carved stone screen, called a jaali, when they make a promise, and come back to untie it when the promise is kept.',
    'This site is built the same way. The lattice is the jaali. Each red thread is a promise, and each one leads to the proof.',
  ],
};

export const numbers: Fact[] = [
  { v: '30+', l: 'client projects run end to end at my own studio' },
  { v: '3×', l: 'average project value after I moved to value-based pricing' },
  { v: '22%', l: 'of revenue from a collection I shaped from customer research' },
  { v: '100+', l: 'pitch and strategy decks built with BCG consulting teams' },
];

export const projects: Project[] = [
  {
    slug: 'sculpted-by-aimee',
    title: 'Sculpted by Aimee',
    kind: 'Growth strategy, case competition',
    year: '2026',
    role: 'Team 10, presenting in the final of the I&E × Deloitte Case Competition',
    outcome: 'A gated plan to take an Irish make-up brand from €50m to a projected €115m by 2031, worth €20m more than staying home.',
    summary: 'Where a profitable Irish beauty brand should grow next, how to enter, and how to fund it without betting the company.',
    facts: [
      { v: '€50m → €115m', l: 'projected revenue, 2026 to 2031' },
      { v: '+€20m', l: 'value created against staying home (DCF)' },
      { v: '−€4m', l: 'worst case if the US disappoints, because the gates hold' },
    ],
    brief:
      'Sculpted by Aimee is a profitable Irish make-up brand that has nearly filled its home market. Ireland’s whole make-up market is about €150m, and Sculpted already takes roughly one euro in five. The brief: where to grow, how to enter, which products to lead with, and how to pay for it.',
    hard:
      'Europe is easier, but only America is big enough to matter. Under ease-led weights Spain ranked first and the US fifth. Once value created was weighted in, the US came first. And the real limits were not demand: they were a 189-day cash cycle, one Korean manufacturer and one founder’s diary.',
    shipped:
      'A recommendation to the founder and board. Prove demand online in four US metros, then win one exclusive retailer (Ulta, pitched through its UK chain Space NK). Lead with twelve hero products chosen by weighted scoring from about 150. Fund it from profits plus a €10m asset-based credit line, with no equity sold before the US is proven.',
    impact:
      'Three gates, in 2027, 2029 and 2031, release the money only when the numbers are met: US revenue, sales per store per week, repeat buyers, trade spend and the cash cycle. That caps the downside at about €4m, while the base case is worth about €99m against €79m for staying home.',
    note: 'Independent case-competition work based on public information to November 2026. Sculpted by Aimee has not reviewed or endorsed it.',
    cover: u('/covers/sculpted.svg'),
    coverAlt: 'Cover: a red thread tied to a stone lattice, with the route Dublin to the United States to Spain and Italy',
  },
  {
    slug: 'pehchaan-creative',
    title: 'Pehchaan Creative',
    kind: 'Founder, branding studio',
    year: '2024 to 2026',
    role: 'Founder and brand strategy consultant, Patiala, India',
    outcome: 'Moved pricing from deliverables to value and tripled the average project value within eight months.',
    summary: 'A branding studio for food and drink and direct-to-consumer brands, run from pitch to billing.',
    facts: [
      { v: '30+', l: 'F&B and D2C client projects, pitch to billing' },
      { v: '3×', l: 'average project value within eight months' },
      { v: '30%', l: 'less time to onboard a new client' },
    ],
    brief:
      'Build and run a studio that takes food and drink and direct-to-consumer brands from first pitch to final invoice, with several client projects moving at the same time.',
    shipped:
      'An end-to-end delivery pipeline for more than 30 client projects: pitching, onboarding, execution and billing. A bench of seven freelance specialists in design, illustration and photography, coordinated across simultaneous projects. A pricing model based on the value of the work, not the number of deliverables.',
    impact:
      'Onboarding time down 30%. Average project value tripled within eight months of the pricing change. Brand strategies that contributed to a reported 34% increase in client retention.',
    cover: u('/covers/pehchaan.svg'),
    coverAlt: 'Cover: three red threads tied to a stone lattice at different lengths',
  },
  {
    slug: 'pritaara',
    title: 'Pritaara',
    kind: 'Business operations, luxury fashion',
    year: '2019 to 2026',
    role: 'Business operations and marketing, Patiala, India',
    outcome: 'A younger-buyer collection, built from market research and customer insight, that brought in 22% of revenue.',
    summary: 'Finance, production, channels and marketing for a luxury fashion label.',
    facts: [
      { v: '22%', l: 'of revenue from the younger-buyer collection' },
      { v: '3', l: 'new physical sales channels through five-star hotels' },
      { v: '+500%', l: 'social traffic in six months' },
    ],
    brief:
      'Keep a luxury fashion label solvent and growing: the books, the makers, the sales channels and the marketing.',
    shipped:
      'Bookkeeping, vendor costing and cash management. Coordination of artisans, inventory and production timelines. Exhibition and retail partnerships with regional five-star hotels. Organic and paid social campaigns. A collection designed for younger buyers, from market research and customer insight.',
    impact:
      'The younger-buyer collection contributed 22% of revenue. The hotel partnerships opened three physical sales channels. Social traffic rose 500% in six months, and order flow and customer communication improved.',
    cover: u('/covers/pritaara.svg'),
    coverAlt: 'Cover: a red thread woven through a stone lattice in a pattern like embroidery',
  },
  {
    slug: 'bcg',
    title: 'Boston Consulting Group',
    kind: 'Strategy decks and data visualisation',
    year: '2023 to 2024',
    role: 'Associate graphic designer, Gurugram, India',
    outcome: 'Structured more than 100 pitch and client strategy presentations with consulting teams.',
    summary: 'Turning consulting analysis into presentations clients can act on.',
    facts: [
      { v: '100+', l: 'pitch and client strategy presentations' },
      { v: '18', l: 'sector reports with data visualisation' },
    ],
    brief:
      'Work inside consulting teams to turn complex analysis into presentations a client can act on, within BCG brand standards.',
    shipped:
      'The visual structure for more than 100 pitch and client strategy presentations. Data visualisations for 18 sector reports, including work associated with Snapchat, CII and the Government of India.',
    cover: u('/covers/bcg.svg'),
    coverAlt: 'Cover: a red thread drawn as a rising chart line across a stone lattice',
  },
];

export const bridges: Bridge[] = [
  {
    design: 'User research',
    management: 'Customer and stakeholder insight',
    why: 'I interview stakeholders the way I interviewed users: what do they need, what worries them, and what would make them say yes.',
    example: 'At Pritaara, market research and customer insight became a younger-buyer collection that brought in 22% of revenue.',
  },
  {
    design: 'Design systems',
    management: 'Operating process',
    why: 'A design system is a set of rules that lets a team move fast without breaking things. A good operating process does the same job.',
    example: 'At Pehchaan Creative I rebuilt onboarding as a repeatable process and cut onboarding time by 30%.',
  },
  {
    design: 'Design critique',
    management: 'Decision reviews',
    why: 'Critique taught me to judge the work against criteria, not opinions. I make business calls the same way.',
    example: 'In the Sculpted case we scored six markets on nine criteria under three weightings, and showed the board how the weights change the answer.',
  },
  {
    design: 'Prototyping',
    management: 'Low-risk experiments',
    why: 'Test the cheapest version first. In business that means a pilot before a rollout, and money released only when it works.',
    example: 'Our Sculpted plan proves demand online before any store, with three gates that cap the downside at about €4m.',
  },
  {
    design: 'Storytelling',
    management: 'Pitching and buy-in',
    why: 'A board deck is a design problem. I structure the argument so the decision is easy to make.',
    example: 'At BCG I structured more than 100 pitch and client strategy presentations with consulting teams.',
  },
  {
    design: 'Visual hierarchy',
    management: 'Prioritisation',
    why: 'Hierarchy decides what someone sees first. Prioritisation decides what a team does first. Same skill, different canvas.',
    example: 'For Sculpted we cut about 150 products to twelve heroes for the US launch, using a weighted score.',
  },
];

export const studyIntro = {
  title: 'What I studied this year',
  program: 'MSc Management, UCD Michael Smurfit Graduate Business School, 2026 to 2027',
  lede: 'Each module, and where I have already used it. Most of the proof is in the Sculpted case, which my team took to the final.',
};

export const studies: Study[] = [
  {
    course: 'Accounting',
    learnt: 'Reading audited accounts, and why cash can run out while profits look fine.', // DRAFT
    applied: 'Worked out Sculpted’s 189-day cash cycle (176 stock days, plus 76 debtor days, minus 63 creditor days) from its audited FY2024 accounts.',
  },
  {
    course: 'Corporate Finance',
    learnt: 'Valuing a business, building a discount rate, and sizing debt a lender will accept.', // DRAFT
    applied: 'A DCF at an 11.5% discount rate, a football-field valuation against listed peers, and a €10m credit line kept under 2.5× net debt to EBITDA.',
  },
  {
    course: 'Strategic Management',
    learnt: 'Choosing where to compete, and saying no to the rest.', // DRAFT
    applied: 'Scored six markets on nine criteria; used Charlotte Tilbury as the path to copy and Pat McGrath as the one to avoid.',
  },
  {
    course: 'Supply Chain',
    learnt: 'Sourcing risk, logistics routes and landed cost.', // DRAFT
    applied: 'Planned a second Korean supplier by 2028 and a New Jersey warehouse, and showed a doubled US tariff is absorbed by a 4% price rise.',
  },
  {
    course: 'Marketing',
    learnt: 'Positioning, range strategy and how shoppers switch brands.', // DRAFT
    applied: 'Built the positioning map, the twelve-product hero range, and six switching plays from assets the brand already owns.',
  },
];

export const frameworks: string[] = [
  'DCF valuation', 'Discount-rate build', 'Cash conversion cycle', 'Weighted scoring', 'Scenario analysis',
  'Stage-gate investment', 'Football-field valuation', 'KPI design', 'Positioning map',
];

export const promises = [
  { title: 'No surprises.', text: 'If a deadline or a budget is at risk, you hear it from me first, with options.' },
  { title: 'Decisions in writing.', text: 'Every call has its reason on paper, so the team can move without waiting for me.' },
  { title: 'Both languages.', text: 'I can talk to the creative team and to finance in the same meeting, and make sure they hear the same thing.' },
];

export const resume = {
  summary:
    'MSc Management candidate at UCD Smurfit with experience in commercial operations, client management, brand strategy and project delivery. Founded a branding studio serving 30+ F&B and D2C clients, improved pricing and onboarding, and supported financial and operational decisions for a luxury fashion brand. Previously supported consulting teams at BCG through presentations and data visualisation.',
  entries: [
    { start: '2027-03', when: 'From November 2026', title: 'Incoming student consultant', org: 'Irish Student Consulting Group', place: 'Dublin', group: 'Leadership', tags: ['business', 'management'],
      bullets: ['Selected for an upcoming client consulting project; assignment and scope to be confirmed.'] },
    { start: '2027-05', when: 'September 2026 to now', title: 'MSc Management', org: 'UCD Michael Smurfit Graduate Business School', place: 'Dublin', group: 'Education', tags: ['business', 'management'],
      bullets: ['Modules: Accounting, Corporate Finance, Strategic Management, Supply Chain, Marketing.', 'Team 10 in the final of the I&E × Deloitte Case Competition 2026/27.'] },
    { start: '2027-04', when: 'September 2026 to now', title: 'Global Leadership Programme', org: 'University College Dublin', place: 'Dublin', group: 'Leadership', tags: ['management'],
      bullets: ['Participant.'] },
    { start: '2026-06', when: 'December 2024 to June 2026', title: 'Founder and brand strategy consultant', org: 'Pehchaan Creative', place: 'Patiala, India', group: 'Experience', tags: ['management', 'business', 'design'],
      bullets: [
        'Managed the end-to-end delivery pipeline for 30+ F&B and D2C client projects, from pitching and onboarding to execution and billing; reduced onboarding time by 30%.',
        'Changed pricing from deliverable-based to value-based, tripling average project value within eight months.',
        'Developed brand strategies for clients, contributing to a reported 34% increase in client retention.',
        'Recruited and coordinated seven freelance specialists across design, illustration and photography.',
      ] },
    { start: '2024-12', when: 'December 2024', title: 'Selected participant', org: 'Jagriti Yatra', place: 'India', group: 'Leadership', tags: ['management', 'business'],
      bullets: ['Selected among 500 participants from over 18,000 applicants for a 15-day entrepreneurship journey; worked with village communities on local challenges and presented proposed solutions.'] },
    { start: '2025-05', when: 'August 2024 to May 2025', title: 'AI creative (contract)', org: 'Teevra Studios', place: 'Remote', group: 'Experience', tags: ['design'],
      bullets: ['Created AI-generated images and videos for short-form drama productions, working with AI-enabled production workflows and automations.'] },
    { start: '2024-11', when: 'September 2023 to November 2024', title: 'Associate graphic designer', org: 'Boston Consulting Group', place: 'Gurugram, India', group: 'Experience', tags: ['design', 'business'],
      bullets: [
        'Worked with consulting teams to visually structure 100+ pitch and client strategy presentations within BCG brand standards.',
        'Produced data visualisations for 18 sector reports, including work associated with Snapchat, CII and the Government of India.',
      ] },
    { start: '2023-05b', when: 'January to May 2023', title: 'Graphic design intern', org: 'Landor & Fitch', place: 'Gurugram, India', group: 'Experience', tags: ['design'],
      bullets: ['Contributed to 10+ packaging projects for FMCG brands under Nestlé and Coca-Cola, following global brand guidelines.'] },
    { start: '2022-07', when: 'May to July 2022', title: 'Publishing and illustration intern', org: 'Morgan Publishing House', place: 'New York, USA', group: 'Experience', tags: ['design'],
      bullets: ['Created illustrations for children’s books and joined daily publishing-team meetings.', 'Liaised with NGOs and printers in India to support book production and distribution.'] },
    { start: '2022-01', when: 'January 2021 to January 2022', title: 'Associate in Applied Science, Communication Design (Grade 1.1)', org: 'Fashion Institute of Technology', place: 'New York, USA', group: 'Education', tags: ['design'],
      bullets: ['Communication design.'] },
    { start: '2026-08', when: 'August 2019 to August 2026', title: 'Business operations and marketing', org: 'Pritaara, luxury fashion', place: 'Patiala, India', group: 'Experience', tags: ['business', 'management'],
      bullets: [
        'Supported financial operations through bookkeeping, vendor costing and cash management, helping keep the business solvent.',
        'Secured exhibition and retail partnerships with regional five-star hotels, establishing three physical sales channels.',
        'Used market research and customer insight to develop a younger-buyer collection that contributed 22% of revenue.',
        'Coordinated artisans, inventory and production timelines; improved order flow and customer communication.',
        'Ran organic and paid social marketing, increasing traffic by 500% over six months.',
      ] },
    { start: '2023-05', when: '2019 to 2023', title: 'Bachelor of Design, Fashion Communication (Grade 1.1)', org: 'National Institute of Fashion Technology', place: 'Hyderabad, India', group: 'Education', tags: ['design'],
      bullets: ['Brand, communication and visual design.'] },
  ] as ResumeEntry[],
  skills: [
    { group: 'Strategy and analysis', items: ['Market and competitor research', 'Customer insight', 'Commercial problem-solving', 'Pricing strategy', 'Data visualisation', 'Financial monitoring'] },
    { group: 'Business and operations', items: ['Business development', 'Client and stakeholder management', 'Process improvement', 'Project coordination', 'Vendor management', 'Cross-functional work'] },
    { group: 'AI and automation', items: ['Generative AI tools', 'AI-assisted workflows', 'Creative automation', 'Prompt development'] },
    { group: 'Tools', items: ['PowerPoint', 'Excel (basic)', 'Adobe Creative Suite', 'Notion', 'Airtable', 'Asana', 'Monday.com', 'ChatGPT', 'Claude', 'Gemini', 'Copilot'] },
  ],
};

// Threads that hang on the hero and contact walls. Each is a real destination.
const shortNames: Record<string, string> = { 'sculpted-by-aimee': 'Sculpted', 'pehchaan-creative': 'Pehchaan', pritaara: 'Pritaara', bcg: 'BCG' };
export const wallThreads = [
  ...projects.map((p) => ({ short: shortNames[p.slug] ?? p.title, label: p.outcome.split('.')[0], kind: 'Work', href: u(`/work/${p.slug}/`) })),
  { short: 'Skills', label: 'Design skills I use in management', kind: 'Skills', href: u('/#skills') },
  { short: 'Study', label: 'MSc Management, UCD Smurfit', kind: 'Study', href: u('/#study') },
  { short: 'Resume', label: 'Interactive resume and PDF', kind: 'Resume', href: u('/resume/') },
];
