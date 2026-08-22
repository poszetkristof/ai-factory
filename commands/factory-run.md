---
description: Start, resume or close a factory run — the state of the line and what to do next.
argument-hint: "[run-slug]"
---

RUN: $1 (empty means the most recent folder under `factory/runs/`)

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/line-state.mjs" 2>&1 || true`

## What to do

**No run folder yet** — create `factory/runs/<slug>/` and copy the three templates out of
`${CLAUDE_PLUGIN_ROOT}/factory/runs/_templates/`. The slug names the feature, not the date. Then run the first role.

**A role is unticked above** — that is the next one. Use `/run-role <slot-id>`. One role, then stop
and report.

**Every role is ticked** — close the run:

1. Walk every edge in `${CLAUDE_PLUGIN_ROOT}/factory/handoff-map.yaml` and fill in `seam-ledger.md`. Label each
   `clean` / `under-supply` / `over-supply` / `missing` / `routing`, and trace each break back to
   the **earliest** role that could have carried the missing piece.
2. Fill in `human-gates.md`, including gates that should have fired and did not.
3. Fill in `run-record.md`: what ran, what it cost, what broke, what to fix. Check its done bar:
   ≥3 seam findings, ≥2 gate observations, ≥1 change to make.

## Rules for the whole run

- **One pass per role.** Bounds in `factory/COST_GUARDRAILS.md`.
- **Do not hand-feed context to keep the line moving.** A stop is a finding, not a failure.
- **Never edit `${CLAUDE_PLUGIN_ROOT}/agents/*.md`.** Edit the slot or the map, then run
  `node "${CLAUDE_PLUGIN_ROOT}/scripts/derive-agents.mjs"`.
- Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/check-wiring.mjs"` before starting. A dangling read or a double-written file is
  a wiring bug, and it will look like a subagent mistake later.
