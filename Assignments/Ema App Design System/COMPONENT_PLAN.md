# Component Gap Analysis & Build Plan
_Ema App Design System — generated May 12 2026_

---

## What we have ✅

| Category | Cards in `/preview/` |
|---|---|
| Colors | brand-primary, neutrals, semantic, supporting |
| Type | headers, body-labels, weights |
| Spacing | spacing-scale, radii-shadows |
| Components | buttons, inputs, badges, cards, icons |
| Brand | logo |
| UI Kit | web-app (Sidebar, Navbar, Dashboard, RunDetail, Composer) |

---

## Full repo component list (69 dirs)

Compared against what's in `preview/`. Gaps below.

---

## Gap list — 54 components not yet documented

### 🔴 Tier 1 — Core atoms (used on every screen, build first)

| Component | Key variants / API notes |
|---|---|
| **Avatar** | sizes xs/sm/md/lg/xl/2xl · `isOnline` indicator · fallback initials · image |
| **Checkbox** | sizes sm/md · checked · indeterminate · disabled |
| **Switch** | sizes md/lg · variants default/orange · disabled w/ LockKey icon |
| **RadioGroup** | Radix primitive · horizontal/vertical · sizes sm/md |
| **Label** | pairs with Input/Checkbox/RadioGroup · required indicator |
| **Separator** | orientation horizontal/vertical · variants default/dashed/dotted · beige-500 |
| **Skeleton** | shapes rectangle/square/rounded · sizes sm/md/lg · shimmer gradient · SkeletonText/Avatar/Button/Input/Paragraph sub-components |
| **Spinner / Loaders** | SpinnerGap icon · SpinnerWithTooltip · used inside Button loading state |
| **Tooltip** | Radix-backed · heading+body · delay · side |
| **TextLink** | textLinkVariants · sizes sm/md/lg · colors |
| **Toggle** | toggleVariants · Radix Toggle primitive |

### 🟠 Tier 2 — Navigation & structural layout

| Component | Key variants / API notes |
|---|---|
| **Tabs** | variants underline/pill · sizes sm/md · fullWidth · Radix primitive |
| **Accordion** | Radix primitive · single/multiple · size |
| **Stepper** | orientations horizontal/vertical · sizes sm/md/lg · Root/Item/Trigger/Content/Separator |
| **BreadCrumbs** | separator · max items · truncation |
| **SectionHeader** | title + subtitle + trailing action slot |
| **Sidebar** | compound: Root/Header/Content/Footer/Item · collapsible · with badge |

### 🟡 Tier 3 — Overlays & feedback

| Component | Key variants / API notes |
|---|---|
| **Modal** | compound: Root/Content/Header/Body/Footer · sizes sm/md/lg |
| **Drawer** | compound: Root/Content/Header/Body/Footer · right/left · widths |
| **Toast** | variants default/success/error/warning/info/aiMagic · actions · auto-dismiss · addToast imperative API |
| **Banner** | variants default/success/error/warning/info/aiMagic · layouts compact/expanded · action button |
| **AlertDialog** | confirm pattern · destructive variant |
| **PopConfirm** | inline confirm popover |
| **Popover** | Radix · trigger + content |
| **DeleteWarning** | wrapWithDeleteWarning HOC |
| **InfoStrip** | inline status strip |

### 🟢 Tier 4 — Form composites

| Component | Key variants / API notes |
|---|---|
| **TextArea** | size sm/md/lg/xl/2xl · ghost variant · resize |
| **InputGroup** | InputGroupAddon · inputGroupVariants |
| **InputHintText** | states default/success/error · ghost |
| **InputOTP** | OTP slot inputs |
| **FieldGroup** | groups inputs horizontally |
| **SingleSelect** | Radix Select · sizes sm/md/lg · search |
| **ComboBox** | multi-select + search + tags |
| **Cascader** | hierarchical select |
| **DateRangePicker** | calendar + range input |
| **DebouncedSearchInput** | Input + debounce hook |
| **ButtonGroup** | buttonGroupVariants · horizontal grouped buttons |
| **Form** | react-hook-form wrapper · FormInput/FormTextArea/useForm |

### 🔵 Tier 5 — Data display & patterns

| Component | Key variants / API notes |
|---|---|
| **Table** | Table/Header/Body/Row/Head/Cell — full semantic HTML table with Ema styling |
| **Tag** | inline removable tag · sizes |
| **EmptyScreenPlaceholder** | icon + title + description + CTA |
| **CopyButton** | copy-to-clipboard with icon feedback |
| **FileRow** | file attachment row with icon, name, size, remove |
| **FileDropZone** | drag-and-drop upload area |
| **DiffText** | inline word-level diff (CodeMirror) |
| **AudioPlayer** | waveform + playback controls |
| **Carousel** | embla-backed · dots/arrows |
| **ToggleGroup** | grouped radix Toggle buttons |

### ⚪ Tier 6 — Heavy / third-party / animation (document as structural previews only)

| Component | Notes |
|---|---|
| **Chart** | recharts wrapper · ChartContainer/ChartTooltip |
| **Calendar** | date picker calendar |
| **EventCalendar** | @fullcalendar — subpath only |
| **Lottie** | lottie-react · starLoaderAnimation |
| **Command** | Cmd+K · CommandDialog/Input/List/Item |
| **DataSourceWidget** | data source connection card |
| **Animation** | TextShimmerWave |
| **BackgroundBoxes** | new! decorative animation component |

---

## Build order

```
Sprint 1  Tier 1 atoms       → 11 preview cards
Sprint 2  Tier 2 navigation  → 6 preview cards + Sidebar upgrade in UI kit
Sprint 3  Tier 3 overlays    → 9 preview cards
Sprint 4  Tier 4 forms       → 12 preview cards
Sprint 5  Tier 5 data        → 10 preview cards
Sprint 6  Tier 6 structural  → 8 preview cards (no-JS doc)
```

**Total new cards: ~56**
**Total DS cards when done: ~71**

---

## Suggested next command

> _"Build Sprint 1 (Tier 1 atoms): Avatar, Checkbox, Switch, RadioGroup, Label, Separator, Skeleton, Spinner, Tooltip, TextLink, Toggle"_
