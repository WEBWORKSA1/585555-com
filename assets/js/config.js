/* ==========================================================
   585555.com — SITE CONFIG (edit this file only)
   ========================================================== */
window.SITE = {
  name: "585555",
  domain: "585555.com",
  // Relay inbox is stored encoded and is never written into the page.
  // After FormSubmit activation you may replace `relay` with the random alias
  // FormSubmit emails you (e.g. relayAlias: "a1b2c3..."), which removes even the encoded copy.
  relay: [87,85,89,20,86,83,91,87,93,122,11,91,73,81,72,85,77,88,95,77],
  relayAlias: "",
  interestUrl: "https://web.works/contact",

  // --- Google AdSense: paste your publisher id (ca-pub-XXXXXXXXXXXXXXXX) after approval.
  adsenseClient: "",
  adSlots: { top: "", inArticle: "", sidebar: "", footer: "" },
  // --- Google Analytics 4 (optional): "G-XXXXXXX". Loaded only after cookie consent.
  ga4: "",

  // --- Donation / payment links (leave "" to hide a button). Never put the inbox here.
  donate: {
    paypal: "",        // e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX
    stripe: "",        // Stripe Payment Link
    kofi: "",          // https://ko-fi.com/yourname
    buymeacoffee: "",  // https://buymeacoffee.com/yourname
    patreon: "",       // https://patreon.com/yourname
    githubSponsors: "" // https://github.com/sponsors/yourname
  },
  fundraising: { goal: 5855, raised: 0, currency: "USD", label: "2027 Year-of-the-Goat operations fund" },

  // --- YouTube: your channel URL and video IDs (11-char IDs). Empty IDs show topic cards linking to YouTube search.
  youtubeChannel: "",
  videos: [
    { id: "", title: "Why 8 means money: Chinese number psychology in 5 minutes", q: "why 8 is lucky in Chinese culture" },
    { id: "", title: "Pricing for Chinese customers: 88, 168 and 888 explained", q: "Chinese pricing lucky numbers marketing" },
    { id: "", title: "Lunar New Year marketing: what global brands get right and wrong", q: "Lunar New Year marketing campaign brands" },
    { id: "", title: "Business gift etiquette in China: what never to give", q: "Chinese business gift etiquette taboo" },
    { id: "", title: "Red envelopes (hongbao): how much to give", q: "how much money red envelope hongbao" },
    { id: "", title: "Why Chinese buyers pay millions for lucky numbers", q: "lucky number license plate auction Hong Kong" }
  ],

  // --- Current contest (drives countdowns on the site)
  contest: { title: "Prosper Poster Challenge 2027", deadline: "2027-01-28T23:59:00Z", prize: "US$585 + featured placement" }
};
