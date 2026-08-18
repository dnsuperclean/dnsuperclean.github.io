# DNsuperclean — website

Three-page static site for **DN Super Clean** (DNsuperclean), a residential and commercial
cleaning company serving Tampa and the Tampa Bay area.

Plain HTML + CSS + a small vanilla JS file. No build step, no dependencies, no framework.
Open `index.html` in a browser, or drop the whole folder onto Netlify / Vercel / GitHub Pages
/ Cloudflare Pages.

---

## ⚠️ Before publishing — one thing to fix

**The email address is a placeholder.** Nothing in the source material gave a real inbox, so
the site uses `hello@dnsuperclean.com`. Replace it everywhere:

```bash
cd ~/Sites/dnsuperclean && grep -rl "hello@dnsuperclean.com" . | xargs sed -i '' "s/hello@dnsuperclean.com/REAL_EMAIL_HERE/g"
```

It appears twice per page (contact list + "Email Us" button) across all three pages. It is
deliberately **not** in the structured data, so search engines never ingest a fake address.

Also swap the domain if it isn't `dnsuperclean.com` — it's used in canonicals, Open Graph
URLs, `sitemap.xml`, `robots.txt` and the JSON-LD:

```bash
cd ~/Sites/dnsuperclean && grep -rl "dnsuperclean.com" . | xargs sed -i '' "s|https://dnsuperclean.com|https://YOUR-DOMAIN.com|g"
```

---

## Pages

| File | Title | Purpose |
|---|---|---|
| `index.html` | DNsuperclean \| Professional Cleaning Services in Tampa Bay, FL | Hero, services overview, team video, why us, 18-photo gallery, service area, FAQ, contact |
| `services.html` | Cleaning Services in Tampa Bay \| DNsuperclean | All six services in depth — what's included, who it's for, CTA — plus add-ons, how it works, areas, why us, contact |
| `about.html` | Who We Are & Areas We Serve in Tampa Bay \| DNsuperclean | Company story, both team videos, why choose us, service areas as expandable regions, contact |

## Services (all six taken from the business's own posts and profile)

Regular Cleaning · Deep Cleaning · Move-In / Move-Out · Post-Construction ·
Airbnb & Vacation Rental · Office & Commercial

## Service areas (only cities actually evidenced in the source photos)

**Hillsborough** — Tampa, South Tampa, Hyde Park, Downtown Tampa, Bayshore Boulevard
**Pinellas** — St. Petersburg, Clearwater, Clearwater Beach, Largo, Belleair, Treasure Island
**Pasco** — New Port Richey

To add more cities she serves, edit the `.area-card` lists in all three pages, the
`areaServed` array in the `index.html` JSON-LD, and the `.footer-areas` paragraph.

## Facts used — and deliberately not used

**Used** (all evidenced by the logo, Instagram profile or post captions): business name,
phone `(813) 638-3518`, Instagram `@dnsuperclean`, "Residential & Commercial", "Fully
Insured", "Free Estimates", "Tampa Bay, FL", the six services, the cities above.

**Deliberately omitted** — no source, so nothing is claimed anywhere on the site or in the
structured data: street address, opening hours, prices, ratings, review counts, years in
business, team size, certifications, awards, guarantees.

## The quote form

Every page has a **Get a Free Quote** form in its contact section (`#quote`) —
service · address/area · phone · details · submit. All the "Get a Free Quote" buttons,
including the sticky mobile bar, scroll to it.

**It needs no backend.** On submit it validates the fields, composes the request, and hands
it to the phone's Messages app addressed to `(813) 638-3518` — so it lands directly on her
phone, the same channel she already tells people to use. The page then shows the composed
text with a **Copy details** button and a Call button, so it still works on desktop where
there's no SMS handler.

**To use a real form service instead** (Formspree, Web3Forms, Netlify Forms — anything that
accepts a JSON POST), set the endpoint at the top of the quote-form block in `site.js`:

```js
var QUOTE_ENDPOINT = 'https://formspree.io/f/XXXXXXX';
```

With that set, the form POSTs `{service, address, phone, details}` as JSON and shows a
"Request sent" confirmation instead of opening Messages. If the POST fails it falls back to
telling the visitor to call.

## Assets

```
assets/
  favicon.svg                 favicon (droplet, rounded square, works at 16px)
  logo-mark.svg               droplet emblem — header, footer, section watermarks
  logo-badge.svg              full circular badge — hero, apple-touch-icon
  gallery/                    18 job photos, cropped from the Instagram screenshots,
                              SEO-named, ≤1100px, progressive JPEG (~2.3 MB total)
  video/                      2 clips (H.264, faststart) + poster frames
```

`logo-mark.svg` and `logo-badge.svg` are vector recreations of the DN Super Clean logo,
built to match its colours and water-droplet form. **If you have the original logo files,
drop them in as `assets/logo-mark.png` and `assets/logo-badge.png` and update the `src`
attributes** — the real artwork will look better than the recreation.

The photos and videos keep the original DN Super Clean watermark burned in, as intended.

## Brand colours (sampled from the logo)

| | |
|---|---|
| Deep navy | `#100e33` → `#322a7c` |
| Water blue | `#a9e2ff` → `#5cc6f5` → `#1568c2` |
| Lime green | `#8dc63f` |
| Gold | `#e0b15c` |

The blue→green→gold gradient is reused for every section rule and wave divider, and the
droplet appears as a faint watermark behind most sections, so the logo carries the whole page.

## SEO

- Unique `<title>` + meta description + canonical per page
- Open Graph + Twitter card per page
- JSON-LD: `HouseCleaningService` (+ `@id` referenced by the other pages), `WebSite`,
  `FAQPage`, `ItemList` of services, `AboutPage`, `BreadcrumbList` ×2
- Descriptive, city-bearing image filenames and `alt` text on all 34 images
- `sitemap.xml` + `robots.txt`
- Internal linking between services ↔ areas ↔ home

## Local preview

```bash
cd ~/Sites/dnsuperclean && python3 -m http.server 8899
```

Then open http://127.0.0.1:8899 — a server is needed rather than `file://` so the
videos and JSON-LD behave normally.
