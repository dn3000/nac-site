/* ============================================================================
   Nitamur Ad Caelum Ltd — site data
   ----------------------------------------------------------------------------
   This file is SEEDED with confirmed group data. Claude Code: build the render
   logic, observers and form handling around these constants. Do not replace or
   re-key them. Anything marked CONFIRM must render as a visible placeholder,
   never as invented content.
   ========================================================================== */

const GROUP = {
  legalName:      'Nitamur Ad Caelum Ltd',
  shortName:      'NAC Limited',
  motto:          'Nitamur Ad Caelum',
  mottoEnglish:   'We aim higher',
  companyNumber:  '09115910',
  jurisdiction:   'England & Wales',
  registeredOffice: {
    street:   '103 Stone Drive',
    locality: 'Shifnal',
    region:   'Shropshire',
    postcode: 'TF11 9LX',
    country:  'United Kingdom',
    countryCode: 'GB',
  },
  email:   'hello@NitamurAdCaelum.co.uk',
  phone:   '+44 7864 125677',
  domain:  'https://nitamuradcaelum.co.uk',   // CONFIRM — used for canonical + OG
  founded: 2014,                              // confirmed
};

/* Regions the group operates in — confirmed. Drives the stat count and the
   Reach section. Keep this the single source for the group footprint. */
const REGIONS = ['England', 'South Africa', 'Zimbabwe', 'Malawi'];

/* Web3Forms — paste the free access key from https://web3forms.com
   Until this is set, the form must render fully but show a clear
   "not yet connected" state instead of submitting. */
const WEB3FORMS_KEY = '<<FILL — Web3Forms access key>>';

/* ----------------------------------------------------------------------------
   SECTORS — five. Drives the nav, the progress rail and the section order.
   Subsidiaries are grouped under these; a sector may hold more than one.
   -------------------------------------------------------------------------- */
const SECTORS = [
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'logistics',  label: 'Logistics' },
  { id: 'software',   label: 'Software' },
  { id: 'ngo',        label: 'NGO & FCDO Partnerships' },
  { id: 'printing',   label: 'Printing' },
];

/* ----------------------------------------------------------------------------
   SUBSIDIARIES — six across five sectors. Adding a seventh means adding one
   object here and nothing else anywhere in the codebase.
   -------------------------------------------------------------------------- */
const SUBSIDIARIES = [
  {
    id: 'zanith-chc',
    sector: 'healthcare',
    name: 'Zanith CHC',
    tagline: 'NHS Continuing Healthcare advisory',
    description:
      'Zanith CHC helps families navigate NHS Continuing Healthcare funding — ' +
      'eligibility assessments, appeals and retrospective claims. The team works ' +
      'alongside families through a process most people meet only once, and only ' +
      'at the hardest possible time.',
    logo: 'assets/subsidiaries/zanith-chc.png',
    accent: 'sage',
    capabilities: [
      'Eligibility assessment support',
      'Appeals and reviews',
      'Retrospective claims',
      'Free initial consultation',
    ],
    proofPoints: [],            // CONFIRM before adding any figure
    status: 'operating',
    link: 'https://zanithchc.co.uk',
    regions: ['England'],
  },
  {
    id: 'carebreak',
    sector: 'healthcare',
    name: 'CareBreak',
    tagline: 'Respite cover for unpaid carers',
    description:
      'CareBreak connects unpaid carers with DBS-verified care workers so they ' +
      'can take a break without leaving anyone unsupported. Built as an ' +
      'accessible progressive web app with safeguarding and compliance handled ' +
      'in the product, not bolted on.',
    logo: 'assets/subsidiaries/carebreak.svg',
    accent: 'sage-bright',
    capabilities: [
      'Verified care worker matching',
      'Respite booking',
      'DBS and compliance tracking',
      'WCAG 2.2 AA accessible',
    ],
    proofPoints: [],
    status: 'in development',
    link: null,                 // CONFIRM — public URL when live
    regions: ['England'],
  },
  {
    id: 'logistics-future',
    sector: 'logistics',
    name: '[[ subsidiary name — not yet confirmed ]]',
    tagline: 'Freight and supply-chain logistics',
    description: '[[ description — confirm ]]',
    logo: null,
    accent: 'sage',
    capabilities: [],
    proofPoints: [],
    status: 'in development',
    link: null,
    regions: [],
  },
  {
    id: 'cnote-solutions',
    sector: 'software',
    name: 'CNote Solutions',
    tagline: 'Custom software, built end to end',
    description:
      'CNote Solutions designs and builds bespoke web and mobile software for ' +
      'the group and for external clients — from first specification through to ' +
      'deployment and support.',
    logo: 'assets/subsidiaries/cnote-solutions.svg',
    accent: 'sage-bright',
    capabilities: [
      'Web and mobile applications',
      'Product design and specification',
      'Systems integration',
      'Ongoing support',
    ],
    proofPoints: [],
    status: 'operating',
    link: null,                  // CONFIRM
    regions: [],                 // CONFIRM
  },
  {
    id: 'ngo-partnerships',
    sector: 'ngo',
    name: '[[ subsidiary name — not yet confirmed ]]',
    tagline: 'NGO and FCDO delivery partnerships',
    description: '[[ description — confirm ]]',
    logo: null,
    accent: 'sage',
    capabilities: [],
    proofPoints: [],
    status: 'in development',
    link: null,
    regions: [],
  },
  /* Printing is served by a partner (Yimi Paper), not a group subsidiary —
     see PARTNERS below. No printing subsidiary object exists on purpose. */
];

/* ----------------------------------------------------------------------------
   PARTNERS — independent companies the group works with but does NOT own.
   Kept separate from SUBSIDIARIES on purpose: partners are not part of the
   group and must never appear in the JSON-LD subOrganization list. Adding a
   partner means adding one object here and nothing else.
   -------------------------------------------------------------------------- */
const PARTNERS = [
  {
    id: 'yimi-paper',
    sector: 'printing',       // renders inside the Printing sector block
    name: 'Yimi Paper',
    tagline: 'Pop-up & sound book printing — China',
    description:
      'Yimi Paper is a professional pop up book & sound book printing manufacturer ' +
      'in China. We focus on children’s book and board game development and ' +
      'production for the over-sea market.',
    logo: 'assets/subsidiaries/yimi-paper.webp',
    status: 'future',         // 'future' | 'active'
    link: null,               // CONFIRM — public URL when available
    regions: ['China'],
  },
];

/* ----------------------------------------------------------------------------
   GROUP_STATS — the "at a glance" strip. Any null renders as a placeholder
   or is omitted entirely. Never substitute a guess.
   -------------------------------------------------------------------------- */
const GROUP_STATS = [
  { key: 'subsidiaries', label: 'Subsidiaries', value: SUBSIDIARIES.length },
  { key: 'sectors',      label: 'Sectors',      value: SECTORS.length },
  { key: 'regions',      label: 'Regions of operation', value: REGIONS.length },
  { key: 'founded',      label: 'Established',  value: GROUP.founded },
];

/* ----------------------------------------------------------------------------
   ENQUIRER TYPES — drives the conditional fields in the contact form.
   -------------------------------------------------------------------------- */
const ENQUIRER_TYPES = [
  { id: 'investor',   label: 'Investor or partner',
    followUp: { type: 'select', name: 'enquiry_type', label: 'Enquiry type',
                options: ['Investment', 'Partnership', 'Other'] } },
  { id: 'government', label: 'Government / NGO / procurement',
    followUp: { type: 'text', name: 'tender_ref',
                label: 'Tender or reference number' } },
  { id: 'client',     label: 'Client or customer', followUp: null },
  { id: 'supplier',   label: 'Supplier',
    followUp: { type: 'text', name: 'supply_type',
                label: 'What do you supply?' } },
];
