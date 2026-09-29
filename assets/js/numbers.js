/* 585555.com — number, price, date, red-envelope and gift engines (no dependencies) */
(function () {
  "use strict";
  var DIGITS = {
    "0": { w: 1, zh: "零 líng", m: "Wholeness, a clean start", tone: "neutral" },
    "1": { w: 1, zh: "一 yī", m: "Unity, being first; in 14 it sounds like 'must die'", tone: "neutral" },
    "2": { w: 3, zh: "二 èr", m: "Pairs; 'good things come in twos' (好事成双)", tone: "good" },
    "3": { w: 2, zh: "三 sān", m: "Sounds like 'life' (生) in Cantonese", tone: "good" },
    "4": { w: -10, zh: "四 sì", m: "Sounds like 'death' (死); avoided on floors, plates and prices", tone: "bad" },
    "5": { w: 1, zh: "五 wǔ", m: "Sounds like 'I/me' (我); Five Blessings and Five Elements", tone: "neutral" },
    "6": { w: 5, zh: "六 liù", m: "Sounds like 'flow' (流); smooth business", tone: "good" },
    "7": { w: 0, zh: "七 qī", m: "Sounds like 'rise' (起) or 'together' (齐); 7th lunar month is Ghost Month", tone: "neutral" },
    "8": { w: 8, zh: "八 bā", m: "Sounds like 'prosper' (发 fā); the classic wealth number", tone: "good" },
    "9": { w: 5, zh: "九 jiǔ", m: "Sounds like 'long-lasting' (久)", tone: "good" }
  };
  // Combination patterns (checked as substrings). pts: score impact.
  var COMBOS = [
    { p: "585555", pts: 6, m: "我发 + 呜呜呜呜 — 'I prosper… through the tears'. Also reads as 'I prosper, me-me-me-me'." },
    { p: "1688", pts: 10, m: "一路发发 — prosper all the way, twice over" },
    { p: "8888", pts: 14, m: "发发发发 — maximum prosperity repeat" },
    { p: "888", pts: 10, m: "发发发 — triple prosperity" },
    { p: "168", pts: 9, m: "一路发 — prosper all the way" },
    { p: "518", pts: 8, m: "我要发 — I will prosper" },
    { p: "5888", pts: 4, m: "我发发发 — I prosper, again and again" },
    { p: "1314", pts: 5, m: "一生一世 — for a lifetime (weddings, loyalty)" },
    { p: "520", pts: 4, m: "我爱你 — I love you (use for romance campaigns, 20 May)" },
    { p: "666", pts: 7, m: "六六大顺 — everything goes smoothly; also slang for 'awesome'" },
    { p: "999", pts: 6, m: "久久久 — lasting forever" },
    { p: "99", pts: 3, m: "久久 — long-lasting" },
    { p: "88", pts: 5, m: "发发 — double prosperity; also 'bye-bye' online" },
    { p: "58", pts: 4, m: "我发 — I prosper" },
    { p: "28", pts: 4, m: "易发 — easy prosperity (Cantonese)" },
    { p: "68", pts: 4, m: "路发 — prosper along the road" },
    { p: "98", pts: 3, m: "久发 — lasting prosperity" },
    { p: "5555", pts: -3, m: "呜呜呜呜 — internet slang for crying (in Thai, 555 = laughing)" },
    { p: "250", pts: -8, m: "二百五 — slang for 'fool'; avoid on prices" },
    { p: "748", pts: -8, m: "去死吧 — 'go die' slang" },
    { p: "7456", pts: -8, m: "气死我了 — 'you're making me furious'" },
    { p: "514", pts: -6, m: "我要死 — 'I'm going to die'" },
    { p: "14", pts: -6, m: "要死 — 'going to die'" },
    { p: "24", pts: -5, m: "易死 — 'easy to die' (Cantonese)" },
    { p: "74", pts: -5, m: "气死 — 'furious to death'" },
    { p: "38", pts: -3, m: "三八 — can be an insult (esp. toward women); in Cantonese 生发 is positive — context matters" },
    { p: "44", pts: -6, m: "double 'death' sound" }
  ];

  function onlyDigits(s) { return String(s || "").replace(/[^0-9]/g, ""); }

  function analyze(input) {
    var d = onlyDigits(input);
    if (!d) return null;
    var score = 50, i, per = [];
    for (i = 0; i < d.length; i++) {
      var info = DIGITS[d[i]];
      score += info.w * (d.length > 8 ? 0.6 : 1);
      per.push({ d: d[i], zh: info.zh, m: info.m, tone: info.tone });
    }
    var found = [], used = {};
    COMBOS.forEach(function (c) {
      var idx = d.indexOf(c.p);
      if (idx > -1) {
        // avoid double-counting sub-patterns wholly inside a longer found pattern
        var covered = found.some(function (f) { return f.p.indexOf(c.p) > -1 && c.pts * f.pts > 0; });
        if (!covered) { found.push(c); score += c.pts; }
      }
    });
    var ending = d[d.length - 1];
    if (ending === "8") score += 6; else if (ending === "6" || ending === "9") score += 3; else if (ending === "4") score -= 6;
    // repetition bonus (AAA, AAAA) of good digits
    var run = d.match(/(\d)\1{2,}/g) || [];
    run.forEach(function (r) { var w = DIGITS[r[0]].w; if (w > 0) score += Math.min(8, r.length * 2); });
    var fours = (d.match(/4/g) || []).length;
    score = Math.max(0, Math.min(100, Math.round(score)));
    var verdict = score >= 85 ? "Exceptional" : score >= 70 ? "Very auspicious" : score >= 55 ? "Favourable" : score >= 40 ? "Neutral" : "Best avoided";
    var tips = [];
    if (fours) tips.push("Contains " + fours + " × '4'. Many Chinese customers avoid 4 — consider swapping it for 8, 6 or 9.");
    if (ending !== "8" && ending !== "6" && ending !== "9") tips.push("Ending on 8 (prosper), 6 (smooth) or 9 (lasting) is the strongest commercial signal.");
    if (/250/.test(d)) tips.push("'250' is slang for 'fool' — never use it as a price.");
    if (!tips.length) tips.push("Strong number. Feature it prominently — in signage, pricing, and your domain or phone line.");
    return { digits: d, score: score, verdict: verdict, per: per, combos: found, tips: tips };
  }

  // ---------- Lucky price optimizer ----------
  var TAILS = ["8", "88", "888", "8888", "68", "168", "688", "1688", "98", "198", "298", "388", "588", "66", "666", "99", "999", "28", "288", "58", "518"];
  function luckyPrices(price, opts) {
    opts = opts || {};
    price = Number(price);
    if (!(price > 0)) return [];
    var cents = price < 200 && !opts.integer;
    var lo = price * (opts.down || 0.88), hi = price * (opts.up || 1.15);
    var cand = {};
    if (cents) {
      for (var c = Math.ceil(lo * 100); c <= Math.floor(hi * 100); c++) cand[(c / 100).toFixed(2)] = c / 100;
    } else {
      var mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(hi)) - 1));
      for (var base = Math.floor(lo / mag) * mag; base <= hi + mag; base += mag) {
        TAILS.forEach(function (t) {
          var p10 = Math.pow(10, t.length); if (p10 > hi * 10) return;
          var v = Math.floor(base / p10) * p10 + parseInt(t, 10);
          if (v >= lo && v <= hi && v > 0) cand[String(v)] = v;
        });
      }
    }
    var out = [];
    Object.keys(cand).forEach(function (s) {
      var val = cand[s];
      if (Math.abs(val - price) < 1e-9) return;
      var digits = onlyDigits(s);
      if (/4/.test(digits)) return;
      var tail = cents ? s.replace(".", "") : s;
      if (!/(8|88|68|98|66|99|6|9)$/.test(tail)) return;
      if (opts.even && val % 2) return;
      var a = analyze(digits);
      var dist = Math.abs(val - price) / price;
      out.push({ value: val, label: s, score: a.score, rank: a.score - dist * 120, combos: a.combos });
    });
    out.sort(function (x, y) { return y.rank - x.rank; });
    var top = out.slice(0, 6);
    var below = out.filter(function (o) { return o.value < price; }).sort(function (a, b) { return b.value - a.value; })[0];
    var above = out.filter(function (o) { return o.value > price; }).sort(function (a, b) { return a.value - b.value; })[0];
    return { best: top, below: below, above: above };
  }

  // ---------- Lunar calendar ----------
  function toISO(dt) { return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0"); }
  function lunar(dt) {
    var S = window.LUNAR_STARTS || [];
    var iso = toISO(dt), cur = null;
    for (var i = 0; i < S.length; i++) { if (S[i][0] <= iso) cur = S[i]; else break; }
    if (!cur) return null;
    var p = cur[0].split("-");
    var start = new Date(+p[0], +p[1] - 1, +p[2]);
    var day = Math.round((new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) - start) / 864e5) + 1;
    return { year: cur[1], month: cur[2], leap: !!cur[3], day: day };
  }
  function rateDay(dt, purpose) {
    var L = lunar(dt), pts = 0, notes = [];
    var g = dt.getDate(), mo = dt.getMonth() + 1;
    if (!L) return { cls: "", pts: 0, notes: ["Outside data range"] };
    if (L.month === 7) { pts -= 30; notes.push("Ghost Month (7th lunar month) — traditionally avoided for openings, launches, moves"); }
    if (mo === 4 && (g === 4 || g === 5)) { pts -= 20; notes.push("Around Qingming (tomb-sweeping) — avoid celebrations"); }
    if (L.month === 1 && L.day === 5 && !L.leap) { pts += 30; notes.push("God of Wealth Day (破五) — traditional day to reopen for business"); }
    else if (L.month === 1 && L.day <= 15 && !L.leap) { pts += 10; notes.push("Lunar New Year festive period"); }
    if (L.month === 1 && L.day === 15) notes.push("Lantern Festival");
    if (L.month === 8 && L.day === 15) { pts += 8; notes.push("Mid-Autumn Festival — gifting peak"); }
    var ld = String(L.day);
    if (/8/.test(ld)) { pts += 10; notes.push("Lunar day " + ld + " contains 8"); }
    if (/[69]/.test(ld)) { pts += 5; }
    if (/4/.test(ld)) { pts -= 10; notes.push("Lunar day " + ld + " contains 4"); }
    if (g % 10 === 8) { pts += 8; notes.push("Calendar date ends in 8"); }
    if (g === 6 || g === 16 || g === 26 || g === 9 || g === 19 || g === 29) pts += 4;
    if (g % 10 === 4) { pts -= 8; notes.push("Calendar date ends in 4"); }
    if (mo === 8 && g === 8) { pts += 10; notes.push("8/8 — double prosperity"); }
    if (purpose === "retail" && (dt.getDay() === 6 || dt.getDay() === 0)) pts += 3;
    if (purpose === "wedding" && L.month === 7) pts -= 10;
    var cls = pts >= 20 ? "great" : pts >= 8 ? "good" : pts <= -8 ? "avoid" : "";
    return { cls: cls, pts: pts, notes: notes, lunar: L };
  }

  // ---------- Red envelope (hongbao) ----------
  var FX = { USD: 1, CAD: 1.37, SGD: 1.3, MYR: 4.3, HKD: 7.8, CNY: 7.1, GBP: 0.78, AUD: 1.52, EUR: 0.9 };
  var HB = {
    lny_child: [20, 50], lny_parent: [188, 888], lny_staff: [20, 100], lny_client: [50, 168],
    wedding_friend: [128, 288], wedding_family: [288, 888], wedding_colleague: [88, 168],
    birthday_elder: [88, 388], baby: [66, 188], opening: [168, 888], graduation: [50, 188], funeral: [51, 201]
  };
  function snapLucky(v, funeral) {
    if (funeral) { // odd amounts ending in 1, white envelope
      var base = Math.max(10, Math.round(v / 10) * 10) + 1; while (/4/.test(String(base))) base += 10; return base;
    }
    var r = luckyPrices(v, { down: 0.8, up: 1.25, integer: true, even: true });
    if (r && r.best && r.best.length) return r.best[0].value;
    return Math.round(v / 2) * 2;
  }
  function hongbao(occasion, closeness, currency) {
    var band = HB[occasion]; if (!band) return null;
    var mult = { close: 1.35, normal: 1, distant: 0.7 }[closeness] || 1;
    var fx = FX[currency] || 1, funeral = occasion === "funeral";
    var lo = snapLucky(band[0] * mult * fx, funeral), hi = snapLucky(band[1] * mult * fx, funeral);
    var mid = snapLucky(((band[0] + band[1]) / 2) * mult * fx, funeral);
    return { lo: Math.min(lo, mid), mid: mid, hi: Math.max(hi, mid), funeral: funeral };
  }

  // ---------- Gift etiquette ----------
  var GIFTS = [
    { k: "Clock or watch", v: "avoid", why: "送钟 (give a clock) sounds like 送终 (attending someone's death).", alt: "A quality pen or a desk plant" },
    { k: "Umbrella", v: "avoid", why: "伞 (sǎn) sounds like 散 (to separate/break up).", alt: "A travel accessory set in red packaging" },
    { k: "Pears", v: "avoid", why: "梨 (lí) sounds like 离 (to part).", alt: "Mandarin oranges (sound like gold/luck)" },
    { k: "Sharp items (knives, scissors)", v: "avoid", why: "Symbolise cutting ties.", alt: "Premium tea set" },
    { k: "Shoes", v: "caution", why: "鞋 (xié) sounds like 邪 (evil) in some dialects; also 'walking away'.", alt: "Scarf or quality socks as part of a set of 2" },
    { k: "Green hat", v: "avoid", why: "戴绿帽 means a spouse is unfaithful.", alt: "Any other hat colour" },
    { k: "White or yellow chrysanthemums", v: "avoid", why: "Funeral flowers.", alt: "Orchids or peonies" },
    { k: "Anything in a set of 4", v: "avoid", why: "4 sounds like death.", alt: "Sets of 2, 6 or 8" },
    { k: "Handkerchief", v: "caution", why: "Associated with tears and farewells.", alt: "Silk scarf" },
    { k: "Mirror", v: "caution", why: "Easily broken; broken mirrors signal bad luck.", alt: "Photo frame" },
    { k: "Mandarin oranges", v: "great", why: "桔 (jú) sounds like 吉 (luck); gold colour = wealth. Give in pairs.", alt: "" },
    { k: "Premium tea", v: "great", why: "Respectful, universal business gift; signals taste.", alt: "" },
    { k: "Fine wine or baijiu", v: "great", why: "Popular for business banquets; red wine = red = luck.", alt: "" },
    { k: "Red envelope (cash)", v: "great", why: "Standard for weddings, New Year, openings — use even, lucky amounts.", alt: "" },
    { k: "Fruit basket", v: "good", why: "Abundance; skip pears and keep the count off 4.", alt: "" },
    { k: "Mooncakes", v: "great", why: "The Mid-Autumn Festival gift; premium boxes are expected for clients.", alt: "" },
    { k: "Jade or gold item", v: "great", why: "Protection, wealth, longevity.", alt: "" },
    { k: "Books", v: "caution", why: "书 (shū) sounds like 输 (lose) — avoid for gamblers and at New Year.", alt: "Gift card or tea" },
    { k: "Cash in white envelope", v: "avoid", why: "White envelopes are for funerals.", alt: "Red envelope" },
    { k: "Company-branded gadget", v: "good", why: "Fine if quality is high and packaging is red/gold.", alt: "" }
  ];

  window.NUM = { DIGITS: DIGITS, COMBOS: COMBOS, analyze: analyze, luckyPrices: luckyPrices, lunar: lunar, rateDay: rateDay, hongbao: hongbao, GIFTS: GIFTS, FX: FX, toISO: toISO };
})();
