# Seam ledger — <run slug>

One row per edge in `factory/handoff-map.yaml`. A seam is one file crossing from one subagent to
the next. The line almost never breaks inside a subagent — it breaks here.

**Labels:** `clean` · `under-supply` (got less than it needed) · `over-supply` (got more than it
needed, scope crept) · `missing` (the file was not there) · `routing` (went to the wrong subagent).

**Trace a break back to the earliest subagent that could have carried the missing piece**, not the
one that noticed it. The notice point is a symptom.

| # | From | To | File | Label | What was actually missing or extra |
| - | ---- | -- | ---- | ----- | ---------------------------------- |
| 1 |      |    |      |       |                                    |

## Findings

A finding names a file and a fact. Write at least three.

> **Good:** 600-qa under-supplied by 900-security on `docs/900-security/02-mitigations.md` — the
> rate-limit mitigation has no number, so no test case could be written against it.
>
> **Not a finding:** "better cross-role communication".

1.
2.
3.

## The honest-run declaration

- Files hand-fed to a subagent outside its `reads:` list: **none** / list them.
- Slots that stopped: …
- Slots re-run: …

A run where every seam is clean and nothing was hand-fed is possible. A run where every seam is
clean *because* something was hand-fed teaches nothing — say which one this was.
