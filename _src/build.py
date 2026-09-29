#!/usr/bin/env python3
"""585555.com static builder.
Each page lives in _src/pages/<slug>.html and starts with a JSON header comment:
<!--{"title": "...", "description": "...", "crumb": "...", "keywords": "...", "type": "WebPage|Article|WebApplication", "priority": "0.8"}-->
Run:  python3 _src/build.py      (writes <slug>.html, sitemap.xml, assets/js/search-index.js to the repo root)
"""
import json, os, re, glob, html, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = "https://585555.com"
VERSION = datetime.date.today().strftime("%Y%m%d")
TODAY = datetime.date.today().isoformat()

NAV = [("tools.html", "Tools"), ("guides.html", "Guides"), ("calendar.html", "Calendar"), ("videos.html", "Videos"),
       ("premium-numbers.html", "Lucky Numbers"), ("contests.html", "Contests"), ("support.html", "Support")]

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#B3202A">
<meta property="og:type" content="{ogtype}">
<meta property="og:site_name" content="585555.com">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{domain}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Serif:wght@600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v={ver}">
<script type="application/ld+json">{jsonld}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="interest" role="note">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership — <a href="https://web.works/contact" target="_blank" rel="noopener">contact here</a></div>
<header class="hdr">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="585555.com home"><span class="seal">我发</span><span>585555<small>I PROSPER · 我发</small></span></a>
    <button class="iconbtn menu-toggle" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="nav">☰</button>
    <nav class="nav" id="nav" aria-label="Main">
      {nav}
      <a class="btn btn-red btn-sm" href="growth-desk.html">Free Growth Plan</a>
      <button class="iconbtn" id="themeBtn" aria-label="Toggle dark mode" title="Toggle dark mode">☾</button>
    </nav>
  </div>
</header>
<main id="main">
"""

FOOT = """</main>
<footer class="ftr">
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="brand" href="index.html" style="color:#fff"><span class="seal">我发</span><span>585555<small style="color:#bba">I PROSPER · 我发</small></span></a>
        <p style="margin-top:14px">Free tools and guides for businesses and creators who sell to Chinese-speaking and Asian customers — pricing, numbers, dates, gifting and campaigns.</p>
        <form class="js-form inline-form" data-subject="Newsletter signup (footer)" data-ok="You're in! Watch for the Prosperity Brief.">
          <input type="email" name="email" required placeholder="Your email" aria-label="Email">
          <input type="hidden" name="List" value="Prosperity Brief">
          <input class="hp" type="text" name="_hp" tabindex="-1" autocomplete="off">
          <button class="btn btn-gold btn-sm" type="submit">Subscribe</button>
          <div class="form-msg" role="status"></div>
        </form>
      </div>
      <div><h4>Tools</h4><ul>
        <li><a href="lucky-price-optimizer.html">Lucky Price Optimizer</a></li>
        <li><a href="business-number-checker.html">Business Number Checker</a></li>
        <li><a href="opening-date-finder.html">Opening Date Finder</a></li>
        <li><a href="red-envelope-calculator.html">Red Envelope Calculator</a></li>
        <li><a href="gift-etiquette-checker.html">Gift Etiquette Checker</a></li>
        <li><a href="meaning-of-585555.html">Meaning of 585555</a></li>
      </ul></div>
      <div><h4>Work with us</h4><ul>
        <li><a href="growth-desk.html">Free Growth Plan</a></li>
        <li><a href="premium-numbers.html">Lucky Numbers &amp; Domains</a></li>
        <li><a href="advertise.html">Advertise &amp; Sponsor</a></li>
        <li><a href="support.html">Support / Donate</a></li>
        <li><a href="contests.html">Contests &amp; Prizes</a></li>
        <li><a href="careers.html">Careers &amp; Talent</a></li>
      </ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="privacy.html">Privacy</a></li>
        <li><a href="terms.html">Terms</a></li>
        <li><a href="legal.html">Trademark &amp; Copyright</a></li>
      </ul></div>
    </div>
    <div class="legal">
      <p>© <span class="yr">2026</span> 585555.com. All rights reserved. Original text, tools and design are protected by copyright. "585555" is used solely as a numeral and domain name; no trademark rights in the numeral are claimed, and this site is not affiliated with, endorsed by or connected to any company, brand or platform whose name contains similar numbers (including 58.com / 58同城 or the "555" brand). Third-party names are used descriptively only. Cultural information is educational and not financial, legal or religious advice. <a href="legal.html">Full disclosure</a>.</p>
      <p>Interested in this website, the domain name, sponsorship, advertising or partnership? <a href="https://web.works/contact" target="_blank" rel="noopener">Contact here</a>.</p>
    </div>
  </div>
</footer>
<div class="cookie" id="cookie" role="dialog" aria-label="Cookie consent">
  <p>We use cookies for analytics and to show ads (Google AdSense) that keep our tools free. See our <a href="privacy.html">privacy policy</a>.</p>
  <button class="btn btn-red btn-sm" id="ckYes">Accept</button><button class="btn btn-ghost btn-sm" id="ckNo">Decline</button>
</div>
<div class="toast" id="toast" role="status"></div>
<button class="iconbtn totop" id="toTop" aria-label="Back to top">↑</button>
<script src="assets/js/config.js?v={ver}"></script>
<script src="assets/js/lunar-data.js?v={ver}"></script>
<script src="assets/js/numbers.js?v={ver}"></script>
<script src="assets/js/search-index.js?v={ver}"></script>
<script src="assets/js/main.js?v={ver}"></script>
</body>
</html>
"""

ASIDE = """<aside class="aside">
  <div class="card">
    <span class="tag red">Free · 48h</span>
    <h3 style="margin:.5em 0">Get your growth plan</h3>
    <p class="small">Prices, launch window, gifting policy and campaign dates tailored to your business and Chinese-speaking customers.</p>
    <form class="js-form" data-subject="Quick lead (sidebar)">
      <label for="asEmail">Work email</label><input id="asEmail" type="email" name="email" required placeholder="you@business.com">
      <label for="asBiz">What do you sell?</label><input id="asBiz" type="text" name="business" required placeholder="e.g. bubble tea shop, Toronto">
      <input class="hp" type="text" name="_hp" tabindex="-1" autocomplete="off">
      <button class="btn btn-red" type="submit" style="width:100%;margin-top:12px">Send my free plan</button>
      <div class="form-msg" role="status"></div>
      <p class="fine">No spam. Unsubscribe anytime.</p>
    </form>
  </div>
  <div class="ad" data-slot="sidebar"></div>
  <div class="card">
    <h3>Free tools</h3>
    <ul class="small" style="padding-left:1.1em;margin:0">
      <li><a href="lucky-price-optimizer.html">Lucky Price Optimizer</a></li>
      <li><a href="business-number-checker.html">Business Number Checker</a></li>
      <li><a href="opening-date-finder.html">Opening Date Finder</a></li>
      <li><a href="red-envelope-calculator.html">Red Envelope Calculator</a></li>
      <li><a href="gift-etiquette-checker.html">Gift Etiquette Checker</a></li>
      <li><a href="calendar.html">Campaign Calendar</a></li>
    </ul>
  </div>
  <div class="card center"><p class="small" style="margin:0 0 10px">Found this useful?</p><button class="btn btn-ghost btn-sm" data-share>Share</button> <a class="btn btn-gold btn-sm" href="support.html">Support us</a></div>
</aside>"""

def build():
    pages = []
    for path in sorted(glob.glob(os.path.join(ROOT, "_src", "pages", "*.html"))):
        slug = os.path.basename(path)
        raw = open(path, encoding="utf-8").read()
        m = re.match(r"\s*<!--(\{.*?\})-->\s*", raw, re.S)
        meta = json.loads(m.group(1))
        body = raw[m.end():]
        pages.append((slug, meta, body))

    index = [{"u": s, "t": m["title"].split(" — ")[0].split(" | ")[0], "d": m["description"], "k": m.get("keywords", "")}
             for s, m, _ in pages if s not in ("404.html",)]
    open(os.path.join(ROOT, "assets", "js", "search-index.js"), "w", encoding="utf-8").write(
        "window.SEARCH_INDEX=" + json.dumps(index, ensure_ascii=False, separators=(",", ":")) + ";\n")

    urls = []
    for slug, meta, body in pages:
        canonical = DOMAIN + "/" + ("" if slug == "index.html" else slug)
        typ = meta.get("type", "WebPage")
        ld = {"@context": "https://schema.org", "@type": typ, "name": meta["title"], "description": meta["description"],
              "url": canonical, "inLanguage": "en", "isPartOf": {"@type": "WebSite", "name": "585555.com", "url": DOMAIN + "/"},
              "publisher": {"@type": "Organization", "name": "585555.com", "url": DOMAIN + "/"}}
        if typ == "Article":
            ld.update({"headline": meta["title"], "datePublished": meta.get("date", TODAY), "dateModified": TODAY,
                       "author": {"@type": "Organization", "name": "585555 Editorial Team"}})
        if typ == "WebApplication":
            ld.update({"applicationCategory": "BusinessApplication", "operatingSystem": "Any", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}})
        if slug == "index.html":
            ld = {"@context": "https://schema.org", "@type": "WebSite", "name": "585555.com", "url": DOMAIN + "/",
                  "description": meta["description"],
                  "potentialAction": {"@type": "SearchAction", "target": DOMAIN + "/business-number-checker.html?n={query}", "query-input": "required name=query"}}
        crumbs = ""
        if slug != "index.html":
            crumbs = meta.get("crumb", meta["title"].split(" — ")[0])
        nav = "\n      ".join('<a href="%s">%s</a>' % (h, t) for h, t in NAV)
        out = HEAD.format(title=html.escape(meta["title"]), desc=html.escape(meta["description"]),
                          keywords=html.escape(meta.get("keywords", "")), canonical=canonical, ogtype="article" if typ == "Article" else "website",
                          domain=DOMAIN, ver=VERSION, jsonld=json.dumps(ld, ensure_ascii=False), nav=nav)
        body = body.replace("{{CRUMB}}", '<div class="crumbs"><a href="index.html">Home</a> › %s</div>' % html.escape(crumbs))
        body = body.replace("{{ASIDE}}", ASIDE)
        body = body.replace("{{UPDATED}}", datetime.date.today().strftime("%B %Y"))
        out += body + FOOT.replace("{ver}", VERSION)
        open(os.path.join(ROOT, slug), "w", encoding="utf-8").write(out)
        if slug != "404.html":
            urls.append((canonical, meta.get("priority", "0.7")))

    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u, p in urls:
        sm.append("  <url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>" % (u, TODAY, p))
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print("Built %d pages" % len(pages))

if __name__ == "__main__":
    build()
