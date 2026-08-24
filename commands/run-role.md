---
description: Run one role subagent of the factory line, with only its declared inputs.
argument-hint: "<slot-id>  e.g. 400-architecture"
---

Run one slot of the delivery line.

SLOT: $1

## How to run it

1. **List the declared inputs first.** Run this yourself, putting the slot id in place of
   `<slot-id>`:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/role-inputs.mjs" <slot-id>
   ```

   With no slot id it prints every slot in run order. Anything marked `MISSING` is a seam, not a
   reason to improvise. If a required input is absent, record it in
   `factory/runs/<slug>/seam-ledger.md` and stop.
2. **Read the slot contract** at `${CLAUDE_PLUGIN_ROOT}/factory/subagent-slots/<slot-id>.md`. It is
   the source of truth. The adapter in `${CLAUDE_PLUGIN_ROOT}/agents/<slot-id>.md` is generated
   from it.
3. **Dispatch the subagent** named `<slot-id>`, in its own context. It reads only the files the
   script listed, and writes only the files it owns.
4. **Do not hand-feed context.** If the subagent asks for a fact that is not in its inputs, that is
   the finding. Record the seam. Do not answer with a new fact.
5. **Log it** — one row in the table in `factory/runs/<slug>/run-record.md`.
6. **Stop and report.** One slot per invocation. The next slot is a separate decision.

Run `/ai-factory:start` to see which slots already have their outputs on disk.
