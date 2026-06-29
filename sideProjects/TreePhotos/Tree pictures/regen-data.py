#!/usr/bin/env python3
"""
Regenerate photos.json and tree-data.js from photos.csv.

Edit photos.csv (add tree names in the `name` column, notes, fix a date or
lat/lon), then run:   python3 regen-data.py
The map + timeline read photos.json (when served) or tree-data.js (when the
page is opened directly by double-click), so this keeps both in sync.
"""
import csv, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(HERE, "photos.csv")
rows = []
with open(csv_path, newline="") as fh:
    for r in csv.DictReader(fh):
        rows.append({
            "file": r["file"],
            "full": r["full"],
            "thumb": r["thumb"],
            "date": r["date"],
            "lat": float(r["lat"]) if r["lat"] not in ("", "None", None) else None,
            "lon": float(r["lon"]) if r["lon"] not in ("", "None", None) else None,
            "name": r.get("name", ""),
            "notes": r.get("notes", ""),
        })

rows.sort(key=lambda x: x["date"] or "9999")
json.dump(rows, open(os.path.join(HERE, "photos.json"), "w"), indent=2)
open(os.path.join(HERE, "tree-data.js"), "w").write(
    "window.TREE_PHOTOS = " + json.dumps(rows, indent=1) + ";"
)
print(f"Regenerated photos.json and tree-data.js ({len(rows)} photos).")
