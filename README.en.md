# Jeremy Design

English | [简体中文](README.md)

A frontend design skill for Claude Code and Codex. It combines task-oriented HRAS enterprise workbench patterns with an on-demand Apple HIG reference library.

## Scope

Use [SKILL.md](SKILL.md) for routing and implementation guidance. Existing project design systems and explicit user choices take priority.

- Module home: actionable entries, availability, rules/help and recent batches.
- Batch review: scope controls, stage progress, records, exceptions and output actions.
- Apple-style mobile UI: load platform references only when relevant.
- Local fixes: preserve unrelated layout and verify the affected states.

[HRAS patterns](references/hras-workbench.md) document source revisions, two distinct compositions, paired colors, density, implementation snippets and counterexamples. These are adaptable patterns, not a universal template. No business records or brand assets are bundled.

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

The Apple reference library retains its original 2026-09 snapshot label; this revision does not reverify every HIG value. Consult [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) for current authoritative claims. Source labels distinguish observed HRAS patterns, HIG guidance, Apple examples, Web adaptations and adjustable project defaults.

MIT; see [LICENSE](LICENSE). Fluid motion references retain attribution to [emilkowalski/skills](https://github.com/emilkowalski/skills). Apple HIG belongs to Apple Inc.; this is not an official Apple product.
