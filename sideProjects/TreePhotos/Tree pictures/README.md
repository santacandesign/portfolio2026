# Santa's Trees 🌳

An interactive map + timeline of tree photos, built from a Google Photos
export of the `green` album.

## Open it

Open **`tree-map.html`** in a browser. For best results (and to load the
high-res `photos.json`) serve the folder:

```bash
cd "Tree pictures"
python3 -m http.server 8000
# then visit http://localhost:8000/tree-map.html
```

Double-clicking the file also works — it falls back to the embedded
`tree-data.js`. The map basemap and fonts load from the internet, so you need
a connection for the map tiles to appear (the photos themselves are local).

## How to use

- **Map** shows a circular thumbnail pin for every photo that had GPS in it.
- **Filmstrip** at the bottom is the timeline — scroll/drag it left and right;
  the centred photo becomes active and the map flies to it.
- **Year chips** above the filmstrip jump you to the first photo of that year.
- **Click the centred photo** (or a pin) to open it full-screen. Use
  **← / →** to browse, **Esc** to close.
- Photos with no saved location show a small amber dot and still appear in the
  timeline — they just don't move the map.

## The data (one aggregated source)

All photo data lives in two generated, in-sync files:

- **`photos.csv`** — the editable source of truth. Columns:
  `file, full, thumb, date, lat, lon, name, notes`. Add a tree name in the
  `name` column, fix a date, or paste coordinates for the location-less photos.
- **`photos.json`** — same data as JSON, read by the app when served.
- **`tree-data.js`** — same data embedded for `file://` use.

After editing `photos.csv`, run:

```bash
python3 regen-data.py
```

to rebuild `photos.json` and `tree-data.js`.

## Images

Originals (~410 MB) were compressed to near-lossless WebP:

- `images/full/` — up to 2000px, quality 85 (~61 MB total)
- `images/thumb/` — up to 500px, used by the map pins and filmstrip (~5 MB)

Originals are untouched in `../green/`.

## Files

```
tree-map.html / tree-map.css / tree-map.js   the app
tree-data.js                                  embedded data (for file://)
photos.json / photos.csv                      aggregated data
regen-data.py                                 CSV -> json/js
images/full, images/thumb                     compressed WebP photos
```

The map style reuses the Safe Food Guide's MapLibre + OpenFreeMap setup.
