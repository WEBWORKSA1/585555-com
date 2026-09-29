#!/usr/bin/env python3
"""Generate assets/img/og.png (1200x630 social card). Requires Pillow."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
im = Image.new("RGB", (W, H), "#7A0F16")
d = ImageDraw.Draw(im)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=(int(122 + 57 * t), int(15 + 17 * t), int(22 + 20 * t)))
def font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]:
        try:
            return ImageFont.truetype(p, sz)
        except OSError:
            pass
    return ImageFont.load_default()
d.rectangle([30, 30, W - 30, H - 30], outline="#E7C65A", width=3)
d.text((80, 120), "58·5555", font=font(170), fill="#FFE9A8")
d.text((84, 340), "I prosper. The Chinese prosperity toolkit", font=font(46), fill="#FFFFFF")
d.text((84, 400), "for pricing, numbers, dates, gifts & campaigns", font=font(40), fill="#F7D9C4")
d.text((84, 500), "585555.com", font=font(44), fill="#E7C65A")
os.makedirs(os.path.join(ROOT, "assets", "img"), exist_ok=True)
im.save(os.path.join(ROOT, "assets", "img", "og.png"))
print("og.png written")
