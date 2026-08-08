# BUILD PROMPT — Nitamur Ad Caelum Ltd group website

> Paste everything below the line into Claude Code.
> Fill every `<<FILL>>` first. Anything left blank must be built as a clearly-marked placeholder, never invented.

---

## 0. Role

You are the lead front-end developer and design lead building the public website for **Nitamur Ad Caelum Ltd**, a UK holding company. This is the group's only web presence and it carries real commercial weight — investors, government buyers and end clients will all judge the group from this one page. Build it to that standard.

Do not scaffold and stop. Deliver a finished, deployable site.

---

## 1. The company

- **Legal name:** Nitamur Ad Caelum Ltd
- **Trading name / short form:** NAC Limited
- **Registered:** England & Wales
- **Company number:** 09115910
- **Registered office:** 103 Stone Drive, Shifnal, Shropshire, TF11 9LX, United Kingdom
- **Group contact email:** hello@NitamurAdCaelum.co.uk
- **Group phone:** +44 7864 125677
- **Motto:** *Nitamur Ad Caelum* — "We aim higher"

Nitamur Ad Caelum Ltd is a holding company. It does not sell a product itself. It owns and backs operating subsidiaries across five sectors:

**Six subsidiaries across five sectors.** Healthcare holds two. The page has five sector sections; the healthcare section carries two subsidiary cards.

| Sector | Subsidiary | Status |
|---|---|---|
| Healthcare | Zanith CHC — zanithchc.co.uk | Operating |
| Healthcare | CareBreak | In development |
| Logistics | 1920 VPT Ltd | Confirm |
| Software | CNote Solutions | Operating |
| NGO / FCDO partnerships | *Not yet named — placeholder* | In development |
| Printing | *Not yet named — placeholder* | In development |

Each subsidiary has its own real name and its own logo. Treat them as distinct brands the group stands behind — not as service lines of one firm.

**All group and subsidiary data is already written for you in `assets/js/site.data.js`.** Read it first. It defines `GROUP`, `SECTORS`, `SUBSIDIARIES`, `GROUP_STATS`, `ENQUIRER_TYPES` and `WEB3FORMS_KEY`. Build the render logic around those constants — do not re-key them, do not move them inline, do not overwrite the confirmed values.

Adding a seventh subsidiary must mean adding one object to `SUBSIDIARIES` and nothing else, anywhere.

Every field marked `CONFIRM` or containing `[[ ... ]]` must render as a **visibly unfinished placeholder** — a dashed outline, muted text, whatever makes it obvious. It must be impossible to publish one by accident.

---

## 2. Audience — all three carry equal weight

The page must satisfy three readers at once. Do not let one crowd out the others.

1. **Investors and partners** — want to see group scale, sector spread, governance and where the upside is. Give them: group-level positioning, subsidiary status, proof points, a clear "partner with us" route.
2. **Government and NGO procurement** (FCDO, ICBs, multilaterals, ministries) — want to see legitimacy, delivery record, compliance and jurisdiction. Give them: UK registration on show, named registered office, delivery regions, a procurement/tender enquiry route in the form.
3. **Clients of the subsidiaries** — want the operating company, not the parent. Give them: each subsidiary clearly named and self-contained, with a direct route to that subsidiary.

Build one enquiry form with an **"I am enquiring as"** selector covering these three plus "Supplier". The selected value changes the follow-up fields shown.

---

## 3. Stack — hard constraints

- **Static site. No build step. No npm install. No framework.**
- `index.html` — a single page, hand-written HTML.
- **Tailwind via CDN** (`https://cdn.tailwindcss.com`), configured inline with `tailwind.config` for the brand tokens below.
- Vanilla JS in two files: `assets/js/site.data.js` (already written — load it first) and `assets/js/site.js` (you write it). No bundler, no imports that need a server.
- Sora from Google Fonts, weights 400 / 600 / 800, with `display=swap` and preconnect.
- Must open correctly from `file://` **and** deploy unchanged to GitHub Pages, Netlify or Cloudflare Pages.
- No jQuery. No animation library unless it is a single CDN script under 15KB — prefer the native Web Animations API, CSS transitions and `IntersectionObserver`.

Add a `<noscript>` fallback: all content visible, animations skipped.

---

## 4. Brand tokens — use these exactly

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        forest:   '#25453A',
        'forest-deep': '#152A22',
        sage:     '#8FB79A',
        'sage-bright': '#A9CDB6',
        tint:     '#F4F6F3',
        offwhite: '#EEF3EE',
        tagline:  '#7FA98B',
      },
      fontFamily: { sans: ['Sora', 'system-ui', 'sans-serif'] },
    }
  }
}
```

Type rules, non-negotiable:
- `NAC` → weight 800, letter-spacing `-0.02em`
- `Limited` → weight 400, 50% opacity of the surrounding colour
- Tagline / eyebrows → weight 600, uppercase, letter-spacing `0.22em`
- Body → weight 400, generous line-height (1.6+)

**The mark** is three ascending chevrons in a 64×64 box:

```
M32 4 L60 26 L48 26 L32 13 L16 26 L4 26 Z    fill sage
M32 24 L60 46 L48 46 L32 33 L16 46 L4 46 Z   fill forest (offwhite on dark)
M32 42 L52 58 L42 58 L32 50 L22 58 L12 58 Z  fill forest @0.28 (offwhite @0.35 on dark)
```

Logo assets live in `assets/logo/` — use `nac-logo-horizontal-reversed.svg` in the dark header, `nac-logo-horizontal.svg` on light, `nac-mark-*.svg` for the icon alone. Do not retype the wordmark in HTML where an SVG exists.

---

## 5. Design direction — bold and immersive

This is a holding company that says it aims higher. The page should feel like ascent, not like a corporate brochure.

**Ground rule:** forest green is the dominant surface, not the accent. The page opens dark and stays dark through the group narrative, then breaks to light for the subsidiaries so each brand can breathe, then returns to dark for contact. That dark → light → dark arc is the spine of the design.

**Signature element — the ascent.** The chevron is the whole visual system:

- The hero renders one large chevron mark that **draws itself on load**: the three chevrons rise into place bottom-to-top, sage arriving last at the apex. One orchestrated moment, ~1.2s, then it settles and never repeats.
- A thin **fixed progress rail** down the right edge shows five chevron ticks — one per sector. It fills as the reader descends, and the active tick expands. It doubles as navigation.
- **Section dividers are chevron-shaped**, not straight rules: use `clip-path: polygon()` to cut an angled apex between sections, echoing the mark. Keep the angle identical to the logo's (28 across, 22 down).
- Subsidiary cards enter on scroll with a short upward translate and fade, staggered by ~80ms. Each card's number is rendered as a chevron tick count, not `01 / 02 / 03`.

**Explicitly avoid:** cream backgrounds, terracotta or warm-clay accents, acid-green-on-black, generic gradient blobs, glassmorphism cards, stock photography of handshakes or skylines. If you need imagery, use the chevron geometry, large type and colour fields instead.

**Spend the boldness on the hero and the rail. Everything else stays disciplined:** generous whitespace, one accent per section, no decorative element that does not carry information.

---

## 6. Page structure — one page, in this order

1. **Header** — fixed, transparent over the hero, gains a forest background with blur on scroll. Reversed logo left; anchor links to the five subsidiaries plus Contact; a single sage CTA button.
2. **Hero** — full viewport, forest-deep. Animated chevron mark. `NAC Limited` wordmark, the Latin motto, then one sentence stating plainly what the group is (a UK holding company backing operating businesses across five sectors). Two CTAs: "Explore the group" (scrolls) and "Start an enquiry". A subtle scroll cue at the base.
3. **Group at a glance** — a strip of four group-level figures: subsidiaries, sectors, regions of operation, year founded. Numbers count up once on entry. Values come from a `GROUP_STATS` array — leave any unknown as a placeholder, never invent a figure.
4. **What the group does** — three short columns answering the three audiences directly: *For investors* / *For governments and NGOs* / *For clients*. Two sentences each. This is where the equal weighting is made explicit.
5. **The subsidiaries** — light section (`tint`). Five sector blocks in `SECTORS` order, each rendering the subsidiaries filtered from `SUBSIDIARIES` by `sector`. Healthcare shows two cards side by side; the rest show one. For each card: sector eyebrow, subsidiary logo, name, tagline, description, capability chips, proof points, status badge, and a link to its own site if `link` is set. Alternate the block layout left/right down the page so it reads as a sequence, not a grid of tiles. If `logo` fails to load, fall back to the subsidiary name set in Sora 800.
6. **How we operate** — four short principles the holding company applies to every subsidiary (governance, capital, shared services, delivery standards). Write these as real, specific copy, not filler.
7. **Reach** — where the group operates. A simple list or minimal chevron-marked map of regions pulled from the subsidiaries' `regions` values. No heavy map library.
8. **Contact** — forest background. The enquiry form (section 7 below), plus registered office, company number and group email in a clean block.
9. **Footer** — reversed stacked logo, motto, subsidiary name list, registered office, company number, © year, and a line stating Nitamur Ad Caelum Ltd is registered in England & Wales.

---

## 7. The enquiry form

Use **Web3Forms** — free, no account backend, works on any static host, no server code.

- Endpoint: `POST https://api.web3forms.com/submit`
- Hidden input: `<input type="hidden" name="access_key" value="">` — populated from `WEB3FORMS_KEY` in `site.data.js`
- Include a honeypot field (`name="botcheck"`, hidden) — Web3Forms uses it for spam filtering.

Fields:
- Full name *(required)*
- Email *(required, validated)*
- Organisation
- Country
- **I am enquiring as** *(required select)*: Investor or partner · Government / NGO / procurement · Client or customer · Supplier
- **Subsidiary of interest** *(select, populated from `SUBSIDIARIES` plus "Group / not sure")*
- Message *(required, min 20 chars)*
- Consent checkbox *(required)*: agreement to be contacted about this enquiry

Conditional follow-up: render it from the `followUp` object on each entry in `ENQUIRER_TYPES`. Do not hard-code the four cases.

Behaviour:
- Validate client-side before submit; inline errors under each field, described by `aria-describedby`, error text never colour-only.
- Submit via `fetch`, no page reload. Disable the button and show a spinner while in flight.
- On success: replace the form with a confirmation panel stating the enquiry was received and a reply will follow. On failure: show a clear error and the group email as a fallback route.
- Errors explain what went wrong and how to fix it. No apologising, no vague copy.

If `WEB3FORMS_KEY` is still the placeholder, wire the form fully but show a clear "not yet connected" state on submit instead of posting. Never fail silently.

---

## 8. Accessibility and performance floor

Build to this without announcing it in the UI:

- Semantic landmarks: `header`, `nav`, `main`, `section` with `aria-labelledby`, `footer`.
- Full keyboard operation. Visible focus ring in sage on every interactive element. Skip-to-content link.
- Colour contrast ≥ 4.5:1 for body text. Check sage on forest — if it fails, use `sage-bright`.
- `@media (prefers-reduced-motion: reduce)` disables the hero sequence, the count-ups and all scroll reveals. Content renders in final state immediately.
- Every image and inline SVG has a text alternative; decorative chevrons get `aria-hidden="true"`.
- Responsive from 320px to 2560px. Test 375, 768, 1440. Nothing horizontally scrolls.
- Mobile nav: full-screen forest overlay, chevron-marked links, closes on Escape and on selection, traps focus while open.
- No layout shift on font load. Lazy-load anything below the fold. Target first paint under 1.5s on 4G.

---

## 9. SEO, metadata and icons

- `<title>`: `Nitamur Ad Caelum Ltd — We aim higher`
- Meta description naming all five sectors.
- Canonical URL from `GROUP.domain`.
- Open Graph and Twitter card tags pointing at `assets/social/og-image-1200x630.png`, 1200×630 declared.
- `theme-color` `#25453A`.
- Favicon wiring: `favicon.ico`, `favicon.svg`, `apple-touch-icon-180.png`, `site.webmanifest`.
- JSON-LD `Organization` schema built from `GROUP`: `legalName` Nitamur Ad Caelum Ltd, `identifier` 09115910, `url`, `logo`, `email`, `telephone`, `address` as a `PostalAddress` (103 Stone Drive, Shifnal, Shropshire, TF11 9LX, GB), and a `subOrganization` array of all six subsidiaries. Omit `foundingDate` — not confirmed.
- One `<h1>` only. Logical heading order. Descriptive anchor text — never "click here".
- `robots.txt` and a `sitemap.xml` with the anchor sections.

---

## 10. Files to produce

```
/
├── index.html
├── assets/
│   ├── css/site.css              custom properties, clip-path dividers, keyframes
│   ├── js/site.data.js           PROVIDED — GROUP, SECTORS, SUBSIDIARIES, stats
│   ├── js/site.js                render, observers, motion, form
│   ├── logo/                     the NAC logo pack SVGs
│   ├── subsidiaries/             five subsidiary logos
│   └── social/og-image-1200x630.png
├── favicon.ico
├── favicon.svg
├── apple-touch-icon-180.png
├── icon-192.png
├── icon-512.png
├── site.webmanifest
├── robots.txt
├── sitemap.xml
└── README.md
```

`README.md` must explain, in plain steps: how to edit a subsidiary, how to add a sixth, where to paste the Web3Forms key, and how to deploy to GitHub Pages, Netlify and Cloudflare Pages.

---

## 11. Copy rules

Write all body copy yourself — do not leave lorem ipsum. But:

- **Never invent a fact.** No made-up revenue, headcount, client names, awards, founding year or contract wins. If a number is needed and not supplied, use a clearly-marked placeholder like `[[ figure — confirm ]]` so it is impossible to ship by accident.
- Plain verbs, sentence case, active voice. Say what the group does, do not sell it.
- A button says exactly what happens: "Send enquiry" produces "Enquiry sent".
- The Latin motto appears translated the first time it is used, then may stand alone.
- Never call the subsidiaries "solutions", "verticals" or "synergies".

---

## 12. Build order

1. Set up the file structure, Tailwind config, fonts and tokens. Confirm colours render.
2. Build the data layer — `SUBSIDIARIES` and `GROUP_STATS` — with placeholders.
3. Build the static HTML for every section, unstyled, semantic, all content present.
4. Style it. Dark → light → dark arc first, then type scale, then components.
5. Add the chevron dividers and the progress rail.
6. Add motion last: hero sequence, count-ups, scroll reveals. Then add the reduced-motion overrides.
7. Wire the form, including conditional fields and both success and error states.
8. Metadata, JSON-LD, icons, manifest, robots, sitemap.
9. Self-review against the checklist. Fix what fails. Report what you could not do.

---

## 13. Acceptance checklist — verify each before you report done

- [ ] Opens from `file://` with no console errors
- [ ] All five subsidiaries render from the array; adding a sixth object needs no other change
- [ ] Every `<<FILL>>` is either filled or surfaced as an obvious placeholder — none silently invented
- [ ] Form validates, submits, and shows both success and failure states
- [ ] Conditional form fields appear and hide correctly for all four enquirer types
- [ ] Keyboard-only pass: reach and operate every control, including the mobile nav
- [ ] `prefers-reduced-motion` kills all animation, content still complete
- [ ] No horizontal scroll at 320px
- [ ] Contrast checked on forest, sage and tint surfaces
- [ ] JSON-LD validates as an `Organization` with five `subOrganization` entries
- [ ] `README.md` explains editing, the form key and deployment
- [ ] The page does not resemble a generic corporate template — the chevron system is visibly the organising idea

---

## 14. Before you start

The repo already contains the full asset scaffold: all NAC logo SVGs in `assets/logo/`, favicons and manifest at root, the OG image in `assets/social/`, `BRAND.md` in `assets/`, and `assets/js/site.data.js` filled with confirmed data. Subsidiary logos are not in yet — `assets/subsidiaries/README.txt` lists the six expected filenames. Build the fallback so the site looks finished without them.

Outstanding, to be surfaced as placeholders, not invented:

- Web3Forms access key
- 1920 VPT Ltd — exact legal name, tagline, description, regions
- NGO/FCDO subsidiary — name and description
- Printing subsidiary — name and description
- Year the group was established
- Regions of operation count
- Live domain (assumed `nitamuradcaelum.co.uk`)
- The six subsidiary logo files

List back to me, in one short block, every one of these you could not resolve and any assumption you intend to make. Then build without stopping again.
