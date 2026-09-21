# Jeremy Design

English | [简体中文](README.md)

A frontend design skill for Claude Code and Codex. Apple-inspired design is the default foundation for websites, mobile interfaces and enterprise workbenches, without requiring an explicit Apple-style request. Compact layouts and lightweight data panels extend that same language.

## Scope

Use [SKILL.md](SKILL.md) for routing and implementation guidance. Existing project design systems and explicit user choices take priority.

- Visual hierarchy: color, type scales, spacing, borders, radii, shadows and surfaces.
- Composition: card grids, compact toolbars, data tables, primary/secondary regions and responsive reflow.
- Apple-style mobile UI: load platform references only when relevant.
- Local fixes: preserve unrelated layout and verify the affected states.

Start with the shared [Apple Web foundation](references/apple-web-foundation.md). [Workbench elements](references/enterprise-visual-language.md) extend it with paired colors, typography, density, surfaces and component composition. A navy sidebar, glass effects and blue branding are not defaults required by enterprise tasks. These are adaptable Web interpretations, not official Apple prescriptions; consult native HIG parameters only when needed. No business records or brand assets are bundled.

## Install

Choose one destination; inspect existing changes before updating an installed copy.

```bash
# Claude Code
git clone https://github.com/Yaosc972/jeremy-design.git ~/.claude/skills/jeremy-design
# Or Codex
git clone https://github.com/Yaosc972/jeremy-design.git ~/.codex/skills/jeremy-design
```

These commands install the remote default branch, not unpublished local changes. For local changes copy skill files while preserving destination Git metadata and personal edits.

## Validation and sources

See [validation guidance](references/detail-audit.md). Browser audit scripts are optional helpers; run `node tests/regression.mjs` after changing the audit tools (requires Node and Chrome). Static skill validation and geometry checks do not prove design quality. Evaluate routing with an enterprise review app, a narrow existing-UI fix, and an Apple-style mobile page.

Additional checks: `python3 tests/matrix-contract.py` and `node tests/visual-review-contract.mjs` run without a browser; `node tests/runner-errors.mjs` covers browser-runner failure paths.

[Finished UI checks](references/finished-ui-check.md) apply to both new and redesigned interfaces: operate, inspect, view screenshots, fix and retest. Inject `scripts/ui-self-check.js` into the current browser to record visibility, dismissal, containment and focus checks separately from visual reviews. It is neither an automatic repair tool nor an enforcement hook. Open `tests/ui-self-check.html` in a browser and inspect `window.selfCheckTests` for regression results; synthetic review records test bookkeeping only.

The Apple reference library retains its original 2026-09 snapshot label; this revision does not reverify every HIG value. Consult [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) for current authoritative claims. Source labels distinguish HIG guidance, Apple examples, Web adaptations and adjustable project defaults.

MIT; see [LICENSE](LICENSE). Fluid motion references retain attribution to [emilkowalski/skills](https://github.com/emilkowalski/skills). Apple HIG belongs to Apple Inc.; this is not an official Apple product.
