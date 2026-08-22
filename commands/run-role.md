---
description: Run one role subagent of the factory line, with only its declared inputs.
argument-hint: "<slot-id>  e.g. 400-architecture"
---

Run one slot of the delivery line.

SLOT: $1

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/role-inputs.mjs" $1 2>&1 || true`

## How to run it

1. **Read the slot contract** at `${CLAUDE_PLUGIN_ROOT}/factory/subagent-slots/$1.md`. It is the source of truth. The
   adapter in `${CLAUDE_PLUGIN_ROOT}/agents/$1.md` is generated from it.
2. **Check the inputs above.** Anything `MISSING` is a seam, not a reason to improvise. If a
   required input is absent, record it in `factory/runs/<slug>/seam-ledger.md` and stop.
3. **Dispatch the subagent** named `$1`, in its own context. It reads only the files listed above
   and writes only the files listed above.
4. **Do not hand-feed context.** If the subagent asks for a fact that is not in its inputs, that is
   the finding. Record the seam. Do not answer with a new fact.
5. **Log it** — one row in the table in `factory/runs/<slug>/run-record.md`.
6. **Stop and report.** One slot per invocation. The next slot is a separate decision.

If `$1` is empty the output above lists the slots in run order. Run `/start` to see which of them
already have their outputs on disk.
