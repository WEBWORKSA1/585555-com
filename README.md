# 585555.com — I Prosper (我发)

The Chinese prosperity toolkit for business. Free tools and guides to help businesses sell to Chinese-speaking customers: lucky pricing, number scoring, opening dates, red envelopes, gift etiquette and a campaign calendar. It also includes lead generation, sponsorship, donations, contests and careers.

Static site, **GitHub Pages (free plan)**. No server needed.

- Research & business case: [`docs/RESEARCH.md`](docs/RESEARCH.md)
- 26-site competitive audit: [`docs/SITE-AUDIT.md`](docs/SITE-AUDIT.md)
- Phase-wise build prompt & roadmap: [`docs/BUILD-PROMPT.md`](docs/BUILD-PROMPT.md)

## Structure
```
_src/pages/*.html     page sources (JSON header + body)
_src/build.py         builds root *.html, sitemap.xml, assets/js/search-index.js
assets/css/style.css  design system (light/dark)
assets/js/config.js   ALL settings: AdSense, GA4, donate links, YouTube, contest, form relay
assets/js/numbers.js  number / price / lunar date / red envelope / gift engines
assets/js/lunar-data.js  lunar month starts 2025–2031 + Lunar New Year dates 2024–2040
assets/js/main.js     UI, forms, tools, ads, consent, videos
```

## Edit & rebuild
```bash
python3 _src/build.py                 # regenerate pages
python3 -m http.server 8000           # preview at http://localhost:8000
```
Commit the generated files. GitHub Pages serves the repo root as-is (`.nojekyll`).

## Go-live checklist
1. **Forms:** submit any form once on the live site. FormSubmit sends a one-time activation email to the site inbox; click it. Optionally paste the random alias it gives you into `relayAlias` in `config.js`. The inbox address is stored encoded and never rendered.
2. **Custom domain:** in *Settings → Pages → Custom domain*, enter `585555.com`. Then add these records at your registrar:
   - `A @` → 185.199.108.153 / .109.153 / .110.153 / .111.153
   - `CNAME www` → `webworksa1.github.io`
   
   Finally, tick *Enforce HTTPS*.
3. **AdSense:** set `adsenseClient` and `adSlots` in `config.js` and uncomment the line in `ads.txt`.
4. **Donations:** add payment links to `config.donate`.
5. **YouTube:** add video IDs and the channel URL in `config.js`.

## Legal
See `legal.html`. "585555" is used only as a numeral and domain name. The site is not affiliated with 58.com/58同城, the "555" brand, or any platform mentioned. Interested in the website or domain? https://web.works/contact

© 585555.com. All rights reserved.
