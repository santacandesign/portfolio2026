---
name: ema-design
description: Use this skill to generate well-branded interfaces and assets for Ema (the Universal AI Employee platform), either for production or throwaway prototypes/mocks/slides/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Tokens**: `colors_and_type.css` — import this first.
- **Fonts**: `fonts/Satoshi-*.otf` (300–900 + italics).
- **Logo**: `assets/logo.svg`, `assets/logo-mark.svg`.
- **UI kit**: `ui_kits/web_app/` — open `index.html` to see the Ema app flow (Sidebar, Navbar, Dashboard, RunDetail, Composer).
- **Icons**: Phosphor — load via `<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1"/>` then `<i class="ph ph-magic-wand"></i>`.
- **Primary**: `var(--green-800)` `#1F8844` · hover `--green-900` · pressed `--green-930`.
- **Surface**: `var(--app-background)` `#FBFAF7` (beige-50, never pure white).
- **AI-generated content**: purple surface (`--ai-magic`) + `MagicWand` icon.
- **Radius**: 8 buttons, 12 cards/modals. **Shadow**: warm (`rgba(35,33,25,…)`). **Motion**: 150–400ms `cubic-bezier(0.16, 1, 0.3, 1)`, no bounce.
- **Voice**: calm, enterprise. Sentence case. No emoji. Second person for users, third person for Ema.
