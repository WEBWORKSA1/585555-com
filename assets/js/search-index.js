---
---
{% assign ps = site.html_pages | where_exp: "p", "p.search != false" %}window.SEARCH_INDEX=[{% for p in ps %}{"u":{{ p.url | remove_first: "/" | default: "index.html" | jsonify }},"t":{{ p.title | split: " — " | first | split: " | " | first | jsonify }},"d":{{ p.description | jsonify }},"k":{{ p.keywords | default: "" | jsonify }}}{% unless forloop.last %},{% endunless %}{% endfor %}];
