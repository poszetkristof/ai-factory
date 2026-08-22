---
description: Where this project is right now, and the one thing to do next.
---

Wiring:

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/check-wiring.mjs" 2>&1 || true`

State:

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/line-state.mjs" 2>&1 || true`

---

## Read this, then say one thing

Work out which stage the project is in, and tell the user **the single next action** — not a plan,
not a menu. Then stop and wait.

| What you see above | Stage | Say to do this |
| --- | --- | --- |
| Wiring has problems | broken | Fix the wiring first. Nothing else is trustworthy |
| No run folder, no role ticked | line not started | Create `factory/runs/<slug>/` from `_templates/`, then `/run-role 100-consulting` |
| Some roles ticked, some not | line running | The role named as "next role to run": `/run-role <id>` |
| All 8 ticked, no `TASKS.md` | line finished | `/factory-run` to close the run — seams, gates, then generate `TASKS.md` |
| `TASKS.md` exists | building | `/next-task` |

## Things to know before answering

- **One role per session.** Do not chain two role runs without the user reading the first.
- **Do not fill a gap by hand.** If a role stopped because an input was missing, that is a finding
  for the seam ledger, not a question to answer.
- The rules, the routing table and the human-owned decisions are in `CLAUDE.md`, already loaded.
- The facts about the user, the project and the settled decisions are in `.claude/memory/`, already
  loaded. Do not re-ask a question that is answered there.
- **When the work finishes, the learning note is part of it.** Run `/learn` before saying done. If
  the user asks a question during the session, that is also a trigger — the notes did not answer
  it.
- If the user wants to understand the process rather than run it, point at
  `docs/learn/ai-native-delivery.md`. One note: part one is the idea, part two walks a whole run.
  `node "${CLAUDE_PLUGIN_ROOT}/scripts/learn-note.mjs"` prints its sections.
