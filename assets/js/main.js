/* 585555.com — UI, forms, tools, ads, consent, video */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function toast(msg) { var t = $("#toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); setTimeout(function () { t.classList.remove("show"); }, 2600); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Theme + nav ---------- */
  var saved = store("theme"); if (saved) document.documentElement.setAttribute("data-theme", saved);
  var tb = $("#themeBtn");
  if (tb) tb.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var nx = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", nx); store("theme", nx);
  });
  var mt = $("#menuBtn"), nav = $("#nav");
  if (mt && nav) mt.addEventListener("click", function () { var o = nav.classList.toggle("open"); mt.setAttribute("aria-expanded", o); });
  var here = (location.pathname.split("/").pop() || "index.html");
  $$("#nav a").forEach(function (a) { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });
  $$(".yr").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---------- Reveal + to-top ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  var tt = $("#toTop");
  window.addEventListener("scroll", function () { if (tt) tt.classList.toggle("show", scrollY > 700); }, { passive: true });
  if (tt) tt.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Forms (relay; inbox never rendered) ---------- */
  function endpoint() {
    if (S.relayAlias) return "https://formsubmit.co/ajax/" + S.relayAlias;
    return "https://formsubmit.co/ajax/" + (S.relay || []).slice().reverse().map(function (c) { return String.fromCharCode(c ^ 58); }).join("");
  }
  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "_hp") return;
      if (data[k]) data[k] = data[k] + ", " + v; else data[k] = v;
    });
    return data;
  }
  $$("form.js-form").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var msg = $(".form-msg", form);
      if (form._hp && form._hp.value) return; // bot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = collect(form);
      data._subject = "[585555.com] " + (form.getAttribute("data-subject") || "Website inquiry");
      data._template = "table";
      data._captcha = "false";
      data["Page"] = location.href;
      data["Submitted"] = new Date().toISOString();
      var btn = $("button[type=submit]", form); if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
      fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && String(res.j.success) !== "false") {
            msg.className = "form-msg ok"; msg.textContent = form.getAttribute("data-ok") || "Thank you — we received your message and will reply within 1–2 business days.";
            form.reset(); if (form.classList.contains("msf")) gotoStep(form, 0);
            if (window.gtag) gtag("event", "generate_lead", { form: form.getAttribute("data-subject") });
          } else throw new Error((res.j && res.j.message) || "Relay error");
        })
        .catch(function () { msg.className = "form-msg err"; msg.textContent = "Sorry — the message could not be sent right now. Please try again in a minute, or use the contact link at the top of the page."; })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
    });
  });

  /* ---------- Multi-step forms ---------- */
  function gotoStep(form, i) {
    var steps = $$(".step", form), bars = $$(".steps span", form);
    steps.forEach(function (s, k) { s.classList.toggle("active", k === i); });
    bars.forEach(function (b, k) { b.classList.toggle("on", k <= i); });
    form.dataset.step = i;
    var lbl = $(".step-count", form); if (lbl) lbl.textContent = "Step " + (i + 1) + " of " + steps.length;
  }
  $$("form.msf").forEach(function (form) {
    gotoStep(form, 0);
    form.addEventListener("click", function (e) {
      var t = e.target.closest("[data-next],[data-prev]"); if (!t) return;
      e.preventDefault();
      var i = +form.dataset.step, steps = $$(".step", form);
      if (t.hasAttribute("data-next")) {
        var ok = $$("input,select,textarea", steps[i]).every(function (el) { return el.checkValidity() || (el.reportValidity(), false); });
        if (!ok) return;
        gotoStep(form, Math.min(i + 1, steps.length - 1));
      } else gotoStep(form, Math.max(i - 1, 0));
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  // prefill from query (?interest=domain etc.)
  var qs = new URLSearchParams(location.search);
  $$("[data-prefill]").forEach(function (el) { var v = qs.get(el.getAttribute("data-prefill")); if (v) el.value = v; });

  /* ---------- Ads (AdSense after consent; house ads otherwise) ---------- */
  var HOUSE = [
    '<a class="house" href="advertise.html"><b>Your brand here.</b> Reach business owners selling to Chinese &amp; Asian customers — see sponsorship packages →</a>',
    '<a class="house" href="growth-desk.html"><b>Free growth plan:</b> get a tailored pricing, launch-date and campaign plan for Chinese-speaking customers →</a>',
    '<a class="house" href="support.html"><b>Keep these tools free.</b> Support 585555.com from $8 →</a>',
    '<a class="house" href="premium-numbers.html"><b>Own a lucky number.</b> Numeric domains &amp; vanity numbers — make an offer →</a>'
  ];
  function renderAds(adsense) {
    $$(".ad[data-slot]").forEach(function (el, i) {
      var slot = (S.adSlots || {})[el.getAttribute("data-slot")];
      if (adsense && S.adsenseClient && slot) {
        el.innerHTML = '<span class="lbl">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + esc(S.adsenseClient) + '" data-ad-slot="' + esc(slot) + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      } else el.innerHTML = '<span class="lbl">Sponsored</span>' + HOUSE[i % HOUSE.length];
    });
  }
  function loadScript(src, attrs) { var s = document.createElement("script"); s.async = true; s.src = src; for (var k in (attrs || {})) s.setAttribute(k, attrs[k]); document.head.appendChild(s); }
  function consentGranted() {
    if (S.adsenseClient) loadScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(S.adsenseClient), { crossorigin: "anonymous" });
    if (S.ga4) { loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(S.ga4)); window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", S.ga4); }
    renderAds(true);
  }
  var consent = store("consent"), ck = $("#cookie");
  if (consent === "yes") consentGranted(); else { renderAds(false); if (!consent && ck) ck.classList.add("show"); }
  if (ck) {
    $("#ckYes").addEventListener("click", function () { store("consent", "yes"); ck.classList.remove("show"); consentGranted(); });
    $("#ckNo").addEventListener("click", function () { store("consent", "no"); ck.classList.remove("show"); });
  }

  /* ---------- Videos ---------- */
  var vg = $("#videoGrid");
  if (vg) {
    var lim = +(vg.getAttribute("data-limit") || 99);
    vg.innerHTML = (S.videos || []).slice(0, lim).map(function (v) {
      if (v.id) return '<div><div class="video" data-id="' + esc(v.id) + '" role="button" tabindex="0" aria-label="Play: ' + esc(v.title) + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg"><span class="play">▶</span></div><p><b>' + esc(v.title) + '</b></p></div>';
      return '<a class="vcard" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(v.q) + '"><span class="small">▶ Watch on YouTube</span><b>' + esc(v.title) + '</b></a>';
    }).join("");
    vg.addEventListener("click", function (e) {
      var v = e.target.closest(".video"); if (!v || v.querySelector("iframe")) return;
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.dataset.id) + '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>';
    });
  }
  $$(".yt-channel").forEach(function (a) { if (S.youtubeChannel) a.href = S.youtubeChannel; });

  /* ---------- Donations ---------- */
  var dg = $("#donateLinks");
  if (dg) {
    var names = { paypal: "PayPal", stripe: "Card (Stripe)", kofi: "Ko-fi", buymeacoffee: "Buy Me a Coffee", patreon: "Patreon (monthly)", githubSponsors: "GitHub Sponsors" };
    var html = Object.keys(names).filter(function (k) { return (S.donate || {})[k]; }).map(function (k) { return '<a class="btn btn-gold" target="_blank" rel="noopener" href="' + esc(S.donate[k]) + '">' + names[k] + "</a>"; }).join(" ");
    dg.innerHTML = html || '<p class="small muted">Instant payment buttons are being connected. Use the pledge form below — we reply within 24 hours with a secure payment link, receipt and your supporter perks.</p>';
  }
  var fr = S.fundraising;
  $$(".fund").forEach(function (el) {
    if (!fr) return; var pct = Math.min(100, Math.round((fr.raised / fr.goal) * 100));
    el.innerHTML = '<div class="progress" aria-label="Fundraising progress"><i style="width:0"></i></div><p class="small"><b>' + fr.currency + " " + fr.raised.toLocaleString() + "</b> raised of " + fr.currency + " " + fr.goal.toLocaleString() + " · " + esc(fr.label) + "</p>";
    setTimeout(function () { $("i", el).style.width = Math.max(pct, 2) + "%"; }, 300);
  });
  $$("[data-amount]").forEach(function (b) { b.addEventListener("click", function () { var i = $("#pledgeAmount"); if (i) { i.value = b.getAttribute("data-amount"); i.focus(); } $$("[data-amount]").forEach(function (x) { x.style.borderColor = ""; }); b.style.borderColor = "var(--red)"; }); });

  /* ---------- Countdowns ---------- */
  function countdown(el, target) {
    function tick() {
      var ms = target - Date.now(); if (ms < 0) ms = 0;
      var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
      el.innerHTML = [["Days", d], ["Hours", h], ["Min", m], ["Sec", s]].map(function (x) { return "<div><b>" + x[1] + "</b><span class='small'>" + x[0] + "</span></div>"; }).join("");
    }
    tick(); setInterval(tick, 1000);
  }
  var cnyEl = $("#cnyCountdown");
  if (cnyEl && window.CNY_DATES) {
    var now = new Date(), y = now.getFullYear(), t;
    for (var yy = y; yy < y + 3; yy++) { var p = (window.CNY_DATES[yy] || "").split("-"); if (p.length === 3) { t = new Date(+p[0], +p[1] - 1, +p[2]); if (t > now) break; } }
    if (t) { countdown(cnyEl, t.getTime()); var lab = $("#cnyLabel"); if (lab) lab.textContent = t.toDateString(); }
  }
  var ccEl = $("#contestCountdown");
  if (ccEl && S.contest) countdown(ccEl, new Date(S.contest.deadline).getTime());

  /* ---------- Daily prosperity tip ---------- */
  var TIPS = [
    "End premium prices in 8 — ¥888 reads as 'prosper ×3'; ¥444 reads as 'death ×3'.",
    "Package gifts in pairs; odd counts and sets of four feel incomplete or unlucky.",
    "Reopen after Lunar New Year on the 5th day — the God of Wealth's birthday.",
    "Red and gold packaging lifts perceived value; white and black read as mourning.",
    "Never price at 250 — it's slang for 'fool'.",
    "Floor 4, 14 and 24 are skipped in many Chinese-owned buildings. Mind your suite number.",
    "518 reads 'I will prosper' — a favourite for launch promos and phone numbers.",
    "Avoid launches in the 7th lunar month (Ghost Month); many customers postpone big purchases.",
    "Mandarin oranges in pairs are the safest client gift at New Year.",
    "Use 1314 ('a lifetime') and 520 ('I love you') for wedding and romance campaigns.",
    "Hand over business cards and gifts with both hands.",
    "Offer a lucky-number SKU (e.g. 168 bundle) during Lunar New Year and 11.11."
  ];
  var tipEl = $("#dailyTip");
  if (tipEl) { var doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5); tipEl.textContent = TIPS[doy % TIPS.length]; }

  /* ---------- Share ---------- */
  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var u = location.href, t = document.title;
      if (navigator.share) navigator.share({ title: t, url: u }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { toast("Link copied"); });
    });
  });

  /* ---------- Site search ---------- */
  var sIn = $("#siteSearch"), sOut = $("#searchResults");
  if (sIn && sOut && window.SEARCH_INDEX) {
    sIn.addEventListener("input", function () {
      var q = sIn.value.trim().toLowerCase(); if (q.length < 2) { sOut.classList.remove("show"); return; }
      var hits = window.SEARCH_INDEX.filter(function (p) { return (p.t + " " + p.d + " " + (p.k || "")).toLowerCase().indexOf(q) > -1; }).slice(0, 8);
      sOut.innerHTML = hits.length ? hits.map(function (h) { return '<a href="' + h.u + '"><b>' + esc(h.t) + '</b><br><span class="small muted">' + esc(h.d) + "</span></a>"; }).join("") : '<a href="growth-desk.html">No match — ask our growth desk →</a>';
      sOut.classList.add("show");
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".search-box")) sOut.classList.remove("show"); });
  }

  /* ================= TOOLS ================= */
  var N = window.NUM;
  function digitCards(a) {
    return '<div class="digits">' + a.per.map(function (p) { return '<div class="digit ' + (p.tone === "good" ? "good" : p.tone === "bad" ? "bad" : "") + '" title="' + esc(p.m) + '"><b>' + p.d + "</b><small>" + esc(p.zh) + "</small></div>"; }).join("") + "</div>";
  }
  // Number checker
  var nf = $("#numForm");
  if (nf && N) {
    var run = function (val) {
      var a = N.analyze(val), out = $("#numResult");
      if (!a) { out.className = "result show"; out.innerHTML = "<p>Please enter a number that contains digits.</p>"; return; }
      var type = $("#numType") ? $("#numType").value : "number";
      out.innerHTML = '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div class="score" aria-label="Score">' + a.score + '</div><div><h3 style="margin:0">' + esc(a.verdict) + '</h3><p class="muted small" style="margin:0">' + esc(type) + " · " + a.digits.length + " digits · " + a.digits + "</p></div></div>" +
        digitCards(a) +
        "<h4>Digit meanings</h4><ul>" + a.per.filter(function (p, i, arr) { return arr.findIndex(function (x) { return x.d === p.d; }) === i; }).map(function (p) { return "<li><b>" + p.d + " (" + esc(p.zh) + ")</b> — " + esc(p.m) + "</li>"; }).join("") + "</ul>" +
        (a.combos.length ? "<h4>Combinations found</h4><ul>" + a.combos.map(function (c) { return "<li><b>" + c.p + "</b> — " + esc(c.m) + "</li>"; }).join("") + "</ul>" : "") +
        "<h4>Recommendations</h4><ul>" + a.tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<p class="small"><a href="premium-numbers.html?pattern=' + encodeURIComponent(a.digits) + '">Looking for a stronger number, domain or vanity line? Make a request →</a></p>';
      out.className = "result show";
    };
    nf.addEventListener("submit", function (e) { e.preventDefault(); run($("#numInput").value); });
    $$("[data-try]").forEach(function (b) { b.addEventListener("click", function () { $("#numInput").value = b.getAttribute("data-try"); run(b.getAttribute("data-try")); }); });
    if (qs.get("n")) { $("#numInput").value = qs.get("n"); run(qs.get("n")); }
  }
  // Price optimizer
  var pf = $("#priceForm");
  if (pf && N) {
    pf.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = parseFloat($("#priceInput").value), cur = $("#priceCur").value, out = $("#priceResult");
      var r = N.luckyPrices(p);
      if (!r || !r.best || !r.best.length) { out.className = "result show"; out.innerHTML = "<p>No lucky alternatives found nearby. Try a different price.</p>"; return; }
      var orig = N.analyze(String(p).replace(".", ""));
      var fmt = function (v) { return cur + " " + v.label; };
      out.innerHTML = "<p>Your price <b>" + cur + " " + p + "</b> scores <b>" + orig.score + "/100</b> (" + orig.verdict + ").</p>" +
        '<div class="grid-3">' +
        (r.below ? '<div class="card"><span class="tag">Nearest below</span><div class="stat">' + esc(fmt(r.below)) + '</div><p class="small muted">Score ' + r.below.score + "</p></div>" : "") +
        (r.above ? '<div class="card"><span class="tag gold">Nearest above</span><div class="stat">' + esc(fmt(r.above)) + '</div><p class="small muted">Score ' + r.above.score + "</p></div>" : "") +
        '<div class="card"><span class="tag red">Best overall</span><div class="stat">' + esc(fmt(r.best[0])) + '</div><p class="small muted">Score ' + r.best[0].score + "</p></div></div>" +
        "<h4>More auspicious options</h4><div class='pill-list'>" + r.best.map(function (b) { return "<span class='pill'>" + esc(fmt(b)) + " · " + b.score + "</span>"; }).join("") + "</div>" +
        "<p class='small muted' style='margin-top:12px'>Options avoid the digit 4 and end on 8, 6 or 9. Check local price-display rules before changing listed prices.</p>";
      out.className = "result show";
    });
  }
  // Opening / launch date finder
  var df = $("#dateForm");
  if (df && N) {
    var dm = $("#dateMonth"), now2 = new Date();
    dm.value = now2.getFullYear() + "-" + String(now2.getMonth() + 1).padStart(2, "0");
    var draw = function () {
      var p = dm.value.split("-"), y = +p[0], m = +p[1] - 1, purpose = $("#datePurpose").value;
      var first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), html = "", best = [];
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(function (d) { html += '<div class="h">' + d + "</div>"; });
      for (var i = 0; i < first.getDay(); i++) html += '<div class="d empty"></div>';
      for (var d = 1; d <= days; d++) {
        var dt = new Date(y, m, d), r = N.rateDay(dt, purpose);
        if (r.cls === "great" || r.cls === "good") best.push({ dt: dt, r: r });
        html += '<div class="d ' + r.cls + '" title="' + esc(r.notes.join(" · ")) + '"><b>' + d + "</b><br>" + (r.lunar ? (r.lunar.leap ? "闰" : "") + r.lunar.month + "/" + r.lunar.day : "") + "</div>";
      }
      $("#dateCal").innerHTML = html;
      best.sort(function (a, b) { return b.r.pts - a.r.pts; });
      $("#dateBest").innerHTML = best.length ? "<ol>" + best.slice(0, 6).map(function (b) { return "<li><b>" + b.dt.toDateString() + "</b> — " + esc(b.r.notes.join("; ") || "favourable digits") + "</li>"; }).join("") + "</ol>" : "<p>No standout days this month — this month may fall in Ghost Month. Try the next month.</p>";
      $("#dateResult").className = "result show";
    };
    df.addEventListener("submit", function (e) { e.preventDefault(); draw(); });
    draw();
  }
  // Hongbao calculator
  var hf = $("#hbForm");
  if (hf && N) {
    hf.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = N.hongbao($("#hbOcc").value, $("#hbClose").value, $("#hbCur").value), c = $("#hbCur").value, out = $("#hbResult");
      out.innerHTML = '<div class="grid-3"><div class="card center"><span class="tag">Modest</span><div class="stat">' + c + " " + r.lo + '</div></div><div class="card center"><span class="tag red">Recommended</span><div class="stat">' + c + " " + r.mid + '</div></div><div class="card center"><span class="tag gold">Generous</span><div class="stat">' + c + " " + r.hi + "</div></div></div>" +
        (r.funeral ? "<p><b>Funerals:</b> use a <b>white</b> envelope and an odd amount (commonly ending in 1). Never red.</p>" : "<p>Use a <b>red</b> envelope, crisp new notes, an even total, and avoid any 4. Present with both hands.</p>") +
        "<p class='small muted'>Ranges are typical community norms for North America and Southeast/East Asia, converted and snapped to auspicious amounts. Local customs vary; for weddings, many guests aim to at least cover their meal cost.</p>";
      out.className = "result show";
    });
  }
  // Gift checker
  var gl = $("#giftList");
  if (gl && N) {
    var renderG = function (q) {
      q = (q || "").toLowerCase();
      gl.innerHTML = N.GIFTS.filter(function (g) { return !q || (g.k + " " + g.why).toLowerCase().indexOf(q) > -1; }).map(function (g) {
        var tag = { avoid: '<span class="tag red">Avoid</span>', caution: '<span class="tag gold">Caution</span>', good: '<span class="tag">Good</span>', great: '<span class="tag">Great choice</span>' }[g.v];
        return '<div class="card">' + tag + "<h3 style='margin:.4em 0'>" + esc(g.k) + "</h3><p class='small'>" + esc(g.why) + "</p>" + (g.alt ? "<p class='small'><b>Instead:</b> " + esc(g.alt) + "</p>" : "") + "</div>";
      }).join("") || "<p>No match. Try 'tea', 'clock' or 'flowers'.</p>";
    };
    renderG(""); var gi = $("#giftSearch"); if (gi) gi.addEventListener("input", function () { renderG(gi.value); });
  }
})();
