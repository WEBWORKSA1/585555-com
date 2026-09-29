# 585555.com — Phase-wise Build Prompt

Use these prompts in order with an AI coding assistant, or as a spec for a developer. Each phase is self-contained and ends with acceptance criteria. Phases 1–6 are implemented in this repo; 7–9 are the growth roadmap.

---

## Global context (paste before every phase)

> You are building **585555.com**, a static, responsive and interactive website hosted free on **GitHub Pages** (no server, no build step on the host). The concept: **"585555 — I Prosper (我发)"**, free tools and guides that turn Chinese prosperity culture into business results (pricing, numbers, launch dates, gifting, campaigns) for businesses selling to Chinese-speaking and Asian customers.
>
> **Hard rules:**
> 1. On top of **every** page show: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership", linked to `https://web.works/contact`.
> 2. All forms deliver to a single owner inbox, which must **never appear** in HTML, visible text, `mailto:` links or plain-text JS. Store it encoded (XOR + reversed char codes) in `assets/js/config.js`, decode at submit time only, and post via FormSubmit AJAX. After activation, swap in FormSubmit's random alias (`relayAlias`) so no copy of the address remains.
> 3. No trademark use of "585555" beyond the numeral/domain; no affiliation with 58.com/58同城, the "555" brand, or platforms named. Include a Trademark & Copyright Disclosure page.
> 4. Must monetise with Google AdSense (consent-gated, policy-compliant placement), YouTube embeds, sponsorships, lead generation and donations.
> 5. Stack: HTML + CSS + vanilla JS. Pages are Jekyll pages (YAML front matter + HTML) rendered by GitHub Pages with one shared `_layouts/default.html` and `_includes/`. Relative links only (works at `username.github.io/repo/` and at the custom domain).
> 6. Accessibility (WCAG AA), mobile-first (no horizontal scroll at 375px), light/dark mode, Lighthouse ≥ 90.

---

## Phase 1: Foundation & design system
**Prompt:**
> Create the repo structure: `_config.yml`, `_layouts/default.html`, `_includes/{aside,crumb}.html`, `assets/css/style.css`, `assets/js/{config,numbers,main,lunar-data,search-index}.js`, `assets/img/`, `docs/`. Design tokens: cinnabar `#B3202A`, imperial gold `#C9A227`, jade `#1F7A5C`, ink `#1B1718`, rice paper `#FAF6EE`, with dark-mode overrides under `prefers-color-scheme` and `[data-theme]`. Fonts: Noto Serif (headings) and Inter (UI). Components: interest bar, sticky header with mobile menu and theme toggle, buttons, cards, tags, grids, forms, multi-step forms, results panels, calendar grid, accordions, countdowns, progress bars, video cards, ad slots, footer, cookie banner, toast, back-to-top. The layout wraps each page with a shared head (SEO meta, canonical, OG/Twitter, JSON-LD by front-matter `type`), header, footer and scripts; `jekyll-sitemap` writes `sitemap.xml` and a Liquid template writes the search index.
>
> **Accept when:** GitHub Pages builds all pages without errors; the interest bar and footer are on every page; no overflow at 375px.

## Phase 2: Prosperity engines (`numbers.js`)
**Prompt:**
> Implement: (a) `analyze(number)`: digit weights (8:+8, 6/9:+5, 2:+3, 3:+2, 0/1/5:+1, 7:0, 4:−10), a combination dictionary (168, 518, 58, 88, 888, 8888, 1688, 666, 999, 1314, 520, 28, 68, 98, 585555, 5555, 250, 14, 24, 74, 514, 748, 7456, 38, 44), ending bonus, repeat bonus, 0–100 score, verdict, tips. (b) `luckyPrices(price)`: candidates within −12%/+15% built from lucky tails (8, 88, 888, 168, 688…), no digit 4, ranked by score minus distance, with nearest-below and nearest-above. (c) Lunar conversion from precomputed month-start tables (`lunar-data.js`, generated with the `lunardate` library for 2025–2031) plus a Lunar New Year date map. (d) `rateDay(date, purpose)`: God of Wealth Day, New Year period, Ghost Month (7th lunar month), Qingming, Mid-Autumn, digit rules. (e) `hongbao(occasion, closeness, currency)`: bands per occasion, FX table, even lucky snapping, funerals odd and without 4. (f) A gift etiquette dataset.
>
> **Accept when:** 585555 scores "Very auspicious"; $39.99 suggests $38.88; February 2027 highlights 10 Feb (God of Wealth Day); no red-envelope suggestion contains a 4.

## Phase 3: Tool pages
**Prompt:**
> Build: Lucky Price Optimizer, Business Number Checker (query `?n=` prefill, sample chips), Opening Date Finder (month picker, heat-map calendar, top picks), Red Envelope Calculator (12 occasions, 9 currencies), Gift Etiquette Checker (live search), Campaign Calendar (computed dates for 2026–2027, CNY countdown), and a Tools index. Each tool page has explanatory text, a table, an FAQ and a sidebar lead form, so content outweighs ads.
>
> **Accept when:** every tool works without errors on desktop and mobile, and results render in an `aria-live` region.

## Phase 4: Content & SEO
**Prompt:**
> Write the Meaning of 585555 page and 6 guides (pricing psychology, lucky/unlucky numbers for business, Lunar New Year 2027 playbook, colours, gift etiquette, numeric domains) plus a Guides hub. Each has a byline ("585555 Editorial Team"), an updated date, internal links to tools, a CTA to the Growth Desk, and cited sources. Add Article / WebApplication / WebSite JSON-LD, canonical URLs on `https://585555.com/`, sitemap, robots, OG image, favicon and manifest.

## Phase 5: Monetisation & lead generation
**Prompt:**
> (a) **Growth Desk** (primary lead magnet): 3-step form (business type cards → goals + budget + timeline → contact + consent + newsletter) with progress bar, qualification fields and a success message. (b) Sidebar quick-lead form on all content pages; newsletter in the footer. (c) **Lucky Numbers Desk**: request form (pattern, asset type, budget, region) and listing form, with escrow microcopy. (d) **Advertise**: 3 packages, media-kit form (prefill `?interest=`), partner-network form. (e) **Support**: goal progress bar, allocation (operations 40% / hiring 25% / promotion 20% / prizes 15%), tiers ($8, $28/mo, $88/mo), preset lucky amounts, pledge form, payment buttons driven by `config.donate`. (f) **Contests**: Prosper Poster Challenge 2027 with countdown, prizes, entry form and official rules. (g) **Careers**: roles and an application / talent-pool form. (h) **Videos**: YouTube hub from `config.videos` (click-to-load youtube-nocookie; topic cards when no ID is set) and a creator submission form. (i) **AdSense**: slots `top / inArticle / sidebar / footer`, loaded only after cookie consent. Before approval, fill slots with labelled house ads. Include `ads.txt`.
>
> **Accept when:** every form posts successfully through FormSubmit; the inbox address is absent from the built HTML (check with `grep -r gmail *.html` returning nothing).

## Phase 6: Legal, QA & deploy
**Prompt:**
> Add About, Contact, FAQ, Privacy (AdSense third-party cookie disclosure, opt-out links), Terms, Trademark & Copyright Disclosure and a 404 page. Run a headless browser across all pages at 1280px and 375px: no JS errors, no overflow, interest bar present, no email in the DOM. Push to `github.com/webworksa1/585555-com` (`main`, mirrored to `gh-pages`) and serve on GitHub Pages (free plan, built-in Jekyll).

## Phase 7: Go-live configuration (owner)
1. Submit one form on the live site. FormSubmit emails an activation link to the inbox: click it. Optionally put the random alias it provides into `relayAlias`.
2. Custom domain: in *Settings → Pages*, set `585555.com`. At the registrar, add A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `www` CNAME to `webworksa1.github.io`. Then enable **Enforce HTTPS**.
3. Google Search Console: verify the domain and submit `sitemap.xml`.
4. AdSense: apply, then set `adsenseClient` and `adSlots` in `config.js` and uncomment `ads.txt`.
5. Paste the PayPal, Stripe, Ko-fi, Buy Me a Coffee and Patreon links into `config.donate`.
6. Paste YouTube video IDs into `config.videos` and the channel URL into `youtubeChannel`.

## Phase 8: Growth (months 1–3)
- Programmatic SEO: `/number/<n>` pages for 0–9999 and common phone endings, with unique text generated from `numbers.js` (thin-content safeguards: min 300 words and at least 3 unique facts).
- Chinese-language (简体 / 繁體) versions with hreflang.
- Embeddable tool widgets for backlinks; "Presented by" sponsor slot inside each widget.
- Lunar New Year 2027 hub (Oct–Feb) sold as the top sponsorship package.
- Weekly YouTube Shorts from tool outputs; each video links back to a tool.

## Phase 9: Scale (months 3–12)
- Move from AdSense to Google Ad Manager with header bidding once traffic exceeds ~100k sessions/month.
- Paid products: an annual prosperity-date PDF, and a pricing-audit service fulfilled by partners.
- Affiliate: red envelopes, packaging, tea gift sets, translation services.
- Lead scoring and routing to partner agencies on a revenue share.
- Live numeric-asset inventory with buy-now / make-offer / lease-to-own.
