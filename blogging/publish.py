#!/usr/bin/env python3
"""
publish.py — ships Obsidian blog notes to santais.online

What it does:
  1. Scans your Obsidian vault's Blog folder for notes with `status: Ready to publish`
  2. Converts each note's markdown body to HTML using your existing post template
  3. Adds a new card (with its tags) to index.html, rebuilds the filter chips
     from the tags in use, and adds a new <item> to feed.xml
  4. Flips the note's frontmatter status to `Published` so it won't ship again

Tags: add a `tags` list property in the note (Obsidian's built-in Tags
property). A note with no tags is NOT published — the script warns and skips it.

Setup (one time):
    pip3 install markdown pyyaml

Usage:
    python3 publish.py            # publish everything marked "Ready to publish"
    python3 publish.py --push     # also git add/commit/push the site repo after publishing
    python3 publish.py --dry-run  # show what would happen, write nothing
    python3 publish.py --force    # overwrite an already-published post instead of skipping it
                                   # (use this to push edits made after the first publish —
                                   #  set the note's status back to "Ready to publish" first)
"""

import os
import re
import sys
import glob
import html
import shutil
import argparse
import og
import subprocess
import datetime as dt
from xml.sax.saxutils import escape as xml_escape

try:
    import markdown as md
except ImportError:
    print("Missing dependency. Run:  pip3 install markdown")
    sys.exit(1)

try:
    import yaml
except ImportError:
    print("Missing dependency. Run:  pip3 install pyyaml")
    sys.exit(1)

# ---------------------------------------------------------------------------
# CONFIG — edit these if your paths ever change
# ---------------------------------------------------------------------------
VAULT_BLOG_DIR = "/Users/santa/Documents/Obsidian Vault/Writing/Blog"
VAULT_ROOT = "/Users/santa/Documents/Obsidian Vault"  # searched for images referenced via ![[...]]
SITE_DIR = "/Users/santa/Desktop/portfolio 2026/blogging"
SITE_BASE_URL = "https://santais.online/blogging"
READY_STATUS = "Ready to publish"
PUBLISHED_STATUS = "Published"

BLOGS_DIR = os.path.join(SITE_DIR, "blogs")
ASSETS_DIR = os.path.join(SITE_DIR, "assets")
INDEX_HTML = os.path.join(SITE_DIR, "index.html")
FEED_XML = os.path.join(SITE_DIR, "feed.xml")

INDEX_ANCHOR = "<!-- posts:start -->"
CHIPS_RE = re.compile(r"(<!-- chips:start -->\n).*?(            <!-- chips:end -->)", re.DOTALL)
CHIP_ORDER = ["personal", "design", "weeknotes", "review"]  # shown first, in this order; other tags follow A-Z
CHIP_LABELS = {"review": "Reviews"}  # default label is the tag, capitalised
FEED_ANCHOR = "<link>https://santais.online/blogging/</link>"

POST_TEMPLATE = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="{description}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:image" content="{og_image}" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="{og_image}" />
    <link rel="stylesheet" href="../blog.css?v=2" />
  </head>

  <body>
    <a href="../index.html" class="back">Back to blog</a>
    <h1 style="padding-bottom: 8px">{title}</h1>
    {subtitle_html}
    <p class="subtitle">{date_long}</p>
    {tags_html}
    <br /><br />
    {body_html}
  </body>
</html>
"""


# ---------------------------------------------------------------------------
# Frontmatter parsing (uses PyYAML so it doesn't matter whether a property in
# Obsidian is typed as Text, List, or Date — all forms are handled correctly)
# ---------------------------------------------------------------------------
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?\n)---\s*\n?(.*)$", re.DOTALL)


def split_frontmatter(text):
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None, None
    return match.group(1), match.group(2)


def normalize_tags(value):
    """Obsidian's Tags property is a YAML list; also accept a bare string
    ("a, b" or "a b"). Lowercased, leading # stripped, duplicates dropped."""
    if value is None:
        return []
    if isinstance(value, str):
        value = re.split(r"[,\s]+", value)
    out = []
    for v in value:
        t = str(v).strip().lstrip("#").strip().lower().replace(" ", "-")
        if t and t not in out:
            out.append(t)
    return out


def parse_note(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    fm_block, body = split_frontmatter(text)
    if fm_block is None:
        return None, None

    try:
        raw = yaml.safe_load(fm_block) or {}
    except yaml.YAMLError as e:
        print(f"Skipping {os.path.basename(path)} — couldn't parse frontmatter: {e}")
        return None, None

    fields = {}
    fields["tags"] = normalize_tags(raw.get("tags"))
    for key, value in raw.items():
        if key == "tags":
            continue
        # Obsidian "List" type properties come through as a YAML list even
        # when there's only one value in them — flatten to a plain string.
        if isinstance(value, list):
            value = value[0] if value else ""
        fields[key] = "" if value is None else str(value).strip()

    return fields, body


def write_status(path, new_status):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    fm_block, body = split_frontmatter(text)
    raw = yaml.safe_load(fm_block) or {}
    raw["status"] = new_status  # written back as a plain string (Text type)

    new_fm_block = yaml.safe_dump(raw, sort_keys=False, allow_unicode=True)
    new_text = f"---\n{new_fm_block}---\n{body}"

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_text)


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------
def fmt_date_long(d):   # "Mar 7, 2026"  (post page subtitle)
    return f"{d.strftime('%b')} {d.day}, {d.year}"


def fmt_date_short(d):  # "Mar 7, 26"    (index card h4)
    return f"{d.strftime('%b')} {d.day}, {str(d.year)[-2:]}"


def fmt_pubdate():
    # "20 minutes past the current time in India, converted to GMT" is the
    # same moment as "20 minutes past the current time in GMT" — IST is a
    # fixed UTC+5:30 offset with no daylight saving, so the offset cancels
    # out. This uses the real time the script runs, not the post's date.
    publish_time = dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=20)
    return f"{publish_time.strftime('%a')}, {publish_time.day} {publish_time.strftime('%b')} {publish_time.year} {publish_time.strftime('%H:%M:%S')} GMT"


# ---------------------------------------------------------------------------
# Markdown pre-processing
# ---------------------------------------------------------------------------
LIST_ITEM_RE = re.compile(r"^\s*(?:[-*+]|\d+\.)\s+")


def normalize_lists(md_text):
    """
    Obsidian renders a list even without a blank line before it. Standard
    Markdown (what the `markdown` library follows) does not — it treats
    those lines as a continuation of the previous paragraph, so the list
    silently disappears in the generated HTML. This inserts the missing
    blank line automatically so lists always convert correctly.
    """
    lines = md_text.split("\n")
    out = []
    for line in lines:
        if LIST_ITEM_RE.match(line) and out and out[-1].strip() != "" and not LIST_ITEM_RE.match(out[-1]):
            out.append("")
        out.append(line)
    return "\n".join(out)


# Obsidian image embed: ![[filename.ext]] or ![[filename.ext|300]] (width hint)
IMAGE_EMBED_RE = re.compile(r"!\[\[([^\]\|]+\.(?:png|jpe?g|gif|webp|svg))(?:\|(\d+))?\]\]", re.IGNORECASE)


def find_in_vault(filename):
    for root, dirs, files in os.walk(VAULT_ROOT):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        if filename in files:
            return os.path.join(root, filename)
    return None


def process_images(md_text, slug):
    """
    Finds ![[filename]] embeds, locates the file anywhere in the vault,
    copies it into assets/{slug}/, and rewrites the embed as a real <img>
    tag pointing at that copy — matching the site's existing convention
    (e.g. assets/jhamkhanditrip/hotel.png).
    """
    def repl(match):
        filename, width = match.group(1).strip(), match.group(2)
        src_path = find_in_vault(filename)
        if not src_path:
            print(f"  Warning: couldn't find image '{filename}' anywhere in the vault — leaving a placeholder comment.")
            return f"<!-- MISSING IMAGE: {filename} -->"

        dest_dir = os.path.join(ASSETS_DIR, slug)
        os.makedirs(dest_dir, exist_ok=True)
        shutil.copy2(src_path, os.path.join(dest_dir, filename))

        width_attr = f' width="{width}"' if width else ""
        return f'<img src="../assets/{slug}/{filename}"{width_attr} />'

    return IMAGE_EMBED_RE.sub(repl, md_text)


# ---------------------------------------------------------------------------
# Builders
#
# title/description are plain text typed in Obsidian and can contain
# characters like & < > that are meaningful in HTML/XML. They're escaped
# separately for each output (html.escape for the HTML pages, xml_escape
# for the RSS feed) so a title like "Learnings & Updates" doesn't produce
# invalid markup or a broken feed.
# ---------------------------------------------------------------------------
def tags_spans(tags):
    return "".join(f'<span class="tag">{html.escape(t)}</span>' for t in tags)


def build_post_html(title, description, date_long, body_md, slug, tags):
    body_md = process_images(body_md, slug)
    body_md = normalize_lists(body_md)
    body_html = md.markdown(body_md.strip(), extensions=["extra"])
    return POST_TEMPLATE.format(
        title=html.escape(title),
        description=html.escape(description or title),  # meta tags need something
        subtitle_html=f'<p class="subtitle">{html.escape(description)}</p>\n    <br />' if description else "",
        date_long=date_long,
        tags_html=f'<span class="tags post-tags">{tags_spans(tags)}</span>',
        url=f"{SITE_BASE_URL}/blogs/{slug}.html",
        og_image=f"{SITE_BASE_URL}/assets/og/{slug}.webp",
        body_html=body_html,
    )


def build_index_card(title, description, slug, date_short, tags):
    title = html.escape(title)
    description = html.escape(description)
    subtitle = f'\n          <p class="subtitle">{description}</p>' if description else ""
    return f"""      <a href="/blogging/blogs/{slug}.html" class="blogpost" data-tags="{html.escape(" ".join(tags))}">
        <div>
          <h2>{title}</h2>{subtitle}
        </div>
        <div class="meta"><h4>{date_short}</h4><span class="tags">{tags_spans(tags)}</span></div>
      </a>
"""


def build_feed_item(title, description, slug, pubdate):
    link = f"{SITE_BASE_URL}/blogs/{slug}.html"
    return f"""
    <item>
      <title>{xml_escape(title)}</title>
      <link>{xml_escape(link)}</link>
      <description>{xml_escape(description or title)}</description>
      <pubDate>{pubdate}</pubDate>
      <guid>{xml_escape(link)}</guid>
    </item>
"""


# ---------------------------------------------------------------------------
# Upsert helpers — replace an existing card/item in place if the slug is
# already there (republishing an edit), otherwise insert it fresh (first
# publish). This is what makes --force safe: it never duplicates entries.
# ---------------------------------------------------------------------------
def upsert_index_card(index_html, slug, new_card):
    pattern = re.compile(
        r'[ \t]*<a href="/blogging/blogs/' + re.escape(slug) + r'\.html" class="blogpost".*?</a>\n?',
        re.DOTALL,
    )
    if pattern.search(index_html):
        return pattern.sub(lambda m: new_card, index_html, count=1)
    return index_html.replace(INDEX_ANCHOR, INDEX_ANCHOR + "\n" + new_card.rstrip("\n"), 1)


def rebuild_chips(index_html):
    """Filter chips = "All" + every tag used by a card, so a new tag typed in
    Obsidian shows up as a chip automatically."""
    used = set()
    for m in re.finditer(r'class="blogpost" data-tags="([^"]*)"', index_html):
        used.update(m.group(1).split())
    ordered = [t for t in CHIP_ORDER if t in used] + sorted(used - set(CHIP_ORDER))
    chip = '            <button type="button" class="chip" data-filter="{t}" aria-pressed="false">{label}</button>\n'
    chips = chip.format(t="all", label="All").replace('aria-pressed="false"', 'aria-pressed="true"')
    for t in ordered:
        chips += chip.format(t=html.escape(t), label=html.escape(CHIP_LABELS.get(t, t.capitalize())))
    return CHIPS_RE.sub(lambda m: m.group(1) + chips + m.group(2), index_html, count=1)


def upsert_feed_item(feed_xml, slug, new_item):
    link = f"{SITE_BASE_URL}/blogs/{slug}.html"
    pattern = re.compile(
        r"\n?    <item>.*?<link>" + re.escape(link) + r"</link>.*?</item>\n?",
        re.DOTALL,
    )
    if pattern.search(feed_xml):
        return pattern.sub("\n" + new_item, feed_xml, count=1)
    return feed_xml.replace(FEED_ANCHOR, FEED_ANCHOR + "\n" + new_item, 1)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--push", action="store_true", help="git add/commit/push after publishing")
    parser.add_argument("--dry-run", action="store_true", help="show what would happen, write nothing")
    parser.add_argument("--force", action="store_true", help="overwrite an already-published post's HTML/index/feed entry")
    args = parser.parse_args()

    if not os.path.isdir(VAULT_BLOG_DIR):
        print(f"Can't find vault Blog folder at: {VAULT_BLOG_DIR}")
        sys.exit(1)

    note_paths = sorted(glob.glob(os.path.join(VAULT_BLOG_DIR, "**", "*.md"), recursive=True))
    ready_notes = []

    for path in note_paths:
        fields, body = parse_note(path)
        if not fields:
            continue
        if fields.get("status", "").strip().lower() != READY_STATUS.lower():
            continue

        if not fields["tags"]:
            print(f"WARNING: not publishing {os.path.basename(path)} — it has no tags. Add at least one in the note's Tags property.")
            continue

        missing = [k for k in ("title", "date", "slug") if not fields.get(k)]  # description is optional
        if missing:
            print(f"Skipping {os.path.basename(path)} — missing frontmatter field(s): {', '.join(missing)}")
            continue

        try:
            date_obj = dt.datetime.strptime(fields["date"].strip(), "%Y-%m-%d")
        except ValueError:
            print(f"Skipping {os.path.basename(path)} — date must be YYYY-MM-DD, got: {fields['date']}")
            continue

        ready_notes.append({
            "path": path,
            "fields": fields,
            "body": body,
            "date_obj": date_obj,
        })

    if not ready_notes:
        print("Nothing marked 'Ready to publish'. Nothing to do.")
        return

    # newest first, in case multiple are ready at once
    ready_notes.sort(key=lambda n: n["date_obj"], reverse=True)

    index_html = open(INDEX_HTML, "r", encoding="utf-8").read()
    feed_xml = open(FEED_XML, "r", encoding="utf-8").read()

    published = []

    for note in ready_notes:
        f = note["fields"]
        title = f["title"]
        description = f.get("description", "")
        slug = f["slug"]
        date_obj = note["date_obj"]

        post_path = os.path.join(BLOGS_DIR, f"{slug}.html")
        already_live = os.path.exists(post_path)

        if already_live and not args.force:
            print(f"Skipping '{title}' — {slug}.html is already live. Re-run with --force to push these edits.")
            continue

        post_html = build_post_html(title, description, fmt_date_long(date_obj), note["body"], slug, f["tags"])
        index_card = build_index_card(title, description, slug, fmt_date_short(date_obj), f["tags"])
        feed_item = build_feed_item(title, description, slug, fmt_pubdate())

        action = "Updating" if already_live else "Publishing"
        print(f"{'[DRY RUN] ' if args.dry_run else ''}{action}: {title}  ->  blogs/{slug}.html")

        if not args.dry_run:
            os.makedirs(BLOGS_DIR, exist_ok=True)
            og.make_og_image(slug, title, description, fmt_date_long(date_obj), og.excerpt_from_markdown(note["body"]))
            with open(post_path, "w", encoding="utf-8") as out:
                out.write(post_html)

            index_html = upsert_index_card(index_html, slug, index_card)
            feed_xml = upsert_feed_item(feed_xml, slug, feed_item)

            write_status(note["path"], PUBLISHED_STATUS)

        published.append(title)

    if not args.dry_run and published:
        index_html = rebuild_chips(index_html)
        with open(INDEX_HTML, "w", encoding="utf-8") as out:
            out.write(index_html)
        with open(FEED_XML, "w", encoding="utf-8") as out:
            out.write(feed_xml)

    if not published:
        print("Nothing published.")
        return

    print(f"\nDone. Published {len(published)} post(s).")

    if args.push and not args.dry_run:
        subprocess.run(["git", "-C", SITE_DIR, "add", "-A"], check=True)
        subprocess.run(
            ["git", "-C", SITE_DIR, "commit", "-m", f"Publish: {', '.join(published)}"],
            check=True,
        )
        subprocess.run(["git", "-C", SITE_DIR, "push"], check=True)
        print("Pushed to git.")
    elif not args.dry_run:
        names = ", ".join(published).replace("'", "")
        print(f"Now run:  git add -A && git commit -m 'new post: {names}' && git push")


if __name__ == "__main__":
    main()
