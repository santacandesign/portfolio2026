# Job Search 2026

A Sankey of every full-time role I pursued in 2026: where it started, how far it got, and how it ended.
Built with D3. The page (`index.html`) contains counts only, no company names.

- `index.html`: the interactive chart (hover for counts). Buttons export SVG / PNG.
- `job-search-2026.png`: static export.
- `build.py` + `template.html`: regenerate `index.html` from `data/companies.csv`.

`data/companies.csv` (company-level classification) is local and gitignored.
Columns: `company, source, stages, end, confidence, note`. Stages use S, A, R1, R2, R3, O.

```bash
python3 build.py
```
