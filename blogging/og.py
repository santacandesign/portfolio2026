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


def make_og_image(slug, title, description, date_long, excerpt):
    os.makedirs(OG_DIR, exist_ok=True)

    # full-bleed site background texture, cover-cropped to 1200x630
    bg = Image.open(BG_PATH).convert("RGB")
    scale = max(W / bg.width, H / bg.height)
    bg = bg.resize((int(bg.width * scale) + 1, int(bg.height * scale) + 1), Image.LANCZOS)
    left, top = (bg.width - W) // 2, (bg.height - H) // 2
    canvas = bg.crop((left, top, left + W, top + H)).convert("RGBA")

    pad = 90
    text_w = W - pad * 2
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    title_font = _font(FONT_ITALIC, 60, 700)
    y = 60
    for ln in _wrap(d, title, title_font, text_w)[:2]:
        d.text((pad, y), ln, font=title_font, fill=INK + (255,))
        y += 76
    y += 16

    meta_font = _font(FONT_REG, 22, 300)
    for line in (description, date_long):
        if not line:
            continue
        for ln in _wrap(d, line, meta_font, text_w)[:2]:
            d.text((pad, y), ln, font=meta_font, fill=MUTED + (255,))
            y += 32
        y += 26
    y += 34

    body_font = _font(FONT_REG, 28, 300)
    for ln in _wrap(d, excerpt, body_font, text_w):
        if y > H:
            break
        d.text((pad, y), ln, font=body_font, fill=INK + (255,))
        y += 50

    # fade the whole text layer out toward the bottom edge
    fade_start, fade_end = int(H * 0.5), H - 6
    fade = Image.new("L", (W, H), 255)
    fd = ImageDraw.Draw(fade)
    for row in range(fade_start, H):
        t = min(1.0, (row - fade_start) / (fade_end - fade_start))
        fd.line((0, row, W, row), fill=int(255 * (1 - t) ** 1.4))
    layer.putalpha(ImageChops.multiply(layer.getchannel("A"), fade))
    canvas.alpha_composite(layer)

    out = os.path.join(OG_DIR, f"{slug}.webp")
    canvas.convert("RGB").save(out, quality=80, method=6)
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


DATE_RE = re.compile(r"^(started on |originally published on )?[A-Za-z]{3,9}\.? \d{1,2}, \d{4}$", re.I)


def _clean(fragment):
    fragment = re.sub(r"<img[^>]*>|<br\s*/?>", " ", fragment)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def parse_post_html(path):
    """Returns (title, description, date_long, excerpt) from a generated post page."""
    src = open(path, encoding="utf-8").read()
    src = src.split("<body>", 1)[-1]
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S)
    title = _clean(h1.group(1))
    rest = src[h1.end():]
    h3s = list(re.finditer(r"<h3[^>]*>(.*?)</h3>", rest, re.S))
    # header h3s are the ones before any body content; body starts after the last one
    # that sits in the header block (before the first <p>/<h5>/<h2>/<li>)
    first_body = re.search(r"<(p|h5|h2|li)[ >]", rest)
    cut = first_body.start() if first_body else len(rest)
    head = [m for m in h3s if m.start() < cut]
    texts = [_clean(m.group(1)) for m in head]
    date_long = next((t for t in texts if DATE_RE.match(t) or re.search(r"\d{4}", t) and len(t) < 40), "")
    description = next((t for t in texts if t != date_long), "")
    body = rest[head[-1].end():] if head else rest
    excerpt = _clean(body)[:420]
    return title, description, date_long, excerpt


if __name__ == "__main__":
    blogs = os.path.join(SITE_DIR, "blogs")
    slugs = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(blogs) if f.endswith(".html"))
    for slug in slugs:
        t, desc, dl, ex = parse_post_html(os.path.join(blogs, f"{slug}.html"))
        make_og_image(slug, t, desc, dl, ex)
        print("og:", slug)
