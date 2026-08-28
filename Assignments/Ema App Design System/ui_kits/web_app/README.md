# Ema Web App — UI kit

Interactive click-thru that mirrors the primary Ema web app layout: left **Sidebar**, top **Navbar**, and a workspace that can swap between a dashboard, a run-detail view, and the composer.

Based on `@ema/design-system` tokens (see `../../colors_and_type.css`) and the Phosphor icon family.

## Files
- `index.html` — mounts the app, fake router between 3 screens
- `Sidebar.jsx` — collapsible primary nav
- `Navbar.jsx` — top bar (search, notifications, avatar)
- `Composer.jsx` — chat composer with AI-magic accents
- `RunRow.jsx` — list row for a run
- `Dashboard.jsx` — metric cards + recent runs
- `RunDetail.jsx` — run header, steps, transcript
- `Primitives.jsx` — Button, IconButton, Badge, Tag, Avatar, StatusDot, Card
