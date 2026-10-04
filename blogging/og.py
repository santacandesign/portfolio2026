#!/usr/bin/env python3
"""
og.py — generates the link-preview (Open Graph) image for each post.

Each image is 1200x630: the site's background texture, a sheet of textured
paper with the post title, and the opening of the post fading out below it.
Images are written to assets/og/{slug}.png.

Usage:
    python3 og.py            # (re)generate previews for every post in blogs/
    python3 og.py some-slug  # just one
publish.py calls make_og_image() automatically for each published post.
"""

import os
import re
import sys
import html
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

SITE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SITE_DIR, "assets")
OG_DIR = os.path.join(ASSETS_DIR, "og")
BG_PATH = os.path.join(ASSETS_DIR, "bgtexturefinal.jpg")
FONT_REG = os.path.join(ASSETS_DIR, "Libre_Baskerville", "LibreBaskerville-VariableFont_wght.ttf")
FONT_ITALIC = os.path.join(ASSETS_DIR, "Libre_Baskerville", "LibreBaskerville-Italic-VariableFont_wght.ttf")

W, H = 1200, 630
INK = (17, 17, 17)
MUTED = (102, 102, 102)
CARD = (40, 40, 1160, 700)  # runs off the bottom so the card looks like a page


def _font(path, size, weight=None):
    f = ImageFont.truetype(path, size)
    if weight:
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f


def _paper_texture(size, seed):
    """Warm off-white paper: grain + soft blotches + a few fibres."""
    rnd = random.Random(seed)
    w, h = size
    base = Image.new("RGB", size, (252, 249, 242))

    grain = Image.effect_noise(size, 18).convert("L").point(lambda v: 150 + v // 2 if v < 255 else 255)
    grain_rgb = Image.merge("RGB", [grain] * 3)
    base = Image.blend(base, ImageChops.multiply(base, grain_rgb), 0.35)

    blot = Image.effect_noise((w // 12, h // 12), 40).convert("L").resize(size, Image.BICUBIC)
    blot = blot.filter(ImageFilter.GaussianBlur(20))
    blot_rgb = Image.merge("RGB", [blot] * 3)
    base = Image.blend(base, ImageChops.multiply(base, blot_rgb), 0.10)

    fibres = Image.new("L", size, 255)
    d = ImageDraw.Draw(fibres)
    for _ in range(450):
        x, y = rnd.randint(0, w), rnd.randint(0, h)
        dx, dy = rnd.randint(-14, 14), rnd.randint(-6, 6)
        d.line((x, y, x + dx, y + dy), fill=rnd.randint(228, 246), width=1)
    fibres = fibres.filter(ImageFilter.GaussianBlur(0.4))
    base = ImageChops.multiply(base, Image.merge("RGB", [fibres] * 3))
    return base


def _wrap(draw, text, font, max_w):
    lines, line = [], ""
    for word in text.split():
        test = f"{line} {word}".strip()
        if draw.textlength(test, font=font) <= max_w:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def make_og_image(slug, title, excerpt, date_long=""):
    os.makedirs(OG_DIR, exist_ok=True)

    # background: site texture, cover-cropped to 1200x630
    bg = Image.open(BG_PATH).convert("RGB")
    scale = max(W / bg.width, H / bg.height)
    bg = bg.resize((int(bg.width * scale) + 1, int(bg.height * scale) + 1), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    canvas = bg.convert("RGBA")

    # paper card with soft shadow
    x0, y0, x1, y1 = CARD
    cw, ch = x1 - x0, y1 - y0
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((x0, y0 + 8, x1, y1 + 8), 14, fill=(0, 0, 0, 70))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(14)))

    paper = _paper_texture((cw, ch), seed=slug).convert("RGBA")
    mask = Image.new("L", (cw, ch), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw - 1, ch - 1), 14, fill=255)
    canvas.paste(paper, (x0, y0), mask)

    # text layer, drawn on a transparent sheet in card coordinates
    pad = 72
    text_w = cw - pad * 2
    layer = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    title_font = _font(FONT_ITALIC, 64, 700)
    title_lines = _wrap(d, title, title_font, text_w)[:3]
    y = 64
    for ln in title_lines:
        d.text((pad, y), ln, font=title_font, fill=INK + (255,))
        y += 82

    if date_long:
        d.text((pad, y + 10), date_long, font=_font(FONT_REG, 20, 300), fill=MUTED + (255,))
        y += 44
    y += 14

    body_font = _font(FONT_REG, 28, 300)
    for ln in _wrap(d, excerpt, body_font, text_w):
        if y > ch:
            break
        d.text((pad, y), ln, font=body_font, fill=INK + (255,))
        y += 50

    # fade: text is fully visible above the fade start, gone by the bottom of the image
    fade_start = max(y0 + 40, 330) - y0
    fade_end = H - y0 - 8
    fade = Image.new("L", (cw, ch), 255)
    fd = ImageDraw.Draw(fade)
    for row in range(ch):
        if row <= fade_start:
            a = 255
        elif row >= fade_end:
            a = 0
        else:
            t = (row - fade_start) / (fade_end - fade_start)
            a = int(255 * (1 - t) ** 1.4)
        fd.line((0, row, cw, row), fill=a)
    layer.putalpha(ImageChops.multiply(layer.getchannel("A"), fade))

    canvas.alpha_composite(layer, (x0, y0))

    out = os.path.join(OG_DIR, f"{slug}.png")
    canvas.convert("RGB").save(out, optimize=True)
    return out


# ---------------------------------------------------------------------------
# Excerpt helpers
# ---------------------------------------------------------------------------
def excerpt_from_markdown(md_text, limit=420):
    """First real paragraph(s) of prose from an Obsidian note body."""
    text = re.sub(r"!\[\[.*?\]\]|!\[.*?\]\(.*?\)|<img[^>]*>", "", md_text)
    text = re.sub(r"\[\[([^\]|]*\|)?([^\]]*)\]\]", r"\2", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[*_`>#]+", "", text)
    paras = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\n\s*\n", text)]
    return " ".join(p for p in paras if p)[:limit]


def _from_post_html(path):
    src = open(path, encoding="utf-8").read()
    title = html.unescape(re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S).group(1)).strip()
    date = re.findall(r"<h3>(.*?)</h3>", src, re.S)
    date_long = html.unescape(date[-1]).strip() if len(date) > 1 else ""
    body = src.split("<br /><br />", 1)[-1]
    paras = re.findall(r"<p>(.*?)</p>", body, re.S)
    paras = [re.sub(r"<[^>]+>", "", p) for p in paras]
    ex = " ".join(html.unescape(re.sub(r"\s+", " ", p)).strip() for p in paras if re.sub(r"<[^>]+>|\s", "", p))
    return title, ex[:420], date_long


if __name__ == "__main__":
    blogs = os.path.join(SITE_DIR, "blogs")
    slugs = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(blogs) if f.endswith(".html"))
    for slug in slugs:
        t, ex, dl = _from_post_html(os.path.join(blogs, f"{slug}.html"))
        make_og_image(slug, t, ex, dl)
        print("og:", slug)
