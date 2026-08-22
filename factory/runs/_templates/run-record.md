# Run record — <run slug>

The summary a person reads instead of the whole folder. Fill it in last.

**Date:** YYYY-MM-DD · **Feature:** see `factory/feature.md` · **Roles run:** 8

## What ran, and what it cost

One row per role call. Bounds are in `factory/COST_GUARDRAILS.md`: one pass per role, default model
first, a premium model only for one named decision with the reason written here.

| # | Role | Wrote | Model | Why that model | Re-run? |
| - | ---- | ----- | ----- | -------------- | ------- |
| 1 | 100-consulting | | | | |
| 2 | 200-product | | | | |
| 3 | 300-design | | | | |
| 4 | 400-architecture | | | | |
| 5 | 500-engineering | | | | |
| 6 | 800-infra | | | | |
| 7 | 900-security | | | | |
| 8 | 600-qa | | | | |

## What broke

See `seam-ledger.md`. Summarise the three that matter.

## What stayed with a human

See `human-gates.md`. Summarise, including any gate marked `missed`.

## What to fix before the next run

One finding becomes one change to the factory. A change must name the file it edits — a slot
contract, the handoff map, the registry, or a template. "Improve the security prompt" is not a
change; "add a DON'T row to `factory/subagent-slots/900-security.md` forbidding a fix with no
number" is.

| # | From which finding | Change to make | Which file | Applied? | Did the next run fix it? |
| - | ------------------ | -------------- | ---------- | -------- | ------------------------ |
| 1 | | | | | |

The last column is filled in during the **next** run, not this one. That column is the whole point:
without it you never learn whether the fix worked.

---

## Done bar

- [ ] ≥3 seam findings, each naming a file and a fact
- [ ] ≥2 human-gate observations
- [ ] ≥1 change to make, naming its file
- [ ] one row per role call above
- [ ] no file was hand-fed outside a role's `reads:` list, or the exception is written down

A run that stopped and is honest about it passes. A clean demo that was staged does not.
