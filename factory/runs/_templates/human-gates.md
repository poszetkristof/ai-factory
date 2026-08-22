# Human gates — <run slug>

A human gate is a point where the line stops and a person decides. The policy is in
`factory/handoff-map.yaml` under `human_gate_policy`.

**Statuses:** `recorded-open` (fired, decision still open, line continued on a stated assumption) ·
`hard-stop` (line cannot continue) · `paused-approved` · `paused-blocked` · `missed` (should have
fired and did not — a finding, same weight as a broken seam) · `n/a`.

**A decision that exists only in this chat has not been made.** When you answer a gate, write the
answer into a file a role can read, then name that file below. Otherwise the next role is running on
hand-fed context and the run is no longer honest.

| # | Slot | What triggered it | Status | Decision, and who made it | Written into which file, read next by which role | Assumption the line continued on |
| - | ---- | ----------------- | ------ | ------------------------- | ------------------------------------------------ | -------------------------------- |
| 1 |      |                   |        |                           |                                                  |                                  |

## Gates that should have fired and did not

This section is the valuable one. Read each slot's output and ask: did it decide something that was
not its to decide?

1.

## Standing human-owned decisions on this project

Recorded here so a `missed` is easy to spot. None of these is ever a subagent's call.

- What gets built, and what ships when.
- Accepting any risk, security or architectural.
- What counts as personal data, and how long it is kept.
- Spending money. Deploying anything. Owning the kill-switch.
- Accepting a new dependency, or a new tool the model may call.
- Reversing an accepted ADR.
- The final merge, and the release go/no-go.
