# NAC Limited — Logo Pack

Direction **2A · Sage / Sora**. Forest green body, sage tip.
All SVG text is converted to outlines — nobody needs Sora installed to view the files.

---

## 1. Colours

| Name | Hex | Use it for |
|---|---|---|
| Forest | `#25453A` | Main brand colour. Wordmark, dark backgrounds, buttons. |
| Sage | `#8FB79A` | Accent. Top chevron, tagline on light backgrounds. |
| Sage Tint | `#F4F6F3` | Page background behind the logo. |
| Off-White | `#EEF3EE` | Logo colour when it sits on forest green. |
| Tagline Sage | `#7FA98B` | Tagline only, on light backgrounds. |
| Sage Bright | `#A9CDB6` | Favicon only (needs extra contrast at 16px). |

Copy this into your CSS:

```css
:root {
  --nac-forest: #25453A;
  --nac-sage: #8FB79A;
  --nac-tint: #F4F6F3;
  --nac-offwhite: #EEF3EE;
  --nac-tagline: #7FA98B;
}
```

## 2. Type

- Typeface: **Sora** (Google Fonts, free).
- `NAC` → weight 800, letter-spacing `-0.02em`.
- `Limited` → weight 400, 50% opacity of forest.
- Tagline → weight 600, uppercase, letter-spacing `0.22em`.

Add Sora to your site:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet">
```

## 3. Which file do I use?

| Situation | File |
|---|---|
| Site header, light background | `svg/nac-logo-horizontal.svg` |
| Site header, dark/forest background | `svg/nac-logo-horizontal-reversed.svg` |
| Header is short on space | `svg/nac-logo-horizontal-notagline.svg` |
| Footer, centred | `svg/nac-logo-stacked-reversed.svg` |
| Just the icon | `svg/nac-mark.svg` |
| Icon on forest green | `svg/nac-mark-reversed.svg` |
| Icon on sage green | `svg/nac-mark-on-sage.svg` |
| Icon under 32px (app bar, favicon) | `svg/nac-mark-compact.svg` |
| Fax, stamp, engraving, one-colour print | `svg/*-mono-black.svg` / `*-mono-white.svg` |
| Email signature | `png/email-signature-320.png` |
| Facebook / LinkedIn / X share card | `social/og-image-1200x630.png` |
| Profile picture | `social/avatar-1000.png` |

Use SVG on the web. Use PNG only where SVG is not allowed (email, some print portals).

## 4. Clear space

Leave empty space around the logo equal to **the height of one chevron**
(about 25% of the mark's height). Nothing else goes inside that space.

## 5. Minimum sizes

- Horizontal logo with tagline: **180px** wide minimum.
- Horizontal logo without tagline: **120px** wide.
- Full mark: **28px**.
- Below 28px use the compact mark (two chevrons).

## 6. Don't

- Don't recolour the chevrons outside the palette above.
- Don't stretch, rotate, or add a drop shadow.
- Don't put the colour logo on a busy photo — use `-mono-white` on a dark overlay.
- Don't retype the tagline in another font.
- Don't place the forest version on a sage background — use `-on-sage`.

## 7. Web install

See `web/head-snippet.html` and `web/site.webmanifest`.
Copy everything in `favicon/` to the root of your site (`/public` in Next.js).
