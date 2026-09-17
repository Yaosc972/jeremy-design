# Jeremy Design

[English](README.en.md) | [简体中文](README.md)

Apple Human Interface Guidelines (HIG) frontend design reference — a Claude Code / Claude Agent skill.

It brings Apple's official HIG rules to frontend and UI design tasks. **All HIG rules and values are faithfully extracted from the official [developer.apple.com/design](https://developer.apple.com/design/human-interface-guidelines/) sources** (2026-09 snapshot), every value traceable to its origin — *exact values, not vibes*. On top of that sits a **separately labeled Web adaptation layer**: official guidance (`HIG`), Apple talks/examples (`APPLE-EXAMPLE`), browser engineering translation (`WEB-ADAPTATION`), and project defaults (`PROJECT-DEFAULT`) — four source types kept explicitly distinct. Coverage is a **curated summary of core topics**, not a wholesale excerpt of all 172 HIG pages (the full 172-page URL index lives in `references/hig-index-all-pages.md`).

> Note: the reference documents (`references/*.md`) are written in Chinese. This English README describes the project; the full normative content is currently Chinese-only.

---

## Why this exists

The HIG website is a SPA whose content hides behind a DocC JSON API and cannot be searched directly. Worse, the web is full of **misinformation** about Apple's design rules — the most widespread being the so-called "8pt grid", which the HIG never actually specifies. This project scrapes, parses, and organizes 172 HIG pages into searchable reference docs, with every value pinned to its original source.

Coverage includes:

- Per-platform sizes and touch targets (iOS / macOS / tvOS / visionOS / watchOS)
- The complete Dynamic Type size table (1038 lines)
- Semantic colors and Dark Mode
- Materials and Liquid Glass (iOS 26 / 2025 design system)
- Accessibility contrast thresholds (WCAG AA)
- Controls, icons, platform differences
- Web fluid-motion implementation parameters (springs, gestures, momentum projection, rubber-banding)

## Install

```bash
git clone https://github.com/Yaosc972/jeremy-design.git ~/.claude/skills/jeremy-design
```

Claude invokes it automatically for design tasks; you can also trigger it explicitly with phrases like `做个 iOS 风格设置页` (build an iOS-style settings page), `苹果设计规范` (Apple design rules), `44pt 触控目标` (44pt touch target).

## File structure

| File | Contents |
|---|---|
| `SKILL.md` | Entry point: source taxonomy + routing table + core quick reference + workflow/acceptance checks |
| `references/layout.md` | Layout, spacing, hierarchy, safe area |
| `references/typography.md` | Type, sizes, Dynamic Type, SF Pro / New York |
| `references/color-dark-mode.md` | Color, semantic colors, system palette, Dark Mode |
| `references/materials.md` | Materials, blur, Liquid Glass |
| `references/motion.md` | Motion, transitions, animation durations |
| `references/fluid-motion-web.md` | Spring parameters, gesture dragging, velocity handoff, momentum projection, rubber-banding, reduced-motion |
| `references/web-adaptation.md` | **Native concepts → Web adaptation layer**: unit strategy, semantic color tokens, safe area, modal semantics, degradation and acceptance baselines |
| `references/accessibility.md` | Contrast, touch targets, VoiceOver |
| `references/interaction-feedback.md` | Feedback, haptics, loading, gestures |
| `references/components-controls.md` | Buttons / dialogs / menus / toggles / sliders and other control specs |
| `references/icons-symbols.md` | App icons, SF Symbols |
| `references/platforms.md` | Per-platform differences |
| `references/design-principles.md` | Design principles, inclusion |
| `references/hig-index-all-pages.md` | Full URL index of all 172 HIG pages |
| `references/detail-audit.md` | **Pre-delivery detail audit (mandatory)**: four detection classes, breakpoint acceptance matrix, fix decision tree |
| `scripts/detail-audit.js` | Injectable detail detector (horizontal overflow / squeezed line-height / text overlap / CJK word splitting) |
| `scripts/audit-matrix.sh` | Breakpoint matrix runner: runs the detector across multiple states and summarizes (headless) |

## One example: touch targets

The common simplification online is "minimum 44×44pt". The HIG actually draws **two distinct distinctions**, covering three concepts (visualSize / hitRegion / spacing):

- **Button hit region** ≥ 44×44 pt (visionOS ≥ 60×60 pt) — from the buttons page, a hard requirement for button hit regions
- **Control default / minimum sizes**: iOS 44/28 · macOS 28/20 · tvOS 66/56 · visionOS 60/28 · watchOS 44/28 pt — the general controls table on the accessibility page

44 is iOS's **default**, not its minimum; and the 28×28 pt entry in the accessibility table is a general-control minimum and **must not** be read as "a button hit region can be 28". On the web, this project uses 44×44 CSS px as the default hit area (`PROJECT-DEFAULT`, not an Apple conversion; CSS pt ≠ Apple logical point). See `references/accessibility.md` and `references/web-adaptation.md`.

## Data source and updates

The rules snapshot is **2026-09**. Apple updates the HIG after every WWDC (Liquid Glass arrived with iOS 26 / 2025), so for critical projects verify against the live docs.

The re-scraping method is documented in `references/hig-index-all-pages.md`: the content endpoint is
`https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<topic>.json` (DocC JSON), and you must handle block types such as `tabNavigator` (the iOS Dynamic Type size table is split into tabs per size category).

## Known trade-offs

- The color palettes in the HIG are images and were not captured as text (and the HIG itself says not to hardcode system colors)
- The tvOS grid diagram is an image and is not included

## License

MIT, see [LICENSE](LICENSE). `references/fluid-motion-web.md` is adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) (MIT, © Emil Kowalski); the license notice is preserved in LICENSE per MIT terms.

Apple Human Interface Guidelines copyright belongs to Apple Inc.; this project is a **factual summary of its public technical specifications** (values, sizes, thresholds), not a reproduction of Apple's prose.
