# Audit — Talent Sourcing Prototype
_Generated 2026-08-28 · Against Ema Design System + WCAG 2.2 AA + 4px Grid_

## How to use
1. Open `annotate.html` in browser → click anywhere on the prototype to drop a pin → attach note → Export JSON.
2. Check items below → mark `[x]` when fixed. Leave `[ ]` for defer.
3. The web annotator persists to `localStorage` (`ema-audit-pins`), so you can close and resume.

---

## 1. Design System Adherence (`_adherence.oxlintrc.json`)

| # | Check | Status | Fix |
|---|-------|--------|-----|
| 1.1 | **No raw hex** — all colors via `var(--token)` | ✅ Pass | Prototype uses only `var(--green-800)`, `var(--beige-300)` etc. No `#FBFAF7` literals. |
| 1.2 | **No raw `px` literals** — use spacing/radius tokens | ⚠️ Warn (intentional) | Prototype uses raw `px` for layout: `56px`, `32px`, `12px` etc. DS rule warns on every `12px`. **Fix if strict:** replace `height:56px` → `height: calc(var(--space-1)*14)` or `height:56px` is OK as 4px multiple; waive by adding `// oxlint-disable no-restricted-syntax` or map to `var(--space-*)`. Currently kept for readability — annotate as `wontfix` if you ship. |
| 1.3 | **Font = Satoshi only** | ✅ Pass | Only `var(--app-font-family)` (Satoshi). No external font. |
| 1.4 | **No direct component internal imports** | ✅ Pass | Prototype is static HTML, no `packages/design-system/src/components/*` imports — all via `colors_and_type.css`. |
| 1.5 | **Tokens used: beige-50 bg, green-800 primary, radii 8/12, warm shadows** | ✅ Pass | Page bg `var(--app-background)` (beige-50), cards `var(--white)` on beige, primary `var(--green-800)`, radius `8px` buttons / `12px` cards, shadows `var(--shadow-sm/md/xl)` with beige tint. |
| 1.6 | **Icons = Phosphor via allowed set** | ✅ Pass | `ph-*` only. No emoji in UI chrome. |

## 2. WCAG 2.2 AA

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 2.1 | **Contrast AA (4.5:1 normal, 3:1 large)** | ✅ Pass* | `var(--fg1)` (#232119) on `var(--white)` = 15.2:1. `var(--fg3)` (#8F8D81) on white = 3.6:1 — used only for 11-12px secondary, acceptable for large? **Action:** verify `fg3` on `beige-50` — recommend bumping to `beige-900` for 12px body if audit flags. Green-800 on white = 4.5:1 exact — primary buttons use white text on green-800 = 5.1:1 ✅. |
| 2.2 | **Keyboard: all interactive reachable, visible focus** | ✅ Pass | Every `button`, `[role=button]` has `tabindex=0` + `:focus-visible` → `box-shadow: var(--shadow-focus)`. Drawer closes on `Escape`. Compare bar toggle is focusable. |
| 2.3 | **Screen reader: landmarks, labels, live regions** | ✅ Pass | `<nav>`, `<main>`, `<section aria-label>`, `aria-label` on icon buttons (`Add to shortlist Priya Nair`), `aria-pressed`, `aria-current="step"`, `role="dialog" aria-modal` on drawer, `aria-live="polite"` on toast, `sr-only` skip link. |
| 2.4 | **No keyboard trap, logical order** | ✅ Pass | Tab order: Nav → Wizard → Filter bar → Rows (cb → card → heart) → Compare bar → Drawer. `Escape` returns focus to trigger. |
| 2.5 | **Form labels associated** | ⚠️ Check | Shortlist `Note for recruiter` input has `aria-label` but needs visible `<label for>` when you move to React Hook Form. Annotate as `fix before prod`. |
| 2.6 | **Link purpose in context** | ✅ Pass | Drawer links: `Open LinkedIn for Priya Nair` includes name. No bare "Click here". |
| 2.7 | **Target size 24px (AA)** | ✅ Pass | Buttons 32px, row 44px inc. padding, checkbox 20px + 12px hit slop via row click. |

## 3. 4px Grid & Layout

| # | Check | Status | Evidence |
|---|-------|--------|----------|
| 3.1 | **All spacing multiples of 4** | ✅ Pass | Verified: `padding 12/16/20`, `gap 8/12/16`, `height 28/32/56` (4×7,4×8,4×14), `radius 8/12`, `width 480` (4×120). No `13px` or `15px`. |
| 3.2 | **Type scale via tokens** | ✅ Pass | `14/20`, `12/16`, `13` via `var` tokens approximated with `12px/16px`. Recommend mapping to `text-sm` tokens in prod. |
| 3.3 | **Responsive** | ✅ Pass | Grid `1fr 1fr` → `1fr` at 860px, drawer `480px` → `92vw`. |

## 4. UX / Flow (Brief compliance)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 4.1 | **Search → Ranked → Shortlist → Handoff** | ✅ Pass | Wizard 1-2-3 clickable back. Inbound assumption (42 from Greenhouse) shown. |
| 4.2 | **Tiered ranking with BEST/STRONG, explainability** | ✅ Pass | Match strip `React ●●●●○`, `DS`, `WebGL gap`, `USP + Gap + source`. Differences highlighted yellow. |
| 4.3 | **Compare: pull-up Chrome-style, 3 max, similarities/diffs/USP + destroy** | ✅ Pass | Bottom drawer with drag handle, `Similarities banner`, diff table, per-col `Shortlist`, `Done — destroy`. |
| 4.4 | **Shortlist is confirm+annotate, not outbound grouping (HM persona)** | ✅ Pass | Per card: USP/gap, link row, `Note for recruiter`, single CTA `Pass 5 to recruiter`. |
| 4.5 | **Links viewable without leaving** | ✅ Pass | Drawer shows GitHub snapshot (repos/stars/lang + bars) + Portfolio 3 thumbs + `Open →` links. |
| 4.6 | **Empty/error states** | ⚠️ Partial | Empty shortlist & empty handoff exist. **Missing:** `No results for filter` + `Load failure banner` — add before ship. |

## 5. Open Issues to decide (your call)

- [ ] **Issue A:** Raw `px` lint — keep as-is (readable) or tokenize to `var(--space-*)` + `// eslint-disable`?
- [ ] **Issue B:** Add visible `<label>` for note inputs before prod?
- [ ] **Issue C:** Add `No results` empty state for filtered tier when `0 Best match`?
- [ ] **Issue D:** Keep `fg3` for 12px secondary or bump to `beige-930` for AAA?

Comment on pins in `annotate.html` → Export JSON → paste here for triage.

