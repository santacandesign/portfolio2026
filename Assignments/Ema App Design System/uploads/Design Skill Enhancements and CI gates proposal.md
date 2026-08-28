# `/ema-design` Skill — Validated Gaps & Improvement Targets to improve Skill and add Design CI gates

## Audience and intent

The audience for the skill is shifting from frontend engineers in ema-next to **non-technical builders** (PMs, founders, low-code users) shipping frontier apps. They should not have to think about UI/UX — the skill should make the right call for them by default. Where the default is wrong, **CI gates** should stop the merge before it ships.

This doc consolidates findings into improvement targets for two parallel workstreams:

1. **`ema-design` skill rewrite** — make AI output reliably hit Ema standard, on either ema-next or any frontier app  
2. **CI gates for ema-next** — paired with the [UX review harness](https://github.com/Ema-Unlimited/ema-fe-lib/blob/1e6159fab6d2a0e5ec34ec24345e6e603fe04892/docs/ux-review-harness.md) — deterministic rules for hard violations \+ semantic LLM review for composition

## Validation sources

- **Internal ema-next sessions:** sidebar revamp, AI Employees home, Workspace consolidation, Governance hub  
- **External reviewer findings on 5 frontier apps:** `exv-hr`, Position Management, CSM, Payroll Hub, Invoice Validator  
- **UX Review Harness design doc** — phases referenced below as `P1` (deterministic lint), `P2` (visual \+ LLM), `P3` (human CODEOWNERS)

---

## Cross-validated gaps

Ranked by recurrence across both sources. Each row pairs the symptom, what the skill currently says (if anything), the proposed generic improvement, and how it should be enforced.

### Tier 1 — Hard violations of "use the DS"

These were called out in **every** reviewer doc and surfaced in sessions too. They have unambiguous correct answers, can be linted deterministically, and should never reach human review.

| \# | Symptom | Skill says | Generic improvement | Enforce |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Custom sidebar, header, table, card, textarea, calendar, badge, progress bar instead of DS equivalents | Anti-pattern bullet: *"Native HTML — `<button>`, `<input>`, `<select>`, `<table>` — always DS components"* | Expand the rule beyond native HTML to **any custom-built equivalent** of a DS component. List the DS surface area and require it. Add a "verify the DS exports it" step before composing. | P1 lint (AST: forbid local `Sidebar`/`Table`/`Card`/`Textarea`/etc. when the DS exports the same name) |
| 2 | Hardcoded hex / arbitrary Tailwind values (`bg-[#...]`) | *"Hardcoded hex values — `bg-[#1F8844]`, any arbitrary color"* | Already covered for the arbitrary-class form. Extend to inline `style={{ backgroundColor }}` and raw palette tokens that don't switch under `.dark`. Document the project-level alias escape hatch. | P1 lint |
| 3 | Page lacks `PageShell`; bulky custom headers; weird custom layouts; stats in the wrong slot | *"Build the sidebar or outer card — the shell provides these via layout.tsx"* | Reframe as a **mandatory Layer 1 step**, not an anti-pattern. Every page must declare its `PageShell` variant before any block composition. Provide a decision flowchart for the variant choice. | P1 lint (pages must wrap in `PageShell.Root`) \+ P2 LLM (variant fit) |
| 4 | Typography weights inconsistent — most text in medium, headers also medium | *"Mixing raw Tailwind with compound classes"* \+ *"Flat hierarchy"* | Add explicit weight hierarchy rule: page title bold, section title bold, card title medium, body normal. Make weight a non-negotiable axis of typography selection. | P1 lint (compound class enforcement — already exists; extend) |

### Tier 2 — Composition defaults the skill is silent on

Reviewer-only findings that sessions didn't surface because they're frontier-specific. The skill currently has no opinion; it should.

| \# | Symptom | Skill says | Generic improvement | Enforce |
| :---- | :---- | :---- | :---- | :---- |
| 5 | Multiple primary buttons on the same page | Nothing | New rule: **one primary button per visible viewport.** Secondary actions use `variant="secondary"` or `variant="ghost"`. Document the action hierarchy: primary \> secondary \> ghost \> tertiary text link. | P2 LLM (count primary CTAs in the rendered screenshot) |
| 6 | "View all" / list CTAs not disabled when there's no data | *"every page needs: loading, empty, no-results, error, success states"* — but only as a checklist | Add an **interaction-state rule**: every CTA whose action depends on data must be disabled (with tooltip explaining why) when the data isn't there. Pair with the existing empty-state rule. | P1 lint (handler dependency check is hard; lean on P2) |
| 7 | App logo built from initials (e.g. letter "e" in a tile) | Nothing | New rule: **app logos use a Phosphor icon** in a green-tile \+ white-icon-on-white-bg pattern. Initials are not allowed. | Skill recipe \+ P2 LLM |
| 8 | Form opens in-page when it should be a modal triggered by a CTA | Nothing | Add a **modal-vs-page heuristic**: short forms (≤6 fields, single-purpose, no multi-step) open in a `Modal`. Long forms / multi-step / wizards get their own page. | Skill recipe \+ P2 LLM |
| 9 | Filter row inconsistent — search field large variant, adjacent dropdowns small | Nothing | New rule: **size consistency within a row.** Pick the smallest viable size and apply it to every control in the same row. | P2 LLM (visual) |
| 10 | Inconsistent card heights / borders inside the same grid | *"Missing `line-clamp-2` on card descriptions"* — partial | Generalize to **uniform card grids**: every card in the same grid declares the same `min-h-X` (matching the `line-clamp` exactly), the same border, the same internal padding. | P2 LLM (visual) |
| 11 | Selection cards missing radio icon; border colors differ between selected/unselected | Nothing | Add a **selection-card recipe**: radio icon top-right, base border `border-muted-border`, selected border `border-brand-primary`, no other variation. | Skill recipe \+ P2 LLM |
| 12 | Form field doesn't fill available horizontal space | Nothing | Add a **field-width default**: form fields fill the available column unless the field is genuinely fixed-size (zip code, country code). Pair with row-distribution pattern (`flex-1 min-w-0`). | P2 LLM (visual) |
| 13 | Tables without pagination; no sensible default page size | *"Missing pagination"* not stated; `DataTable` mentioned | Add a **table default**: any table \> 25 rows must paginate. Default page size \= 25\. Use `DataTable enablePagination`, never hand-rolled prev/next. | P1 lint (forbid hand-rolled prev/next next to a `DataTable`) |
| 14 | Decorative line dividers between unrelated chrome | Nothing | New rule: **dividers are semantic, not decorative.** Use `Separator` only between conceptually distinct sections, never to "fill space." | P2 LLM |

### Tier 3 — Process gaps from sessions

Reviewers can't see these — they review the rendered output. Sessions exposed them because they shaped how the AI worked, not how it shipped.

| \# | Symptom | Skill says | Generic improvement | Enforce |
| :---- | :---- | :---- | :---- | :---- |
| 15 | Skill jumps straight to Layer 1 (shell) — no place for transcripts/briefs/screenshots | Nothing | Prepend an **Intake → Extract → Plan** phase. Distill input into a current-state vs improved-state table before composing. | Skill process |
| 16 | Skill assumes one-shot execution; no vocabulary for visual tuning | Nothing | Add an **Iterative Tuning Loop** section: directional commands as calibration, one knob per iteration, narrowing steps, comments stay in sync with current values. | Skill process |
| 17 | Skill files lag the DS package; trusting them caused build failures | *"Read \[`@ema-ds`\] before using any component"* | Add an explicit **Source of Truth** order: screenshot \> Figma \> rendered code \> skill files \> DS package. Skill files are not authoritative; the package is. | Skill principle |
| 18 | "Remove this from UI" requests get reversed by PMs more often than not | Nothing | Add a **reversibility default**: hide via a paths-set / early return before deleting routes/pages/i18n keys. Pre-emptively offer the trade-off. | Skill principle |
| 19 | Spatial direction commands ("vertically center") ambiguous in flex layouts | Nothing | Add a **screenshot-as-truth rule**: when a screenshot is attached, ground analysis in what's visible. When ambiguous and no screenshot, ask which axis. | Skill principle |
| 20 | Cursor-pagination state mishandled (memo \+ setter chain creates re-render risk) | Nothing | Add a **state-accumulation pattern** for cursor pagination: single `useEffect`, functional updater, dedup by ID. | Skill snippet |
| 21 | Layout-debugging vocabulary missing (`truncate` inside `items-center`, content not filling on wide screens) | Nothing | Add **Layout Debugging Checklists** for the two recurring bugs: width-not-filling and truncate-not-truncating. | Skill process |
| 22 | No named page archetypes — every admin page reinvents structure | Block-level guidance only | Add a **Page Archetypes** subsection: admin hub (sidebar → page → tabs → stacked SectionCards), list-detail, builder, dashboard, centered single-action. | Skill recipes |

---

## Recurring frontier-app pattern: dropdown doesn't auto-close on outside click

Three out of five reviewer docs called this out. The root cause is consistent: builders rolled custom dropdowns instead of using the DS `Dropdown` / `SingleSelect` / `ComboBox`. **This is Tier 1 in disguise** — fix it by enforcing "use the DS Dropdown." If a P1 lint catches custom dropdown composition, this finding goes away.

---

## What goes where

### Into the skill (so AI gets it right by default)

The skill's audience is now low-technical. The skill should make decisions for the user, not document options. Concretely:

**Add as principles at the top:**

- Specialized DS component over hand-rolled  
- Reversibility default  
- Screenshot is ground truth  
- Source of truth: DS package \> skill files

**Restructure the procedure to add:**

- Intake → Extract → Plan (before Layer 1\)  
- Layer 1 expands to a flowchart, not a table  
- Iterative Tuning Loop after Layer 3  
- Layout Debugging Checklists as appendix

**Add named recipes** (the main lift for low-technical users):

- Admin hub (tabs \+ SectionCards)  
- List-detail (table \+ drawer)  
- Builder/editor (panel shell \+ canvas)  
- Dashboard (cards \+ chart blocks)  
- Centered single-action (auth, onboarding)  
- Selection-card grid  
- Logo-tile pattern (green tile \+ Phosphor icon)  
- Modal-form heuristic (when to modal vs page)  
- Filter-row layout (size consistency, distribution)  
- Pagination defaults

**Add anti-pattern bullets:**

- Multiple primary buttons per viewport  
- Custom dropdowns (use DS Dropdown / SingleSelect / ComboBox)  
- Decorative dividers  
- Initials as logo  
- Inline `style` for color  
- Raw palette tokens for chrome  
- Hand-rolled prev/next next to a DS `DataTable`  
- Disabled-CTA missing when its data is missing

### Into CI gates (so violations stop at merge time)

Following the harness's three-phase model.

**P1 — Deterministic lint (blocks merge):**

- Native HTML primitives for interactive elements (existing)  
- Hardcoded hex / arbitrary value classes / inline `style` color (extend existing)  
- Custom local `Sidebar` / `Table` / `Card` / `Textarea` / `Modal` / `Dropdown` / `Calendar` / `Badge` / `Progress` when DS exports same (new)  
- Page must wrap in `PageShell.Root` (new)  
- Page that fetches data must handle all four states: loading, error, empty, data (already in harness doc)  
- Page must have ≥1 Playwright test (already in harness doc)  
- Hand-rolled prev/next adjacent to a `DataTable` (new)  
- Compound typography classes only — no raw `text-lg font-bold` mixed with `header-5-bold` (existing)  
- Static a11y: missing `alt`, missing `aria-label`, click-no-keyboard (already in harness doc via `eslint-plugin-jsx-a11y`)

**P2 — Visual \+ LLM advisory (posts findings, doesn't block):**

- Multiple primary buttons in viewport  
- Filter-row size inconsistency  
- Card height/border inconsistency in grids  
- Empty-space form fields  
- Decorative dividers  
- Logo-tile pattern violations  
- Modal-vs-page mismatch  
- Selection-card pattern violations  
- `PageShell` variant fit (e.g. `centered` used for a list page)

**P3 — Human (gate via CODEOWNERS):**

- Aesthetic taste, design intent  
- Novel UX patterns  
- Multi-tenant / auth-spanning flows

**P4 — Feedback loop:**

- When P3 catches something P1+P2 missed, the regression goes into `docs/ux-review-misses.md`. Weekly triage promotes patterns with ≥2 instances into P1 rules or skill anti-patterns.

---

## Suggested edit order

1. **Skill rewrite (one PR):** prepend principles, prepend Intake phase, replace Layer-1 table with flowchart, add the named recipes, expand anti-patterns. The shape of the doc changes significantly — single PR with full review.  
2. **P1 lint extensions (incremental):** one rule per PR — start with custom-DS-equivalent detection (highest reviewer-recurrence), then `PageShell` enforcement, then hand-rolled-prev/next, then state-branch coverage. Each ships behind `--strict` first to measure noise.  
3. **P2 visual review prototype:** stand up the screenshot fixture and `claude-code-action` flow per the harness doc. Validate against historical PRs before turning on for new PRs.  
4. **P4 misses log:** create `docs/ux-review-misses.md` and the PR template field. Doesn't need P2 to be live — start logging immediately.

---

## Open questions for review

- **Selection-card and logo-tile patterns** — should these be DS components instead of skill recipes? If they're recipes, every consumer reimplements; if they're DS components, the lint catches reimplementation. (Blocks initiative below resolves this — both become DS blocks.)  
- **Modal-vs-page heuristic threshold** — is "≤6 fields, single-purpose, no multi-step" the right default? Worth a separate brainstorm with the design team before codifying.  
- **Frontier-app skill scope** — does the skill rewrite cover both ema-next and frontier apps from a single source, or does each consumer get a tailored slice via `catalog-setup.sh`? The harness doc assumes per-consumer rollout; the skill should match.  
- **Low-tech user verification** — for non-engineers, the "Layout Debugging Checklists" are too technical. Consider a stripped-down "If this looks wrong, send a screenshot back" section instead.

---

## Next improvement after Skill rewrite \+ CI gates land: DS Blocks

Inspired by [shadcnblocks.com](https://www.shadcnblocks.com/blocks). After the skill rewrite and the P1/P2 CI gates ship, the next leverage move is to **replace recipes with code-level Blocks** in the DS package.

### Why blocks beat recipes

Recipes are markdown — the agent reconstructs JSX from guidance, with drift, reinterpretation, and missed constraints baked in. Blocks are **code the agent imports as-is**. There is nothing to get wrong inside a block.

This collapses most Tier 1 \+ Tier 2 reviewer findings to a single rule. Custom sidebars, custom headers, custom tables, multiple primary buttons, inconsistent card heights, custom dropdowns, missing radio on selection cards, decorative dividers, logo-as-initials — every one of these is a composition mistake. If the block already encodes the composition, the mistake stops being possible.

### Audience and CI fit

- **Low-technical builders pick from a gallery instead of composing.** The skill collapses from a composition guide to a decision tree: *describe your page → pick the block*.  
- **CI lint becomes trivial.** Instead of an AST rule asking *"did you build a custom sidebar"* (hard, high false positives), P1 becomes *"this page is an admin hub — it must import `<AdminHubBlock>`"* (a single import check).  
- **Faster AI execution.** Agent's job becomes *select block → wire data → done*. The 50-round visual tuning loop in past sessions becomes 3 rounds because the block already shipped the right values.  
- **Versioned, testable, cross-consumer.** Blocks ship from one package, get Storybook stories, screenshot diffs, Playwright coverage. Frontier apps and ema-next pull from the same source — no per-consumer fragmentation.

### Long-tail strategy

Roughly 80% of pages will hit a block; the last 20% won't. The long tail goes through **composition**, where the post-rewrite skill \+ the P1/P2 CI gates ensure the standard is still met. Recipes don't disappear — they shrink to a "what to do when no block fits" appendix, much smaller than today.

### Seed list (small, high-leverage)

Eight blocks probably cover 70–80% of admin and frontier pages:

- `AdminHubBlock` — sidebar entry → page → tabs → stacked SectionCards  
- `ListDetailBlock` — table \+ drawer pattern  
- `DashboardStatsBlock` — stat cards \+ chart row  
- `SelectionCardGrid` — radio-style selection with consistent borders  
- `LogoTile` — green tile \+ Phosphor icon, replaces initials  
- `FilterRowBlock` — even-distribution filter row with size consistency  
- `EmptyStateBlock` — empty / no-results / error variants  
- `ConfigCardBlock` — SectionCard with title, description, icon, action slot, body

Compound API with slots (`<AdminHub.Tabs>`, `<AdminHub.Card>`) is the customization escape hatch — so "the admin hub but with X different" doesn't push the agent back to forking.

### Where blocks live

Blocks live in the DS package (`@ema/design-system/blocks/*` or a dedicated `@ema/blocks`), not in the skill. The skill points at them. This gives Storybook \+ tests \+ version pinning for free, and means a single source of truth across consumers.

### Phased rollout

| Phase | Scope |
| :---- | :---- |
| B1. Block API design | Decide compound \+ slot conventions, naming, package boundary. \~1 wk. |
| B2. Seed 8 blocks | Build the seed list with stories \+ screenshot tests. \~3–4 wk. |
| B3. Skill rewrite v2 | Recipes appendix shrinks; block selector decision tree becomes the primary procedure. \~1 wk. |
| B4. P1 lint: block-required archetypes | Heuristic detects archetype intent; lint requires the matching block. \~1 wk. |
| B5. Migration | Existing recipe-driven pages migrated to blocks where they match. Long-tail pages stay on composition. \~ongoing. |

### Trade-offs we accept

- **Maintenance cost** — each block \= TSX \+ tests \+ stories, \~5–10× a markdown recipe. Acceptable; leverage is one block × N consumers.  
- **Block-boundary judgment** — the first 5–8 blocks set the grain. Too coarse \= inflexible; too fine \= recomposition surface again. Compound \+ slots mitigates.  
- **Customization-via-fork risk** — when blocks don't quite fit, builders may fork rather than compose. Skill \+ CI gates catch fork-and-customize the same way they catch greenfield composition.

