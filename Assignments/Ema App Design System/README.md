# Ema Design System

A lightweight, neutral-calm design system for **Ema** — the Universal AI Employee platform. Built on Satoshi type, a warm beige-on-white surface, a deep green primary, and the Phosphor icon family.

> **Sources**
> - GitHub: [`Ema-Unlimited/ema-fe-lib`](https://github.com/Ema-Unlimited/ema-fe-lib) — `packages/design-system/` (@main)
>   - `src/styles.css` — font registrations + CSS variable defaults
>   - `src/tokens/colorTokens.json`, `typographyTokens.json`, `borderTokens.json`
>   - `tailwind.preset.js` — canonical Tailwind theme
>   - `src/icons/Icons.ts` — Phosphor icon allow-list
> - Fonts: Satoshi (Indian Type Foundry) — provided as .otf in this project.

---

## Company / product context

**Ema** (short for "Universal AI Employee") is an enterprise AI platform that deploys agentic "AI employees" into Fortune 500 companies to automate complex, cross-functional workflows (customer support, underwriting, analyst research, sales operations, etc.). The product surface is a **web app** where humans collaborate with Ema agents — dashboards, chat/composer interfaces, structured workflows, data widgets, and settings.

The `@ema/design-system` package is the shared React + Tailwind library consumed by every Ema frontend. It is **Radix-primitive driven**, component-rich (65+ primitives: Accordion, Modal, Drawer, Command, EventCalendar, Chart, Toast, Sidebar, Stepper, …), and ships both top-level and subpath imports for tree-shaking.

### Products represented here
1. **Ema web app** — the primary workspace. Sidebar nav, chat composer, data widgets, agent runs.
2. **Marketing / admin shell** — shares tokens; lower density; more beige breathing room.

---

## File index

```
.
├── README.md                  ← this file
├── SKILL.md                   ← Agent-Skills entry point
├── colors_and_type.css        ← tokens: colors, type, spacing, radius, shadow, motion
├── fonts/                     ← Satoshi .otf (300–900, regular + italic)
├── assets/                    ← logos, icon sprite notes, marks
├── preview/                   ← Design-System tab cards (small HTML previews)
└── ui_kits/
    └── web_app/
        ├── README.md
        ├── index.html         ← interactive click-thru of the app
        └── *.jsx              ← Button, Sidebar, Composer, DataCard, Modal, …
```

---

## Content fundamentals

Ema's voice is **calm, confident, and outcome-oriented**. It speaks to operators at large enterprises — not engineers, not consumers.

- **Voice**: straightforward, never cute. "Ema handles the full case from intake to resolution" — not "Let's get started! ✨".
- **Person**: second-person ("you", "your team") for product; third-person ("Ema") when referring to the agent. Avoid "we" in product UI.
- **Casing**: Sentence case for buttons, menu items, headings, tabs. **No Title Case** on UI labels. Brand names and proper nouns keep their casing (Ema, Salesforce, Okta).
- **Tone words**: *agentic, universal, generative, autonomous, workflow, runbook, policy, handoff, context, grounded, audit trail, enterprise-grade*.
- **Avoid**: "AI-powered", exclamation points, emojis, "magic"/"wizard" metaphors outside the explicit AI-Magic purple surface, gerund-heavy copy ("Supercharging your…"), hype adjectives ("revolutionary", "game-changing").
- **Numbers**: prefer concrete numbers over vague claims. "Resolves 73% of tier-1 tickets" over "resolves most tickets."
- **Empty states**: imperative + what's next. Example: *"No runs yet. Start one from a workflow to see history here."*
- **Errors**: plain, actionable, no blame. *"We couldn't reach Salesforce. Check the connection in Integrations."*
- **Headings**: short, nouny. "Runs", "Knowledge", "Integrations" — not "Your runs" or "All integrations".

### Sample copy
- CTA: `Start a run` · `Add to knowledge` · `View audit log`
- Empty state title: `No policies yet`
- Empty state body: `Policies let Ema decide when to route, escalate, or resolve a case. Add one to get started.`
- Confirmation: `Handoff complete. The case is now with Priya.`
- AI assist label: `Drafted by Ema · Review before sending`

---

## Visual foundations

### Palette vibe
Warm, low-contrast, off-white (`--beige-50 #FBFAF7`). **Never pure `#FFFFFF` as a page background** — white is reserved for cards and input surfaces sitting on beige. The primary is a **deep, botanical green** (`--green-800 #1F8844`, hover-down to `--green-900 #017A37`). The palette is explicitly *not* blue-tech; feels adjacent to finance/law interfaces but softer.

Supporting hues are reserved for semantic jobs:
- **Blue** → info
- **Orange** → warning
- **Red** → error / destructive
- **Yellow** → pending
- **Purple** → AI-magic (anything Ema-generated, draft suggestions, "assist me")
- **Gray cool scale** → tabular data, grids
- **Beige scale** → all chrome and neutral surfaces

### Typography
Single family: **Satoshi** (300–900). No display/serif pairing. Hierarchy comes from weight + size, not from family switches.
- Display 56/60 (900)
- H1 36/40 (700) · H2 30/36 (700) · H3 24/32 (500)
- H4 20/28 (500) · H5 18/28 (500)
- Body 14/20 (400 / 500 / 700) · Small 12/16
- Labels are bold + uppercase + 1.2–1.4px tracking (`text-xs-label`)

### Spacing & density
4-px grid. App is **dense, not airy** — tables and sidebars at 14px body, 4/8/12 spacing units. Marketing surfaces relax to 16px body and 24/48 spacing.

### Corners
`4 / 6 / 8 / 12 / 16` scale. Buttons and pills = `8px`. Cards = `12px`. Modal/drawer = `12px`. No sharp 0-radius chrome except dividers.

### Borders
Hairline neutrals: `0.5px` and `1px` in `--beige-400 #E3E1DB`. Dividers are beige, not gray — this is what gives Ema's UI its warm, paper-like feel. Inputs get `1px --beige-500` resting, `--green-500` focus.

### Shadows
Soft, warm — tinted with beige black (`rgba(35,33,25,…)` not `rgba(0,0,0,…)`).
- `xs` hover lift on rows
- `sm` default card
- `md` floating menus (dropdown, popover)
- `lg` modal / drawer
- **Focus ring**: `0 0 0 3px rgba(31,136,68,.25)` — green glow, no outer outline.

### Hover / press states
- **Primary button hover**: step from `--green-800` → `--green-900` (darken). No scale, no shadow change.
- **Primary press**: `--green-930`; no scale-down.
- **Secondary/ghost hover**: background becomes `--beige-100`; pressed = `--beige-200`.
- **Row hover (table/list)**: background `--beige-100`.
- **Icon button hover**: background capsule `--beige-100` at radius 6px.
- Transitions are **150ms ease-out-quint** (`cubic-bezier(0.16, 1, 0.3, 1)`) — same curve used everywhere in the Tailwind preset.

### Motion
- Overlay fade-in: 150ms
- Content show: 150ms with translate + scale
- Slide-in menus: 400ms `ease-out-quint`
- Toasts: 300ms `slideIn` from top
- No bounce, no spring; the brand is calm, not playful.
- Skeletons shimmer left→right (100% translate) using `--skeleton-gradient` (beige-400 → beige-50).

### Backgrounds & imagery
- **No gradients** as decoration. The one exception is the `skeleton-gradient` and rare marketing hero tints.
- **No hand-drawn illustrations, no textures, no grain.**
- Product screenshots + isometric/3D photography with soft shadow are used on marketing.
- Full-bleed hero images are cropped wide and desaturated, with green as the sole accent.

### Transparency / blur
Used sparingly. Modal scrims = `rgba(35,33,25,0.32)`. Sticky headers over content can use `backdrop-filter: blur(8px)` at `rgba(251,250,247,0.8)` (beige-50).

### Cards
- Background `--white` on `--app-background` (beige-50).
- Border `1px --beige-400`.
- Radius `12px`.
- Shadow `--shadow-sm` resting, `--shadow-md` on hover when interactive.
- No colored left-accent-borders. No colored gradients on cards.

### Fixed elements / layout
- App shell = collapsible left `Sidebar` (240/72), top `Navbar` (56h), content fills.
- Drawers open from right at 480–640 wide.
- Modals centered, max-width 560, with `Modal.Header / Body / Footer` pattern.
- Breakpoint `3xl` = 1920 (added by Tailwind preset).

### Use of color in imagery
Warm neutral photography with green as a single accent; avoid saturated marketing collage. Product screenshots keep their native palette; don't tint.

---

## Iconography

**Primary source**: [Phosphor Icons](https://phosphoricons.com/) — React via `@phosphor-icons/react`. The design system ships an allow-list of ~220 icons through `IconComponent`.

```tsx
<IconComponent name="MagicWand" size="md" weight="regular" />
```

- **Weights used in product**: `regular` by default; `bold` for active states; `fill` only for status dots and the brand mark.
- **Sizes**: `xs 12 · sm 14 · md 16 · lg 20 · xl 24 · xxl 32 · 3xl 40`.
- `name="Question"` is the fallback when a name is missing.
- **Color**: pass a base token (`'beige-800'`) or a semantic token (`'brandPrimary'`); defaults to `currentColor`, so most icons inherit text color.

### In this project
Phosphor is loaded from CDN in HTML previews:
```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
<i class="ph ph-magic-wand"></i>
```

Custom marks (`StepBullet`, stepper numbering dots) are coded as inline SVG — kept under `assets/` when needed.

### Emoji & unicode
- **Emoji**: not used in product UI. Never in buttons, empty states, or toasts. Permitted only in user-authored content rendered verbatim (e.g. a message the user typed).
- **Unicode symbols**: `·`, `→`, `⌘`, `⏎`, `⇧` appear in keyboard hints and inline metadata.

### Icon placement conventions
- Leading icon inside a button sits 6px before the label.
- Standalone icon buttons are 32×32 hit target with a 16px icon, 6px radius.
- Status icons (`CheckCircle`, `Warning`, `Info`) match their semantic color token.
- AI-generated content is prefixed by `MagicWand` in AI-Magic purple.

---

## Component inventory (from @ema/design-system)

Accordion · AlertDialog · AudioPlayer · Avatar · Badge · Banner · BreadCrumbs · Button · ButtonGroup · Calendar · Card · Carousel · Cascader · Chart · Checkbox · ComboBox · Command · CopyButton · DateRangePicker · DebouncedSearchInput · DeleteWarning · DiffText · Drawer · DropdownMenu · EmptyScreenPlaceholder · EventCalendar · FieldGroup · FileDropZone · FileRow · Form · InfoStrip · Input · InputGroup · InputHintText · InputOTP · Label · Lottie · Modal · Navbar · PopConfirm · Popover · RadioGroup · ScrollArea · SectionHeader · Separator · Sidebar · SingleSelect · Skeleton · Slider · Spinner · Stepper · Switch · Table · Tabs · Tag · TextArea · TextLink · TextShimmerWave · Toast · Toggle · ToggleGroup · Tooltip

The `ui_kits/web_app/` folder recreates a representative subset with pixel-level fidelity to the token system.

---

## UI kits

- **`ui_kits/web_app/`** — Ema web app. Sidebar + Navbar + workspace with click-thru: dashboard → run detail → composer. Components: `Button`, `IconButton`, `Input`, `Badge`, `Tag`, `Avatar`, `Card`, `Sidebar`, `Navbar`, `Composer`, `RunRow`, `StatusDot`, `Modal`.

---

## Caveats & substitutions
- **Satoshi variable** is referenced by the upstream package (`Satoshi-Variable.woff2`). Only static weight .otf files were provided, so this package loads 5 static weights (Light/Regular/Medium/Bold/Black + italics) via `@font-face`. Visually identical for 300/400/500/700/900; intermediate weights will snap.
- Marketing illustrations, product screenshots, and Lottie animations are **not included** — they live in Ema's product repos/CDN and require access.
- `EventCalendar`, `Chart`, and `Lottie` depend on heavy third-party libraries and are represented structurally, not functionally, in the UI kit.
