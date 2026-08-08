# Nitamur Ad Caelum Ltd — group website

The public website for **Nitamur Ad Caelum Ltd** (NAC Limited), a UK holding company
backing operating businesses across five sectors. One hand-written page, no build step,
no framework — it opens straight from `index.html` and deploys unchanged to any static host.

```
/
├── index.html                  the page
├── assets/
│   ├── css/site.css            tokens, chevron dividers, keyframes, motion
│   ├── js/site.data.js         ← EDIT THIS: all group + subsidiary data
│   ├── js/site.js              render, observers, motion, form (rarely needs edits)
│   ├── logo/                   NAC logo pack (SVG)
│   ├── subsidiaries/           subsidiary logos (drop SVGs here)
│   └── social/og-image-1200x630.png
├── favicon.ico / favicon.svg / apple-touch-icon-180.png / icon-*.png
├── site.webmanifest
├── robots.txt / sitemap.xml
└── README.md
```

**One rule that keeps the site maintainable:** all content lives in
[`assets/js/site.data.js`](assets/js/site.data.js). The page renders itself from those
constants. You should almost never touch `index.html` or `site.js` to change what the site says.

---

## Edit a subsidiary

1. Open [`assets/js/site.data.js`](assets/js/site.data.js).
2. Find the subsidiary object inside the `SUBSIDIARIES` array (each has an `id`).
3. Edit its fields:

   | Field | What it does |
   |---|---|
   | `name` | Business name (heading + logo fallback). |
   | `sector` | Must match a `SECTORS` `id` — controls which block it appears in. |
   | `tagline` | One line under the name. |
   | `description` | The paragraph. |
   | `logo` | Path to its SVG in `assets/subsidiaries/`. |
   | `capabilities` | Array of chips. Empty array = no chips. |
   | `proofPoints` | Array of proof lines. **Leave empty until you have real, confirmed figures** — never invent one. |
   | `status` | `'operating'` or `'in development'` — drives the badge. |
   | `link` | Public URL, or `null` if the site isn't live. |
   | `regions` | Array of regions — feeds the "Reach" section. |

4. Save and reload. No build, no restart.

**Placeholders are deliberate.** Any value left as `null` or written with `[[ ... ]]`
renders as a visibly unfinished, dashed placeholder — so an unconfirmed field can never be
shipped by accident. Replace the placeholder text with the real value to finish it.

### Add a subsidiary logo
Drop an SVG (or PNG) into `assets/subsidiaries/` and point the subsidiary's `logo` field at it,
e.g. `logo: 'assets/subsidiaries/zanith-chc.svg'`. Supply a version that reads on the light
`#F4F6F3` background. If the file is missing, the card automatically falls back to the
subsidiary name set in Sora 800 — the site still looks finished.

---

## Add a sixth (or seventh) subsidiary

Add **one object** to the `SUBSIDIARIES` array in `assets/js/site.data.js`. Nothing else,
anywhere. The card, the nav, the "subsidiary of interest" form dropdown, the sitemap-worthy
anchor, and the JSON-LD `subOrganization` list all update themselves.

```js
{
  id: 'new-co',                 // unique slug
  sector: 'software',           // must match a SECTORS id
  name: 'New Co',
  tagline: 'What it does in a line',
  description: 'A short paragraph.',
  logo: 'assets/subsidiaries/new-co.svg',
  accent: 'sage',
  capabilities: ['One', 'Two'],
  proofPoints: [],              // keep empty until figures are confirmed
  status: 'operating',
  link: 'https://newco.example',
  regions: ['England'],
}
```

If the new business belongs to a brand-new sector, add a `{ id, label }` to the `SECTORS`
array too (that array drives the section order, the nav and the progress rail).

---

## Connect the enquiry form (Web3Forms)

The form is fully built. Until a key is added it validates normally but shows a clear
**"not yet connected"** message instead of sending — it never fails silently.

1. Go to **https://web3forms.com**, enter the delivery email
   (`hello@NitamurAdCaelum.co.uk`) and copy the free **access key**.
2. Open [`assets/js/site.data.js`](assets/js/site.data.js) and set:

   ```js
   const WEB3FORMS_KEY = 'your-access-key-here';
   ```

3. Save and reload. Submissions now POST to Web3Forms and arrive by email.
   Success and failure states are handled for you.

No server, no backend, no account beyond the free Web3Forms signup.

---

## Deploy

The site is static — upload the whole folder as-is. Nothing to build.

### GitHub Pages
1. Push this folder to a GitHub repository.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch.**
3. Pick your branch and the `/ (root)` folder. Save.
4. Your site publishes at `https://<user>.github.io/<repo>/`.
   For the apex domain, add a `CNAME` file containing `nitamuradcaelum.co.uk` and set the DNS.

### Netlify
1. **Add new site → Deploy manually**, then drag the project folder onto the drop zone
   (or connect the Git repo).
2. Build command: **none.** Publish directory: **`.`** (the root).
3. Add the custom domain under **Domain settings**.

### Cloudflare Pages
1. **Create a project → Connect to Git** (or **Direct Upload** the folder).
2. Framework preset: **None.** Build command: **empty.** Build output directory: **`/`**.
3. Save and deploy, then add the custom domain under **Custom domains**.

> After deploying to a real domain, confirm the domain in
> `GROUP.domain` (`assets/js/site.data.js`) and the absolute URLs in `index.html`,
> `robots.txt` and `sitemap.xml` match it — they currently assume
> `https://nitamuradcaelum.co.uk`.

---

## The Reach section (country outlines)

Reach currently uses a **typographic treatment** of the four regions (Sora 600, uppercase,
0.22em tracking, chevron ticks), not country silhouettes. Accurate, projection-consistent
public-domain geometry could not be sourced and verified during the build, and a wrong-shaped
outline reads as a mistake to a government/NGO audience. To add real silhouettes later: drop
verified simplified paths (Natural Earth or Wikimedia public-domain SVGs) for England, South
Africa, Zimbabwe and Malawi into the Reach render in `site.js`, each normalised to its own
`viewBox`, forest fill on light / sage on dark, `aria-hidden="true"`, with the region names kept
as real text for screen readers.

> Note on **England vs UK**: the group operates in **England**, not the whole UK, so the label
> reads "England". If a subsidiary later trades UK-wide, update `REGIONS` in `site.data.js`.

## Outstanding placeholders (to confirm, not invent)

Resolved so far: group founded (2014), regions (England, South Africa, Zimbabwe, Malawi),
and logos for Zanith CHC, CareBreak, CNote Solutions and Yimi Paper. 1920 VPT Ltd has been
removed; its Logistics slot is now a "Coming 2026" placeholder. Printing has no group subsidiary
— it is served by the partner **Yimi Paper**, which shows in the Printing sector as a muted
"Coming 2026" future-partner card. Partners are companies the group works with but does not own,
so they are kept out of the JSON-LD `subOrganization` list.

Still to confirm — these stay as `null`/placeholder until supplied:

- Web3Forms access key
- Logistics subsidiary — name and description (currently "Coming 2026")
- NGO / FCDO subsidiary — name
- Yimi Paper — public URL (`link`) when available
- Privacy policy — retention period and international-transfer details (`privacy.html`)
- The live domain (assumed `nitamuradcaelum.co.uk`)
- Whether Zanith CHC is a subsidiary or a partnership — wording depends on the answer

### Add or edit a partner
Partners live in the `PARTNERS` array in `site.data.js` — same shape as a subsidiary, plus a
`status` of `'future'` or `'active'`, and a `sector` matching a `SECTORS` id so the card renders
inside the right sector block (a `'future'` partner gets the muted "Coming 2026" treatment). Add
one object to show a new partner; partners never appear as group subsidiaries or in the JSON-LD.
